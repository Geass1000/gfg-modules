import * as _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class PostorderIterator <TND> extends BaseIterator<TND> {
  private output: TreeNode<TND>[];

  start () {
    this.output = [];
    super.start();
  }

  next (): void {
    if (!this.nodeStack.length && !this.output.length) {
      this.isStopedFlag = true;
      return;
    }

    while (!!this.nodeStack.length) {
      const node = this.nodeStack.pop();

      if (!node.children.length) {
        this._value = node;
        return;
      }

      this.output.push(node);

      for (let i = node.children.length - 1; i >= 0; i--) {
        this.nodeStack.push(node.children[i]);
      }
    }

    this._value = this.output.pop();
  }
}
