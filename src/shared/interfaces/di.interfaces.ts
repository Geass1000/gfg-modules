import { ProviderToken } from '../../provider';
import { InjectableEnums } from '../enums';

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

export type ComponentKey = ProviderToken | ComponentClass;

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
  scope?: InjectableEnums.InjectableScope;
}

export interface ModuleDecorator {
  imports?: ImportSectionElement[];
  components?: ComponentSectionElement[];
  exports?: ExportSectionElement[];
}
