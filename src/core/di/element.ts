import * as _ from 'lodash';
import { GfgHelper } from './../shared/gfg.helper';

import * as ElementInterfaces from '../shared/interfaces/element.interfaces';
import * as ElementEnums from '../shared/enums/element.enums';
import { ContainerIterator } from './container.iterator';
import * as Interfaces from './shared/interfaces';

export class Element {
  private _factory?: Interfaces.ElementFactory;
  public get factory (): Interfaces.ElementFactory {
    return this._factory;
  }
  public set factory (value: Interfaces.ElementFactory) {
    this._factory = value;
  }

  private _key: ElementInterfaces.Key;
  public get key (): ElementInterfaces.Key {
    return this._key;
  }

  private _type: ElementEnums.ProviderType;
  public get type (): ElementEnums.ProviderType {
    return this._type;
  }

  private _config: ElementInterfaces.Provider.Use;
  public get config (): ElementInterfaces.Provider.Use {
    return this._config;
  }

  constructor (provider: ElementInterfaces.Provider) {
    const isClassElement = GfgHelper.isClassElement(provider);

    this._config = isClassElement ? {
      provide: provider,
      useClass: provider,
    } : provider as ElementInterfaces.Provider.Use;

    this._key = isClassElement
      ? provider : (provider as ElementInterfaces.Provider.Use).provide;
    this._type = this.getProviderType(this.config);

    this.factory = null;
  }

  private getProviderType (
    useConifg: ElementInterfaces.Provider.Use,
  ): ElementEnums.ProviderType {
    if (!_.has(useConifg, 'useClass')) {
      return ElementEnums.ProviderType.Class;
    }
    if (!_.has(useConifg, 'useValue')) {
      return ElementEnums.ProviderType.Value;
    }
    if (!_.has(useConifg, 'useFactory')) {
      return ElementEnums.ProviderType.Factory;
    }

    throw new Error('Unknown type of DI Element');
  }
}
