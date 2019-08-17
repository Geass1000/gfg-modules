import { Token } from '../token';
import { InjectableScope } from './enums';

export type FactoryFunction = (...restDeps: any[]) => any;

export namespace Provider {
  export type InjectableKey = Token | any;

  export interface InjectableClass<T = any> extends Function {
    // tslint:disable-next-line
    new (...args: any[]): any;
  }

  export namespace InjectableUse {
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

  export type InjectableUse = InjectableUse.Class | InjectableUse.Value | InjectableUse.Factory;
}

export type Provider = Provider.InjectableUse | Provider.InjectableClass<any>;

export namespace Decorator {
  export interface Injectable {
    scope?: InjectableScope;
  }

  export interface Module {
    imports?: any[];
    providers?: Provider[];
    exports?: any[];
  }
}
