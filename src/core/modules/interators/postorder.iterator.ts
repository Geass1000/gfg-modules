import * as _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class PostorderIterator extends BaseIterator {

  protected iterate (node: TreeNode): any {
    if (this.stopNotif$.closed) {
      return;
    }

    _.forEach(node.children, (child) => {
      this.iterate(child);
    });

    this.notif$.next(node);
  }
}
