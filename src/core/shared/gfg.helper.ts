import { Token } from "../token";
import * as Constants from './constants';
import * as Interfaces from './interfaces';

export class GfgHelper {
  /**
   * Property Deps
   */

  static getPropertyDeps(target: any): Interfaces.Metadata.PropertyDep[] {
    return Reflect.getMetadata(Constants.Metadata.PropertyDeps, target);
  }

  static setPropertyDeps(value: Token | any, target: any, propertyKey: string | symbol) {
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

  static getParameterDeps<T>(target: any): Interfaces.Metadata.ParameterDep[] {
    return Reflect.getMetadata(Constants.Metadata.ParameterDeps, target);
  }

  static setParameterDeps(value: Token | any, target: any, index: number) {
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

  static getElementConfig<T>(target: any): T {
    return Reflect.getMetadata(Constants.Metadata.ElementConfig, target);
  }

  static setElementConfig(config: any, target: any): void {
    Reflect.defineMetadata(Constants.Metadata.ElementConfig, config, target);
  }

  static setGlobalElement(target: any): void {
    Reflect.defineMetadata(Constants.Metadata.GlobalElement, true, target);
  }

  static isGlobalElement(target: any): boolean {
    return !!Reflect.getMetadata(Constants.Metadata.GlobalElement, target);
  }

  static setClassElement(target: any): void {
    Reflect.defineMetadata(Constants.Metadata.ClassElement, true, target);
  }

  static isClassElement(target: any): boolean {
    return !!Reflect.getMetadata(Constants.Metadata.ClassElement, target);
  }
}