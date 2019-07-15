import * as _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class PreorderIterator extends BaseIterator {

  protected iterate (node: TreeNode): any {
    if (this.stopNotif$.closed) {
      return;
    }

    this.notif$.next(node);

    _.forEach(node.children, (child) => {
      this.iterate(child);
    });
  }
}
