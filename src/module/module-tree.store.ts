import * as _ from 'lodash';

import { TreeNode } from '../core/tree';
import { Interfaces } from './shared';

export class ModuleTreeStore {
  private _globalNodes: TreeNode<Interfaces.ModuleTreeNode>[];
  public get globalNodes (): TreeNode<Interfaces.ModuleTreeNode>[] {
    return this._globalNodes;
  }
  public set globalNodes (value: TreeNode<Interfaces.ModuleTreeNode>[]) {
    this._globalNodes = value;
  }

  private _appNode: TreeNode<Interfaces.ModuleTreeNode>;
  public get appNode (): TreeNode<Interfaces.ModuleTreeNode> {
    return this._appNode;
  }
  public set appNode (value: TreeNode<Interfaces.ModuleTreeNode>) {
    this._appNode = value;
  }

  constructor (
    globalNodes: TreeNode<Interfaces.ModuleTreeNode>[],
    appNode: TreeNode<Interfaces.ModuleTreeNode>,
  ) {
    this._globalNodes = globalNodes;
    this._appNode = appNode;
  }

  isGlobalNode (node: TreeNode<Interfaces.ModuleTreeNode>) {
    return _.some(this._globalNodes, (globalNode) => {
      return globalNode === node;
    });
  }
}
