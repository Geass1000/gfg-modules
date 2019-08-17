import * as _ from 'lodash';

import * as GfgModule from '../module';

import { Helper, Interfaces } from './shared';

export function Injectable (config?: Interfaces.Decorator.Injectable) {
  return <T extends new(...args: any[]) => {}>(targetInjectable: T) => {
    Helper.setInjectableClass(targetInjectable);
    Helper.setDecoratorConfig(config, targetInjectable);
  };
}
