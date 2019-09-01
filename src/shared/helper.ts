import * as _ from 'lodash';

import * as Constants from './constants';
import * as Interfaces from './interfaces';

export class Helper {
  /**
   * Property Deps
   */

  static getPropertyDependencies (
    target: Interfaces.ComponentClass,
  ): Interfaces.ComponentPropertyDependency[] {
    const propDeps = Reflect.getMetadata(Constants.PropertyDependencies, target);
    return propDeps || null;
  }

  static setPropertyDependencies (
    value: Interfaces.ComponentKey,
    target: Interfaces.ComponentClass,
    propertyKey: string | symbol,
  ): void {
    const oldDeps = this.getPropertyDependencies(target) || [];
    const newDep: Interfaces.ComponentPropertyDependency = {
      key: propertyKey,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(Constants.PropertyDependencies, newDeps, target);
  }

  /**
   * Parameter Deps
   */

  static getParameterDependencies<T = any> (
    target: Interfaces.ComponentClass,
  ): Interfaces.ComponentParameterDependency[] {
    const paramDeps = Reflect.getMetadata(Constants.ParameterDependencies, target);
    return paramDeps || null;
  }

  static setParameterDependencies (
    value: Interfaces.ComponentKey,
    target: Interfaces.ComponentClass,
    index: number,
  ): void {
    const oldDeps = this.getParameterDependencies(target) || [];
    const newDep: Interfaces.ComponentParameterDependency = {
      index: index,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(Constants.ParameterDependencies, newDeps, target);
  }

  /**
   * Config Deps
   */

  static getDecoratorConfig (
    target: Interfaces.ComponentClass | Interfaces.ModuleClass,
  ): Interfaces.ComponentDecorator | Interfaces.ModuleDecorator {
    const config = Reflect.getMetadata(Constants.DecoratorConfig, target);
    return config || null;
  }

  static setDecoratorConfig (
    config: Interfaces.ComponentDecorator | Interfaces.ModuleDecorator,
    target: Interfaces.ComponentClass,
  ): void {
    Reflect.defineMetadata(Constants.DecoratorConfig, config, target);
  }

  static getModuleKey (
    importElement: Interfaces.ImportSectionElement
  ): Interfaces.ModuleClass {
    const moduleKey = _.get(importElement, 'key', importElement);

    if (_.isNil(moduleKey)) {
      throw new Error(`Module not defined correct. Use correct 'Class Name' or 'Module Provider'`);
    }

    return moduleKey;
  }

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

    const config: any = Helper.getDecoratorConfig(pvKey);
    const injectedParams: Interfaces.ComponentParameterDependency[] =
      Helper.getParameterDependencies(pvKey);
    const injectedProps: Interfaces.ComponentPropertyDependency[] =
      Helper.getPropertyDependencies(pvKey);

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
