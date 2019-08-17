import * as _ from 'lodash';

import * as GfgModule from '../module';

import { Helper, Interfaces } from './shared';

export function Module (config: Interfaces.Decorator.Module) {
  return <T extends new(...args: any[]) => {}>(targetModule: T) => {
    Helper.setInjectableClass(targetModule);
    Helper.setDecoratorConfig(config, targetModule);
  };
}
