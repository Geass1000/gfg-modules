import { GfgHelper } from './../shared/gfg.helper';
import { Container } from '../di/container';
import { Token } from '../token';
import * as _ from 'lodash';

export function Inject(token: Token) {
  return (target: Object, propertyKey: string | symbol, paramIndex: number) => {
    const diKey = _.isUndefined(token) || Reflect.getMetadata('design:type', target, propertyKey);
    
    if (paramIndex === 0) {
      GfgHelper.setParameterDeps(diKey, target, paramIndex);
      return;
    }

    GfgHelper.setPropertyDeps(diKey, target, propertyKey);
  };
}
