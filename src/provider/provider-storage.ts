import * as _ from 'lodash';

import { ProviderStorageIterator } from './storage-iterator.provider';
import { ProviderStorageElement } from './storage-element.provider';
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

  public bind (provider: InjectableInterfaces.InjectableProvider) {
    const element = new ProviderStorageElement(provider);

    this.setElement(element);
  }

  public getElements (
    elKey: InjectableInterfaces.InjectableKey,
  ): ProviderStorageElement[] {
    const elements = _.filter(this.storage, (element) => {
      return element.key === elKey;
    });
    return elements;
  }

  private setElement (newElement: ProviderStorageElement): void {
    const elements = this.getElements(newElement.key);

    if (_.isEmpty(elements)) {
      this.storage.push(newElement);
      return;
    }

    const newElIsMultiDep = this.isMultiDependency(newElement);
    const oldElement = _.first(elements);
    const oldElIsMultDep = this.isMultiDependency(oldElement);

    const multiToSingle = newElIsMultiDep && !oldElIsMultDep;
    const singleToMulti = !newElIsMultiDep && oldElIsMultDep;

    if (multiToSingle || singleToMulti) {
      throw new Error (`Mixing multi and non multi provider is not possible for ProviderStorageToken ${newElement.key}`);
    }

    if (newElIsMultiDep) {
      this.storage.push(newElement);
      return;
    }

    this.storage = _.unionBy([ newElement ], elements, 'key');
  }

  isMultiDependency (element: ProviderStorageElement) {
    const isMulti = _.get(element, 'config.multi', false);
    return isMulti;
  }
}
