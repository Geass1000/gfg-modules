import * as GfgModule from '../../module';

export type PropertyKey = string | symbol;

export interface PropertyDependency {
  key: PropertyKey;
  // Token for construction and property, any for property
  value: GfgModule.Interfaces.Provider.InjectableKey;
}

export interface ParameterDependency {
  index: number;
  // Token for construction and property, any for property
  value: GfgModule.Interfaces.Provider.InjectableKey;
}

export namespace Decorator {
  export interface Injectable {
    scope?: GfgModule.Enums.InjectableScope;
  }

  export interface Module {
    imports?: any[];
    providers?: GfgModule.Interfaces.Provider[];
    exports?: any[];
  }
}

