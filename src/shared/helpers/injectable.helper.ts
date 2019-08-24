import * as _ from 'lodash';

import { MetadataHelper } from './metadata.helper';
import { MetadataInterfaces, InjectableInterfaces } from '../interfaces';

export class InjectableHelper {

  static getInjectableKey (
    provider: InjectableInterfaces.InjectableProvider
  ): InjectableInterfaces.InjectableKey {
    const providerKey = _.get(provider, 'provider', provider);

    if (_.isNil(providerKey)) {
      throw new Error(`Provider not defined correct. Use correct 'Class Name' or 'Provider Token'`);
    }

    return providerKey;
  }

  static isGlobalProvider (
    provider: InjectableInterfaces.InjectableProvider
  ): boolean {
    const isGlobal = _.get(provider, 'isGlobal', false);
    return isGlobal;
  }

  static getClassDependencies (pvKey: InjectableInterfaces.ClassType) {
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
