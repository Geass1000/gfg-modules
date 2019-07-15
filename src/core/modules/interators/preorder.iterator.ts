import * as _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class PreorderIterator extends BaseIterator {

  protected iterate (node: TreeNode): any {
    this.notif$.next(node);

    if (!node.children.length) {
      return;
    }

    _.forEach(node.children, (child) => {
      this.iterate(child);
    });
  }
}
