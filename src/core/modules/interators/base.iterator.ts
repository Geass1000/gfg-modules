import * as _ from 'lodash';

import { TreeNode } from '../tree-node';

export class BaseIterator {
  protected nodeStack: TreeNode[];

  protected isStopedFlag: boolean;

  protected _value: TreeNode;
  public get value (): TreeNode {
    return this._value;
  }

  constructor (
    protected root: TreeNode,
  ) {}

  start (): void {
    this.nodeStack = [ this.root ];
    this.isStopedFlag = false;
    this.next();
  }

  stop (): void {
    this.isStopedFlag = true;
  }

  isStoped (): boolean {
    return this.isStopedFlag;
  }

  next (): void {
  }

  reset (): void {
    this.start();
  }
}
