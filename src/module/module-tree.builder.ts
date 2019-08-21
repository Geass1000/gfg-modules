import * as _ from 'lodash';

import { Tree, TreeNode } from '../core/tree';
import { InjectableInterfaces } from '../shared/interfaces';
import { MetadataHelper } from '../shared/helpers';
import { ModuleTreeStore } from './module-tree.store';
import { ProviderContainer } from '../provider';
import { Interfaces } from './shared';

export class ModuleTreeBuilder {
  private globalNodes: TreeNode<Interfaces.InjectableModule>[];

  /**
   * Creates an instance of module tree store.
   *
   * @param  {InjectableInterfaces.ClassType} rootComponent - root injectable component
   * @returns ModuleTreeStore
   */
  public build (
    rootComponent: InjectableInterfaces.ClassType,
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
    rootComponent: InjectableInterfaces.ClassType,
  ): TreeNode<Interfaces.InjectableModule> {
    // Creates DI Tree for `root` module and global DITNs
    const rootNode = this.buildTreeNode(null, rootComponent);
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
    parentTreeNode: TreeNode<Interfaces.InjectableModule>,
    curComponent: InjectableInterfaces.ClassType,
  ): TreeNode<Interfaces.InjectableModule> {
    // Get config of injectable component
    const componentConfig = MetadataHelper.getDecoratorConfig(curComponent);

    // Create container for injectable component
    const container = ProviderContainer.create();
    // Add each provider of injectable component to container
    _.forEach(componentConfig.providers, (provider) => {
      container.addProvider(provider);
    });
    // Add injectable component to container
    container.addProvider(curComponent);

    // Create tree node for injectable component
    const node = new TreeNode<Interfaces.InjectableModule>({
      component: curComponent,
      config: componentConfig,
      container: container,
    });
    // Set parent of injectable component to parent tree node
    node.parent = parentTreeNode;

    // Iterate each import component of injectable component
    const componentNodes = _.chain(componentConfig.imports)
      .map((importComponent) => {
        // Calculate `Is Global` flag of import component
        const isGlobal = _.get(importComponent, 'isGlobal', false);

        // If import component is a local component
        if (!isGlobal) {
          // Build tree node of local component and return it
          const localComponent = importComponent as InjectableInterfaces.ClassType;
          return this.buildTreeNode(node, localComponent);
        }

        // // Build tree node of global component
        const globalComponent = importComponent as InjectableInterfaces.GlobalInjectableImport;
        const globalTreeNode = this.buildTreeNode(null, globalComponent.element);
        // Add global tree node to array of global nodes
        this.globalNodes.push(globalTreeNode);
        // Return null
        return null;
      })
      // Filter non null values
      .filter((importComponent) => !_.isNull(importComponent))
      .value();

    // Set children to tree node of injectable component
    node.setChildren(componentNodes);

    // Return tree node
    return node;
  }
}
