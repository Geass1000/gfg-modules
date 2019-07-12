import { Singleton } from './shared/singleton.base';
import * as _ from 'lodash';

import { Tree } from './elements/tree';

export class App extends Singleton {

  public bootstrapModule(moduleClass: any) {
    this.createTree(moduleClass);
  }

  private createTree(rootElement: any) {
    // const diTree = Tree.getInstance();
    // diTree.create(rootElement);
  }
}
