import { TreeNode } from '../core/tree';

export class ModuleTreeStore {
  private globalNodes: TreeNode[];
  private appNode: TreeNode;

  constructor (
    globalNodes: TreeNode[],
    appNode: TreeNode,
  ) {
    this.globalNodes = globalNodes;
    this.appNode = appNode;
  }
}
