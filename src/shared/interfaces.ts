import { ComponentToken } from '../component';
import * as Enums from './enums';

export type FactoryFunction = () => any;

export interface ComponentClass<T = any> extends Function {
  // tslint:disable-next-line
  new (...args: any[]): any;
}

export interface FactoryClass<T = any> extends ComponentClass {
  build: () => T;
}

export interface ModuleClass<T = any> extends ComponentClass {
  config?: () => T;
}

export type ComponentKey = ComponentToken | ComponentClass;

export namespace ComponentProvider {
  export interface Base {
    key: ComponentKey;
    isMulti?: boolean;
    isGlobal?: boolean;
  }

  export interface Value extends Base {
    useValue: any;
  }

  export interface Class extends Base {
    useClass: any;
  }

  export interface Factory extends Base {
    useFactory: FactoryClass;
    inject?: any[];
  }
}

export type ComponentProvider = ComponentProvider.Class | ComponentProvider.Value | ComponentProvider.Factory;

export interface ModuleProvider {
  key: ModuleClass;
  isGlobal?: boolean;
}

export type ImportSectionElement = ModuleClass | ModuleProvider;
export type ComponentSectionElement = ComponentClass | ComponentProvider;
export type ExportSectionElement = ComponentKey;

export interface ComponentDecorator {
  mode?: Enums.ComponentMode;
}

export interface ModuleDecorator {
  imports?: ImportSectionElement[];
  components?: ComponentSectionElement[];
  exports?: ExportSectionElement[];
}

export type ComponentPropertyKey = string | symbol;

export interface ComponentPropertyDependency {
  key: PropertyKey;
  // ComponentContainerToken for construction and property, any for property
  value: ComponentKey;
}

export interface ComponentParameterDependency {
  index: number;
  // ComponentContainerToken for construction and property, any for property
  value: ComponentKey;
}
