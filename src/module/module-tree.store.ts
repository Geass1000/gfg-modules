import * as _ from 'lodash';

import { TreeNode } from '../core/tree';
import { InjectableInterfaces } from '../shared/interfaces';

export class ModuleTreeStore {
  private _globalNodes: TreeNode<InjectableInterfaces.InjectableProvider>[];
  public get globalNodes (): TreeNode<InjectableInterfaces.InjectableProvider>[] {
    return this._globalNodes;
  }
  public set globalNodes (value: TreeNode<InjectableInterfaces.InjectableProvider>[]) {
    this._globalNodes = value;
  }

  private _appNode: TreeNode<InjectableInterfaces.InjectableProvider>;
  public get appNode (): TreeNode<InjectableInterfaces.InjectableProvider> {
    return this._appNode;
  }
  public set appNode (value: TreeNode<InjectableInterfaces.InjectableProvider>) {
    this._appNode = value;
  }

  constructor (
    globalNodes: TreeNode<InjectableInterfaces.InjectableProvider>[],
    appNode: TreeNode<InjectableInterfaces.InjectableProvider>,
  ) {
    this._globalNodes = globalNodes;
    this._appNode = appNode;
  }

  isGlobalNode (node: TreeNode<InjectableInterfaces.InjectableProvider>) {
    return _.some(this._globalNodes, (globalNode) => {
      return globalNode === node;
    });
  }
}
