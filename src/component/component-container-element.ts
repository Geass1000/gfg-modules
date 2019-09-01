import * as _ from 'lodash';

import { Enums, Interfaces } from '../shared';

export class ComponentContainerElement {
  private _factory?: Interfaces.FactoryFunction;
  public get factory (): Interfaces.FactoryFunction {
    return this._factory;
  }
  public set factory (value: Interfaces.FactoryFunction) {
    this._factory = value;
  }

  private _key: Interfaces.ComponentKey;
  public get key (): Interfaces.ComponentKey {
    return this._key;
  }

  private _type: Enums.ComponentProviderType;
  public get type (): Enums.ComponentProviderType {
    return this._type;
  }

  private _config: Interfaces.ComponentProvider;
  public get config (): Interfaces.ComponentProvider {
    return this._config;
  }

  constructor (provider: Interfaces.ComponentSectionElement) {
    if (_.has(provider, 'provide')) {
      this.initInjectableElement(provider as Interfaces.ComponentProvider);
    } else {
      this.initInjectableClass(provider as Interfaces.ComponentClass);
    }

    this._type = this.getProviderType(this.config);

    this.factory = null;
  }

  clone () {
    const providerClone = _.clone(this.config);
    const elementClone = new ComponentContainerElement(providerClone);
    return elementClone;
  }

  initInjectableClass (componentClass: Interfaces.ComponentClass) {
    this._config = {
      key: componentClass,
      useClass: componentClass,
    };
    this._key = componentClass;
  }

  initInjectableElement (componentProvider: Interfaces.ComponentProvider) {
    this._config = componentProvider;
    this._key = componentProvider.key;
  }

  private getProviderType (
    useConifg: Interfaces.ComponentProvider,
  ): Enums.ComponentProviderType {
    if (!_.has(useConifg, 'useClass')) {
      return Enums.ComponentProviderType.Class;
    }

    if (!_.has(useConifg, 'useValue')) {
      return Enums.ComponentProviderType.Value;
    }

    if (!_.has(useConifg, 'useFactory')) {
      return Enums.ComponentProviderType.Factory;
    }

    throw new Error('Unknown type of DI Element');
  }
}
