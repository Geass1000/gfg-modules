import { Token } from '../../token';

export namespace Element {
  export type Key = Token | any;

  export type Factory = (...restDeps: any[]) => any;

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
      useFactory: Factory;
      inject?: any[];
    }
  }

  export type Provider = Provider.Class | Provider.Value | Provider.Factory | any;
}

export interface Injectable {
}

export interface Module {
  imports?: any[];
  providers?: Element.Provider[];
  exports?: any[];
}
