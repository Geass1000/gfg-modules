import { TreeNode } from '../core/tree';

export class ModuleTreeStore {
  private _globalNodes: TreeNode[];
  public get globalNodes (): TreeNode[] {
    return this._globalNodes;
  }
  public set globalNodes (value: TreeNode[]) {
    this._globalNodes = value;
  }

  private _appNode: TreeNode;
  public get appNode (): TreeNode {
    return this._appNode;
  }
  public set appNode (value: TreeNode) {
    this._appNode = value;
  }

  constructor (
    globalNodes: TreeNode[],
    appNode: TreeNode,
  ) {
    this._globalNodes = globalNodes;
    this._appNode = appNode;
  }
}
