import * as _ from 'lodash';
import { Interfaces } from './shared';
import * as DI from '../di';

export class TreeNode {
  private _parent!: TreeNode;
  public get parent (): TreeNode {
    return this._parent;
  }
  public set parent (parentNode: TreeNode) {
    this._parent = parentNode;
  }

  private _children!: TreeNode[];
  public get children (): TreeNode[] {
    return [ ...this._children ];
  }

  private _data: Interfaces.TreeNode.Data;
  public get value (): any {
    return this._data.value;
  }
  public get container (): DI.Container {
    return this._data.container;
  }

  constructor (data: Interfaces.TreeNode.Data) {
    this._data = data;
    this._children = [];
  }

  /**
   * Sets the list of node of children.
   *
   * @param  {TreeNode[]} children
   * @returns void
   */
  public addChildren (children: TreeNode|TreeNode[]): void {
    this._children = _.concat(this.children, children);
  }

  /**
   * Sets the list of node of children.
   *
   * @param  {TreeNode[]} children
   * @returns void
   */
  public removeChildren (child: TreeNode): void {
    _.remove(this._children, child);
  }

  /**
   * Checks: Is the right node/provider?
   *
   * @param  {any} provider
   * @returns boolean
   */
  public isModule (provider: TreeNode): boolean;
  public isModule (provider: any): boolean {
    let value: any;

    if (provider instanceof TreeNode) {
      value = provider.value;
    } else {
      value = provider;
    }

    return this.value === value;
  }
}
