import { Singleton } from './shared/singleton.base';
import * as _ from 'lodash';

import * as Modules from './modules/manager.builder';

export class App extends Singleton {

  public bootstrapModule (rootModule: any) {
    this.initModuleSystem(rootModule);
  }

  private async initModuleSystem (rootModule: any) {
    const moduleTreeBuilder = Modules.ManagerBuilder.getInstance();
    await moduleTreeBuilder.build(rootModule);
  }

  // private initModuleSystem (rootModule: any) {
  //   const modulesManagerBuilder = Modules.ManagerBuilder.getInstance();
  //   const moduleManager = modulesManagerBuilder.build(rootModule);
  //   moduleManager.init();
  // }
}
