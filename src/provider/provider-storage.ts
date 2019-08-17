import * as _ from 'lodash';

import { ProviderStorageIterator } from './provider-storage-iterator';
import { ProviderStorageElement } from './provider-storage-element';
import { InjectableInterfaces } from '../shared/interfaces';

export class ProviderStorage {
  private storage: ProviderStorageElement[];

  static create (): ProviderStorage {
    return new ProviderStorage();
  }

  private constructor () {
    this.storage = [];
  }

  public getIterator (): ProviderStorageIterator {
    const iterator = new ProviderStorageIterator(this.storage);
    return iterator;
  }

  public addProvider (provider: InjectableInterfaces.InjectableProvider) {
    const element = new ProviderStorageElement(provider);
    this.addElement(element);
  }

  public getElementsByKey (
    elKey: InjectableInterfaces.InjectableKey,
  ): ProviderStorageElement[] {
    const elements = _.filter(this.storage, (element) => {
      return element.key === elKey;
    });
    return elements;
  }

  private addElement (newElement: ProviderStorageElement): void {
    const elements = this.getElementsByKey(newElement.key);

    if (_.isEmpty(elements)) {
      this.storage.push(newElement);
      return;
    }

    const newElIsMultiProvider = this.isMultiProvider(newElement);
    const oldElement = _.first(elements);
    const oldElIsMultProvider = this.isMultiProvider(oldElement);

    const multiToSingle = newElIsMultiProvider && !oldElIsMultProvider;
    const singleToMulti = !newElIsMultiProvider && oldElIsMultProvider;

    if (multiToSingle || singleToMulti) {
      throw new Error (`Mixing multi and non multi provider is not possible for Provider (${newElement.key})`);
    }

    if (newElIsMultiDep) {
      this.storage.push(newElement);
      return;
    }

    this.storage = _.unionBy([ newElement ], elements, 'key');
  }

  isMultiProvider (element: ProviderStorageElement) {
    const isMulti = _.get(element, 'config.multi', false);
    return isMulti;
  }
}
