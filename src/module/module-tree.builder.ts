import * as _ from 'lodash';

import { TreeNode } from '../core/tree';
import { Interfaces as DIInterfaces, Helper } from '../shared';
import { ModuleTreeStore } from './module-tree.store';
import { Interfaces } from './shared';
import { ComponentToken, ComponentContainer } from '../component';

export class ModuleTreeBuilder {
  private globalNodes: TreeNode<Interfaces.ModuleTreeNode>[];

  /**
   * Creates an instance of module tree store.
   *
   * @param  {InjectableInterfaces.ClassType} rootComponent - root injectable component
   * @returns ModuleTreeStore
   */
  public build (
    rootComponent: DIInterfaces.ModuleClass,
  ): ModuleTreeStore {
    this.globalNodes = [];
    // Build tree node of root injectable component
    const appNode = this.buildAppTreeNode(rootComponent);

    // Create an instance of module tree store
    const moduleTreeStore = new ModuleTreeStore(this.globalNodes, appNode);
    return moduleTreeStore;
  }

  /**
   * Builds tree node of root injectable component.
   *
   * @param  {InjectableInterfaces.ClassType} rootComponent - root injectable component
   * @returns TreeNode
   */
  public buildAppTreeNode (
    rootModule: DIInterfaces.ModuleClass,
  ): TreeNode<Interfaces.ModuleTreeNode> {
    // Creates DI Tree for `root` module and global DITNs
    const rootNode = this.buildTreeNode(null, rootModule);
    return rootNode;
  }

  /**
   * Builds tree node of injectable component.
   *
   * @param  {TreeNode} parentTreeNode - parent of injectable component
   * @param  {InjectableInterfaces.ClassType} curComponent - injectable component
   * @returns TreeNode
   */
  public buildTreeNode (
    parentTreeNode: TreeNode<Interfaces.ModuleTreeNode>,
    importElement: DIInterfaces.ImportSectionElement,
  ): TreeNode<Interfaces.ModuleTreeNode> {
    // Get config of injectable component
    const moduleKey = Helper.getModuleKey(importElement);
    const moduleConfig = Helper.getDecoratorConfig(moduleKey) as DIInterfaces.ModuleDecorator;

    const cmpContainer = ComponentContainer.create();
    _.forEach(moduleConfig.components, (component) => {
      cmpContainer.addProvider(component);
    });
    cmpContainer.addProvider(moduleKey);

    // Create tree node for injectable component
    const moduleNode = new TreeNode<Interfaces.ModuleTreeNode>({
      key: moduleKey,
      container: cmpContainer,
    });

    // Iterate each import component of injectable component
    const importNodes = _.chain(moduleConfig.imports)
      .map((importProvider) => {
        return this.buildTreeNode(moduleNode, importProvider);
      })
      .filter((importComponent) => !_.isNull(importComponent))
      .value();

    // Set parent of injectable component to parent tree node
    moduleNode.parent = parentTreeNode;

    // Set children to tree node of injectable component
    moduleNode.setChildren(importNodes);

    // Calculate `Is Global` flag of import component
    const isGlobal = Helper.isGlobalModule(importElement);

    // If import component is a local component
    if (!isGlobal) {
      return moduleNode;
    }

    // Add global tree node to array of global nodes
    this.globalNodes.push(moduleNode);
    // Return null
    return null;
  }
}
