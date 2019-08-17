import * as _ from 'lodash';

export class TreeNode<T = any> {
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

  private _value: any;
  public get value (): any {
    return this._value.value;
  }

  constructor (value: T) {
    this._value = value;
    this._children = [];
  }

  /**
   * Sets the list of node of children.
   *
   * @param  {TreeNode[]} children
   * @returns void
   */
  public setChildren (children: TreeNode[]): void {
    this._children = [ ...children, ];
  }

  /**
   * Sets the list of node of children.
   *
   * @param  {TreeNode[]} children
   * @returns void
   */
  public removeChild (child: TreeNode): void {
    _.remove(this._children, child);
  }
}
