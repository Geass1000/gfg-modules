import * as _ from 'lodash';

import { InjectableInterfaces } from '../shared/interfaces';
import { InjectableEnums } from '../shared/enums';
import { MetadataHelper } from '../shared/helpers';

export class ProviderContainerElement {
  private _factory?: InjectableInterfaces.FactoryFunction;
  public get factory (): InjectableInterfaces.FactoryFunction {
    return this._factory;
  }
  public set factory (value: InjectableInterfaces.FactoryFunction) {
    this._factory = value;
  }

  private _key: InjectableInterfaces.InjectableKey;
  public get key (): InjectableInterfaces.InjectableKey {
    return this._key;
  }

  private _type: InjectableEnums.InjectableType;
  public get type (): InjectableEnums.InjectableType {
    return this._type;
  }

  private _config: InjectableInterfaces.InjectableElement;
  public get config (): InjectableInterfaces.InjectableElement {
    return this._config;
  }

  constructor (provider: InjectableInterfaces.InjectableProvider) {
    const isClassElement = MetadataHelper.isInjectableClass(provider);

    if (isClassElement) {
      this.initInjectableClass(provider as InjectableInterfaces.ClassType);
    } else {
      this.initInjectableElement(provider as InjectableInterfaces.InjectableElement);
    }

    this._type = this.getProviderType(this.config);

    this.factory = null;
  }

  clone () {
    const providerClone = _.clone(this.config);
    const elementClone = new ProviderContainerElement(providerClone);
    return elementClone;
  }

  initInjectableClass (provider: InjectableInterfaces.ClassType) {
    this._config = {
      provide: provider,
      useClass: provider,
    };
    this._key = provider;
  }

  initInjectableElement (provider: InjectableInterfaces.InjectableElement) {
    this._config = provider;
    this._key = provider.provide;
  }

  private getProviderType (
    useConifg: InjectableInterfaces.InjectableElement,
  ): InjectableEnums.InjectableType {
    if (!_.has(useConifg, 'useClass')) {
      return InjectableEnums.InjectableType.Class;
    }

    if (!_.has(useConifg, 'useValue')) {
      return InjectableEnums.InjectableType.Value;
    }

    if (!_.has(useConifg, 'useFactory')) {
      return InjectableEnums.InjectableType.Factory;
    }

    throw new Error('Unknown type of DI Element');
  }
}
