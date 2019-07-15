import * as _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class ReversePreorderIterator extends BaseIterator {

  protected iterate (node: TreeNode): any {
    if (this.stopNotif$.closed) {
      return;
    }

    this.notif$.next(node);

    const childrenLength = node.children.length;

    for (let i = childrenLength - 1; i >= 0; i--) {
      this.iterate(node.children[i]);
    }
  }
}
