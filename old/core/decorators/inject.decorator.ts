import { GfgHelper } from './../shared/gfg.helper';
import { Token } from '../token';
import * as _ from 'lodash';

export function Inject (token: Token) {
  return (target: any, propertyKey: string | symbol, paramIndex?: number) => {
    const diKey = token || Reflect.getMetadata('design:type', target, propertyKey);

    if (_.isUndefined(paramIndex)) {
      GfgHelper.setPropertyDeps(diKey, target.constructor, propertyKey);
      return;
    }

    if (_.isNil(diKey)) {
      throw new Error(`${target.name} (${paramIndex} -> ${token}). DI Key is required.`);
    }

    GfgHelper.setParameterDeps(diKey, target, paramIndex);
  };
}
