import * as _ from 'lodash';

import { ProviderContainerIterator } from './provider-container-iterator';
import { ProviderContainerElement } from './provider-container-element';
import { InjectableInterfaces } from '../shared/interfaces';

export class ProviderContainer {
  private storage: ProviderContainerElement[];

  static create (): ProviderContainer {
    return new ProviderContainer();
  }

  private constructor () {
    this.storage = [];
  }

  public getIterator (): ProviderContainerIterator {
    const iterator = new ProviderContainerIterator(this.storage);
    return iterator;
  }

  public getStorage (): ProviderContainerElement[] {
    return [ ...this.storage ];
  }

  public addProvider (provider: InjectableInterfaces.InjectableProvider) {
    const element = new ProviderContainerElement(provider);
    this.addElement(element);
  }

  public getElementsByKey (
    elKey: InjectableInterfaces.InjectableKey,
  ): ProviderContainerElement[] {
    const elements = _.filter(this.storage, (element) => {
      return element.key === elKey;
    });
    return elements;
  }

  public addElement (
    newElement: ProviderContainerElement,
    throwSingleError: boolean = true,
  ): void {
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

    if (newElIsMultiProvider) {
      this.storage.push(newElement);
      return;
    }

    if (throwSingleError) {
      throw new Error (`Provider (${newElement.key}) is a single provider and it alreay exists in storage`);
    }

    const oldElementIndex = _.findIndex(this.storage, (element) => {
      return element.key === newElement.key;
    });

    this.storage[oldElementIndex] = newElement;
  }

  isMultiProvider (element: ProviderContainerElement) {
    const isMulti = _.get(element, 'config.multi', false);
    return isMulti;
  }
}
