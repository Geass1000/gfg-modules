import * as _ from 'lodash';

import { MetadataConstants } from '../constants';
import { MetadataInterfaces, InjectableInterfaces } from '../interfaces';

export class MetadataHelper {
  /**
   * Property Deps
   */

  static getPropertyDependencies (
    target: any,
  ): MetadataInterfaces.PropertyDependency[] {
    const propDeps = Reflect.getMetadata(MetadataConstants.PropertyDependencies, target);
    return propDeps || null;
  }

  static setPropertyDependencies (
    value: InjectableInterfaces.InjectableKey,
    target: any,
    propertyKey: string | symbol,
  ): void {
    const oldDeps = this.getPropertyDependencies(target) || [];
    const newDep: MetadataInterfaces.PropertyDependency = {
      key: propertyKey,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(MetadataConstants.PropertyDependencies, newDeps, target);
  }

  /**
   * Parameter Deps
   */

  static getParameterDependencies<T = any> (
    target: any,
  ): MetadataInterfaces.ParameterDependency[] {
    const paramDeps = Reflect.getMetadata(MetadataConstants.ParameterDependencies, target);
    return paramDeps || null;
  }

  static setParameterDependencies (
    value: InjectableInterfaces.InjectableKey,
    target: any,
    index: number,
  ): void {
    const oldDeps = this.getParameterDependencies(target) || [];
    const newDep: MetadataInterfaces.ParameterDependency = {
      index: index,
      value: value,
    };
    const newDeps = [ ...oldDeps, newDep ];
    Reflect.defineMetadata(MetadataConstants.ParameterDependencies, newDeps, target);
  }

  /**
   * Config Deps
   */

  static getDecoratorConfig<T> (target: any): T {
    const config = Reflect.getMetadata(MetadataConstants.DecoratorConfig, target);
    return config || null;
  }

  static setDecoratorConfig (config: any, target: any): void {
    Reflect.defineMetadata(MetadataConstants.DecoratorConfig, config, target);
  }
}
