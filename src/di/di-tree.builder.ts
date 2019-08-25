import * as _ from 'lodash';

import { ModuleTreeStore } from '../module/module-tree.store';
import { InjectableInterfaces } from '../shared/interfaces';
import { Tree, TreeNode } from 'core/tree';

export class DITreeBuilder {
  private modules: InjectableInterfaces.ClassType[];
  private moduleStore: ModuleTreeStore;

  public build (moduleStore: ModuleTreeStore) {
    this.moduleStore = moduleStore;
    const globalNodes = this.moduleStore.globalNodes;
    const rootNode = this.moduleStore.appNode;

    const appNodes = [ ...globalNodes, rootNode ];

    _.map(appNodes, (appNode) => {
      const treeFromAppNode = new Tree(appNode);
      // const diTree = treeFromRootNode.createEmptyClone():
      // const diTreeIterator = treeFromRootNode.getPreorderIterator();
      const treeIterator = treeFromAppNode.getPreorderIterator();
      for (treeIterator.start(); !treeIterator.isStoped(); treeIterator.next()) {
        const treeNode = treeIterator.value;
        const exportStore = this.buildExportStore(treeNode);
        const diNodeList = this.buildDINodeList(treeNode);
        // TODO: set exportStore and diNodeList to DI Tree Node
      }
    });
  }

  buildExportStore (node: TreeNode) {
    // Dependency : TreeNode with diNodeList
    const exportStore = new Map<InjectableInterfaces.InjectableKey, TreeNode>();

    const globalModules = _.map(this.moduleStore.globalNodes, (globalNode) => {
      return globalNode.value.component;
    });

    this.modules = [ ...globalModules ];

    // Add dependencies to exportStore

    return exportStore;
  }

  buildProviderContainer (node: TreeNode<InjectableInterfaces.InjectableProvider>) {
    // Build sorted DI Node List
    const pvContainer = ProviderContainer.create();
    const nodeTree = new Tree(node);

    const nodeTreeIterator = nodeTree.getPostorderIterator();
    for (nodeTreeIterator.start(); !nodeTreeIterator.isStoped(); nodeTreeIterator.next()) {
      const diTreeNode = nodeTreeIterator.value;
      pvContainer.addProvider(diTreeNode.value);
    }

    return pvContainer;
  }
}
