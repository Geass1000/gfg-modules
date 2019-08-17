import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { TreeNode } from './tree-node';
import { PostorderIterator, PreorderIterator } from './interators';

export class Tree {
  public get root (): TreeNode {
    return this.rootNode;
  }

  constructor (
    private rootNode: TreeNode,
  ) { }

  public getPreorderIterator () {
    return new PreorderIterator(this.root);
  }

  public getPostorderIterator () {
    return new PostorderIterator(this.root);
  }

  public getInorderIterator (): any {
  }
}