import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TreeNode } from '../tree-node';

export class BaseIterator {
  protected notif$ = new Subject<TreeNode>();
  protected stopNotif$: Subject<void>;
  constructor (
    private rootNode: TreeNode,
  ) {}

  getNotifier () {
    this.stopNotif$ = new Subject<void>();
    return this.notif$
      .pipe(takeUntil(this.stopNotif$));
  }

  traverse () {
    this.iterate(this.rootNode);
    this.stopNotif$.next();
    this.stopNotif$.complete();
    this.stopNotif$ = null;
  }

  protected iterate (node: TreeNode): any {
  }
}
