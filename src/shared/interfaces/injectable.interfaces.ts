import { ProviderToken } from '../../provider';
import { InjectableEnums } from '../enums';

export type FactoryFunction = (...restDeps: any[]) => any;

export interface ClassType<T = any> extends Function {
  // tslint:disable-next-line
  new (...args: any[]): any;
}

export type InjectableKey = ProviderToken | ClassType;

export namespace InjectableElement {
  export interface Base {
    provide: InjectableKey;
    multi?: boolean;
    isGlobal?: boolean;
  }

  export interface Value extends Base {
    useValue: any;
  }

  export interface Class extends Base {
    useClass: any;
  }

  export interface Factory extends Base {
    useFactory: FactoryFunction;
    inject?: any[];
  }
}

export type InjectableElement = InjectableElement.Class | InjectableElement.Value | InjectableElement.Factory;
export type InjectableProvider = ClassType | InjectableElement;

export type InjectableExport = ClassType | InjectableKey;

export interface InjectableDecorator {
  scope?: InjectableEnums.InjectableScope;
  imports?: InjectableProvider[];
  exports?: InjectableExport[];
}
