import * as _ from 'lodash';

import * as Interfaces from './interfaces';

import * as GfgDecorators from '../../decorators';

export class Helper {

  static getClassDependencies (pvKey: Interfaces.Provider.InjectableKey) {
    const classParams: any[] = Reflect.getMetadata(`design:paramtypes`, pvKey) || [];

    const config: Interfaces.Provider.InjectableClass =
      GfgDecorators.Helper.getDecoratorConfig(pvKey);
    const injectedParams: GfgDecorators.Interfaces.ParameterDependency[] =
      GfgDecorators.Helper.getParameterDependencies(pvKey);
    const injectedProps: GfgDecorators.Interfaces.PropertyDependency[] =
      GfgDecorators.Helper.getPropertyDependencies(pvKey);

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
