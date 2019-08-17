import * as _ from 'lodash';
import * as GfgDecorators from '../decorators';

import { Interfaces, Enums } from './shared/';

export class ContainerElement {
  private _factory?: Interfaces.FactoryFunction;
  public get factory (): Interfaces.FactoryFunction {
    return this._factory;
  }
  public set factory (value: Interfaces.FactoryFunction) {
    this._factory = value;
  }

  private _key: Interfaces.Provider.InjectableKey;
  public get key (): Interfaces.Provider.InjectableKey {
    return this._key;
  }

  private _type: Enums.ProviderType;
  public get type (): Enums.ProviderType {
    return this._type;
  }

  private _config: Interfaces.Provider.InjectableUse;
  public get config (): Interfaces.Provider.InjectableUse {
    return this._config;
  }

  constructor (provider: Interfaces.Provider) {
    const isClassElement = GfgDecorators.Helper.isInjectableClass(provider);

    if (isClassElement) {
      this.initInjectableClass(provider as Interfaces.Provider.InjectableClass);
    } else {
      this.initInjectableUse(provider as Interfaces.Provider.InjectableUse);
    }

    this._type = this.getProviderType(this.config);

    this.factory = null;
  }

  initInjectableClass (provider: Interfaces.Provider.InjectableClass) {
    this._config = {
      provide: provider,
      useClass: provider,
    };
    this._key = provider;
  }

  initInjectableUse (provider: Interfaces.Provider.InjectableUse) {
    this._config = provider;
    this._key = provider.provide;
  }

  private getProviderType (
    useConifg: Interfaces.Provider.InjectableUse,
  ): Enums.ProviderType {
    if (!_.has(useConifg, 'useClass')) {
      return Enums.ProviderType.Class;
    }

    if (!_.has(useConifg, 'useValue')) {
      return Enums.ProviderType.Value;
    }

    if (!_.has(useConifg, 'useFactory')) {
      return Enums.ProviderType.Factory;
    }

    throw new Error('Unknown type of DI Element');
  }
}
