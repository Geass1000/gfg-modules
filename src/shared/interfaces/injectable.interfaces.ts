import { ProviderToken } from '../../provider';

export type FactoryFunction = (...restDeps: any[]) => any;

export type InjectableKey = ProviderToken | any;

export interface ClassType<T = any> extends Function {
  // tslint:disable-next-line
  new (...args: any[]): any;
}

export namespace InjectableElement {
  export interface Base {
    provide: InjectableKey;
    multi?: boolean;
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
