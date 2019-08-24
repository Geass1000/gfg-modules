import * as _ from 'lodash';

import { TreeNode } from '../core/tree';
import { Interfaces } from './shared';

export class ModuleTreeStore {
  private _globalNodes: TreeNode<Interfaces.InjectableModule>[];
  public get globalNodes (): TreeNode<Interfaces.InjectableModule>[] {
    return this._globalNodes;
  }
  public set globalNodes (value: TreeNode<Interfaces.InjectableModule>[]) {
    this._globalNodes = value;
  }

  private _appNode: TreeNode<Interfaces.InjectableModule>;
  public get appNode (): TreeNode<Interfaces.InjectableModule> {
    return this._appNode;
  }
  public set appNode (value: TreeNode<Interfaces.InjectableModule>) {
    this._appNode = value;
  }

  constructor (
    globalNodes: TreeNode<Interfaces.InjectableModule>[],
    appNode: TreeNode<Interfaces.InjectableModule>,
  ) {
    this._globalNodes = globalNodes;
    this._appNode = appNode;
  }

  isGlobalNode (node: TreeNode<Interfaces.InjectableModule>) {
    return _.some(this._globalNodes, (globalNode) => {
      return globalNode === node;
    });
  }
}
