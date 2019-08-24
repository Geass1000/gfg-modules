import * as _ from 'lodash';

import { ModuleTreeStore } from '../module/module-tree.store';
import { InjectableInterfaces } from '../shared/interfaces';
import { Tree, TreeNode } from 'core/tree';

export class DITreeBuilder {
  private modules: InjectableInterfaces.ClassType[];
  private moduleStore: ModuleTreeStore;

  public build (moduleStore: ModuleTreeStore) {
    this.moduleStore = moduleStore;
    const rootNode = this.moduleStore.appNode;

    const treeFromRootNode = new Tree(rootNode);
    // const diTree = treeFromRootNode.createEmptyClone():
    // const diTreeIterator = treeFromRootNode.getPreorderIterator();
    const treeIterator = treeFromRootNode.getPreorderIterator();
    for (treeIterator.start(); !treeIterator.isStoped(); treeIterator.next()) {
      const treeNode = treeIterator.value;
      const exportStore = this.buildExportStore(treeNode);
      const diNodeList = this.buildDINodeList(treeNode);

      // TODO: set exportStore and diNodeList to DI Tree Node
    }
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

  buildDINodeList (node: TreeNode) {
    // Exclude from global nodes current node if it is a global node
    const globalNodes = _.reject(this.moduleStore.globalNodes, (globalNode) => {
      return globalNode === node;
    });
    // Create list of DI nodes
    const diNodes = [ ...globalNodes, node ];

    const sortedDiNodes: TreeNode[] = [];
    // Build sorted DI Node List
    _.map(diNodes, (diNode) => {
      const diNodeTree = new Tree(diNode);
      const diNodeTreeIterator = diNodeTree.getPostorderIterator();
      for (diNodeTreeIterator.start(); !diNodeTreeIterator.isStoped(); diNodeTreeIterator.next()) {
        sortedDiNodes.push(diNodeTreeIterator.value);
      }
    });

    return sortedDiNodes;
  }
}
