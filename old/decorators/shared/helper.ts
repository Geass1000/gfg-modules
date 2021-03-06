import * as _ from 'lodash';

import * as GfgModule from '../../module';
import * as Constants from './constants';
import * as Interfaces from './interfaces';

export class Helper {
  /**
   * Property Deps
   */

  static getPropertyDependencies (
    target: any,
  ): Interfaces.PropertyDependency[] {
    const propDeps = Reflect.getMetadata(Constants.PropertyDependencies, target);
    return propDeps || null;
  }

  static setPropertyDependencies (
    value: GfgModule.Interfaces.Provider.InjectableKey,
    target: any,
    propertyKey: string | symbol,
  ): void {
    const oldDeps = this.getPropertyDependencies(target) || [];
    const newDep: Interfaces.PropertyDependency = {
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
    target: any,
  ): Interfaces.ParameterDependency[] {
    const paramDeps = Reflect.getMetadata(Constants.ParameterDependencies, target);
    return paramDeps || null;
  }

  static setParameterDependencies (
    value: GfgModule.Interfaces.Provider.InjectableKey,
    target: any,
    index: number,
  ): void {
    const oldDeps = this.getParameterDependencies(target) || [];
    const newDep: Interfaces.ParameterDependency = {
      index: index,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(Constants.ParameterDependencies, newDeps, target);
  }

  /**
   * Config Deps
   */

  static getDecoratorConfig<T> (target: any): T {
    const config = Reflect.getMetadata(Constants.DecoratorConfig, target);
    return config || null;
  }

  static setDecoratorConfig (config: any, target: any): void {
    Reflect.defineMetadata(Constants.DecoratorConfig, config, target);
  }


  static setGlobalModule (target: any): void {
    Reflect.defineMetadata(Constants.GlobalModule, true, target);
  }

  static isGlobalModule (target: any): boolean {
    return !!Reflect.getMetadata(Constants.GlobalModule, target);
  }


  static setInjectableClass (target: any): void {
    Reflect.defineMetadata(Constants.InjectableClass, true, target);
  }

  static isInjectableClass (target: any): boolean {
    return !!Reflect.getMetadata(Constants.InjectableClass, target);
  }
}
