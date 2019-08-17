import * as _ from 'lodash';

import { Token } from '../token';
import * as Constants from './constants';
import * as Interfaces from './interfaces';

export class GfgHelper {
  /**
   * Property Deps
   */

  static getPropertyDeps (target: any): Interfaces.Metadata.PropertyDep[] {
    return Reflect.getMetadata(Constants.Metadata.PropertyDeps, target);
  }

  static setPropertyDeps (value: Token | any, target: any, propertyKey: string | symbol) {
    const oldDeps = this.getPropertyDeps(target) || [];
    const newDep: Interfaces.Metadata.PropertyDep = {
      key: propertyKey,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(Constants.Metadata.PropertyDeps, newDeps, target);
  }

  /**
   * Parameter Deps
   */

  static getParameterDeps<T> (target: any): Interfaces.Metadata.ParameterDep[] {
    return Reflect.getMetadata(Constants.Metadata.ParameterDeps, target);
  }

  static setParameterDeps (value: Token | any, target: any, index: number) {
    const oldDeps = this.getPropertyDeps(target) || [];
    const newDep: Interfaces.Metadata.ParameterDep = {
      index: index,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(Constants.Metadata.ParameterDeps, newDeps, target);
  }

  /**
   * Config Deps
   */

  static getElementConfig<T> (target: any): T {
    return Reflect.getMetadata(Constants.Metadata.ElementConfig, target);
  }

  static setElementConfig (config: any, target: any): void {
    Reflect.defineMetadata(Constants.Metadata.ElementConfig, config, target);
  }

  static setGlobalElement (target: any): void {
    Reflect.defineMetadata(Constants.Metadata.GlobalElement, true, target);
  }

  static isGlobalElement (target: any): boolean {
    return !!Reflect.getMetadata(Constants.Metadata.GlobalElement, target);
  }

  static setClassElement (target: any): void {
    Reflect.defineMetadata(Constants.Metadata.ClassElement, true, target);
  }

  static isClassElement (target: any): boolean {
    return !!Reflect.getMetadata(Constants.Metadata.ClassElement, target);
  }

  static getClassDependencies (elKey: Interfaces.Element.Key) {
    const classParams: any[] = Reflect.getMetadata(`design:paramtypes`, elKey) || [];

    const config: Interfaces.Gfg.Injectable =
      GfgHelper.getElementConfig(elKey) || {};
    const injectedParams: Interfaces.Metadata.ParameterDep[] =
      GfgHelper.getParameterDeps(elKey) || [];
    const injectedProps: Interfaces.Metadata.PropertyDep[] =
      GfgHelper.getPropertyDeps(elKey) || [];

    const injectedClassParams = _.map(classParams, (classParam, index) => {
      const injectedParam = _.find(injectedParams, [ 'index', index ]);
      if (!_.isUndefined(injectedParam)) {
        return injectedParam.value;
      }

      if (this.isNativeType(classParam)) {
        throw new Error(`${elKey.name} (${index} -> ${classParam.name}). Native types not supported.`);
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
