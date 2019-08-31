import * as _ from 'lodash';

import { MetadataHelper } from './metadata.helper';
import * as Interfaces from '../interfaces';

export class InjectableHelper {

  static getInjectableKey (
    componentElement: Interfaces.ComponentSectionElement
  ): Interfaces.ComponentKey {
    const componentKey = _.get(componentElement, 'key', componentElement);

    if (_.isNil(componentKey)) {
      throw new Error(`Component not defined correct. Use correct 'Class Name' or 'Component Token'`);
    }

    return componentKey;
  }

  static isGlobalModule (
    importElement: Interfaces.ImportSectionElement
  ): boolean {
    const isGlobal = _.get(importElement, 'isGlobal', false);
    return isGlobal;
  }

  static getClassDependencies (pvKey: Interfaces.ComponentClass) {
    const classParams: any[] = Reflect.getMetadata(`design:paramtypes`, pvKey) || [];

    const config: any = MetadataHelper.getDecoratorConfig(pvKey);
    const injectedParams: Interfaces.ComponentParameterDependency[] =
      MetadataHelper.getParameterDependencies(pvKey);
    const injectedProps: Interfaces.ComponentPropertyDependency[] =
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
