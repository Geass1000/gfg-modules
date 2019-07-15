import { Token } from '../../token';
import { InjectableScope } from '../enums/injectable.enums';

export interface Type<T> extends Function {
  // tslint:disable-next-line
  new (...args: any[]): any;
}

export namespace Element {
  export type Key = Token | any;

  export type FactoryFn = (...restDeps: any[]) => any;

  export namespace Provider {
    export interface Base {
      provide: Element.Key;
      multi?: boolean;
    }

    export interface Value extends Base {
      useValue: any;
    }

    export interface Class extends Base {
      useClass: any;
    }

    export interface Factory extends Base {
      useFactory: FactoryFn;
      inject?: any[];
    }
  }

  export type UseProvider = Provider.Class | Provider.Value | Provider.Factory;
  export type InjectableProvider = Type<any>;
  export type Provider = UseProvider | InjectableProvider;
}

export interface Injectable {
  scope?: InjectableScope;
}

export interface Module {
  imports?: any[];
  providers?: Element.Provider[];
  exports?: any[];
}
