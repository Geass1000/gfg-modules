import * as _ from 'lodash';

import { TreeNode } from '../core/tree';
import { InjectableInterfaces } from '../shared/interfaces';
import { MetadataHelper, InjectableHelper } from '../shared/helpers';
import { ModuleTreeStore } from './module-tree.store';
import { Interfaces } from './shared';
import { ProviderToken, ProviderContainer } from '../provider';

export class ModuleTreeBuilder {
  private globalNodes: TreeNode<Interfaces.ModuleTreeNode>[];

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
  ): TreeNode<Interfaces.ModuleTreeNode> {
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
    parentTreeNode: TreeNode<Interfaces.ModuleTreeNode>,
    provider: InjectableInterfaces.InjectableProvider,
  ): TreeNode<Interfaces.ModuleTreeNode> {
    // Get config of injectable component
    const injectableKey = InjectableHelper.getInjectableKey(provider);

    let injectableElement = injectableKey as InjectableInterfaces.ClassType;
    if (_.has(provider, 'useClass')) {
      injectableElement = (provider as InjectableInterfaces.InjectableElement.Class).useClass;
    } else if (_.has(provider, 'useFactory')) {
      injectableElement = (provider as InjectableInterfaces.InjectableElement.Factory).useFactory;
    } else if (_.has(provider, 'provide')) {
      injectableElement = null;
    }

    if (_.isNil(injectableElement)) {
      return null;
    }

    const componentConfig = MetadataHelper.getDecoratorConfig(injectableElement);

    if (_.isNil(componentConfig) || _.isEmpty(componentConfig.imports)) {
      return null;
    }

    const pvContainer = ProviderContainer.create();
    _.forEach(componentConfig.imports, (importProvider) => {
      pvContainer.addProvider(importProvider);
    });

    // Create tree node for injectable component
    const providerNode = new TreeNode<Interfaces.ModuleTreeNode>({
      key: injectableKey,
      container: pvContainer,
    });
    // Set parent of injectable component to parent tree node
    providerNode.parent = parentTreeNode;

    // Iterate each import component of injectable component
    const providerNodes = _.chain(componentConfig.imports)
      .map((importProvider) => {
        return this.buildTreeNode(providerNode, importProvider);
      })
      // Filter non null values
      .filter((importComponent) => !_.isNull(importComponent))
      .value();

    // Set children to tree node of injectable component
    providerNode.setChildren(providerNodes);

    // Calculate `Is Global` flag of import component
    const isGlobal = InjectableHelper.isGlobalProvider(provider);

    // If import component is a local component
    if (!isGlobal) {
      return providerNode;
    }

    // Add global tree node to array of global nodes
    this.globalNodes.push(providerNode);
    // Return null
    return null;
  }
}
