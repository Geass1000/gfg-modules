import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { TreeNode } from './tree-node';
import { PreorderIterator } from './interators/preorder.iterator';

export class Tree {
  public get root (): TreeNode {
    return this.rootNode;
  }

  constructor (
    private rootNode: TreeNode,
  ) { }

  public preorderTraversal () {
    return new PreorderIterator(this.rootNode);
  }
  public postorderTraversal (): any {
  }
  public inorderTraversal (): any {
  }
}
