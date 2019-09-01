import * as _ from 'lodash';

import { Interfaces } from '../shared';
import { Helper } from '../shared';

export function Inject (token: Interfaces.ComponentKey) {
  return (target: any, propertyKey: string | symbol, paramIndex?: number) => {
    const diKey = token || Reflect.getMetadata('design:type', target, propertyKey);

    if (_.isUndefined(paramIndex)) {
      Helper.setPropertyDependencies(diKey, target.constructor, propertyKey);
      return;
    }

    if (_.isNil(diKey)) {
      throw new Error(`${target.name} (${paramIndex} -> ${token}). DI Key is required.`);
    }

    Helper.setParameterDependencies(diKey, target, paramIndex);
  };
}
