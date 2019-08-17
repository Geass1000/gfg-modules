import * as _ from 'lodash';

import { MetadataHelper } from './metadata.helper';
import { MetadataInterfaces, InjectableInterfaces } from '../interfaces';

export class InjectableHelper {

  static getClassDependencies (pvKey: InjectableInterfaces.InjectableKey) {
    const classParams: any[] = Reflect.getMetadata(`design:paramtypes`, pvKey) || [];

    const config: any = MetadataHelper.getDecoratorConfig(pvKey);
    const injectedParams: MetadataInterfaces.ParameterDependency[] =
      MetadataHelper.getParameterDependencies(pvKey);
    const injectedProps: MetadataInterfaces.PropertyDependency[] =
      MetadataHelper.getPropertyDependencies(pvKey);

    const injectedClassParams = _.map(classParams, (classParam, index) => {
      const injectedParam = _.find(injectedParams, [ 'index', index ]);
      if (!_.isUndefined(injectedParam)) {
        return injectedParam.value;
      }

      if (this.isNativeType(classParam)) {
        throw new Error(`${pvKey.name} (${index} -> ${classParam.name}). Native types not supported.`);
      }

      return classParam;
    });

    return {
      config: config,
      params: injectedClassParams,
      props: injectedProps,
    };
  }

  /**
   * Checks the metatype.
   * If metatype is a `native` type method will return `true'.
   *
   * @return {boolean}
   */
  static isNativeType (metatype: any): boolean {
    const types: any[] = [ String, Boolean, Number, Object ];
    return _.includes(types, metatype);
  }
}
