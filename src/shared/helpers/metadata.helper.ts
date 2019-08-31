import * as _ from 'lodash';

import * as Constants from '../constants';
import * as Interfaces from '../interfaces';

export class MetadataHelper {
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
    target: Interfaces.ComponentClass,
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
}
