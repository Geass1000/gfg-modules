import { Token } from '../../token';

export type Key = Token | any;

export namespace Provider {
  export type FactoryFunction = (...restDeps: any[]) => any;

  export interface Type<T> extends Function {
    // tslint:disable-next-line
    new (...args: any[]): any;
  }

  export interface Base {
    provide: Key;
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

  export type Injectable = Provider.Type<any>;
  export type Use = Provider.Class | Provider.Value | Provider.Factory;
}

export type Provider = Provider.Use | Provider.Injectable;
