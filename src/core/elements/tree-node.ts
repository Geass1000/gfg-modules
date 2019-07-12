import * as _ from 'lodash';
import * as Interfaces from './shared/interfaces';

export class TreeNode {
  private _parent!: TreeNode;
  public get parent(): TreeNode {
    return this._parent;
  }

  private children!: TreeNode[];

  private _data: Interfaces.TreeNodeData;
  public get data(): Interfaces.TreeNodeData {
    return this._data;
  }

  constructor(data: Interfaces.TreeNodeData) {
    this._data = data;
    this.children = [];
  }

  /**
   * Sets the list of node of children.
   * 
   * @param  {TreeNode[]} children
   * @returns void
   */
  public addChildren(children: TreeNode|TreeNode[]): void {
    this.children = _.concat(this.children, children);
  }

  /**
   * Sets the link to the parent.
   *
   * @param  {TreeNode<T} parent
   * @returns void
   */
  public setParent(parent: TreeNode): void {
    this._parent = parent;
  }

  /**
   * Finds the provider in the provider list of this node.
   * 
   * @param  {any} provider
   * @returns boolean
   */
  public hasNode(provider: any): boolean {
    return _.some(this.children, (child) => {
      return child.isNode(provider);
    });
  }

  /**
   * Checks: Is the right node/provider? 
   *
   * @param  {any} provider
   * @returns boolean
   */
  public isNode(provider: TreeNode): boolean;
  public isNode(provider: any): boolean {
    let value: any;

    if (provider instanceof TreeNode) {
      value = provider.data.value;
    } else {
      value = provider;
    }

    return this.data.value === value;
  }
}
