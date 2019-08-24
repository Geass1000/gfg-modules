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

  public clone () {
    const containerClone = ProviderContainer.create();

    const containerIterator = this.getIterator();
    for (containerIterator.start(0); !containerIterator.isStoped(); containerIterator.next()) {
      const elClone = containerIterator.value.clone();
      containerClone.addElement(elClone);
    }

    return containerClone;
  }

  public merge (
    providerContainer1: ProviderContainer,
    ...restContainers: ProviderContainer[]
  ): ProviderContainer {
    const pc1Clone = providerContainer1.clone();

    _.forEach(restContainers, (container) => {
      const containerIterator = container.getIterator();
      for (containerIterator.start(0); !containerIterator.isStoped(); containerIterator.next()) {
        const elClone = containerIterator.value.clone();
        pc1Clone.addElement(elClone);
      }
    });

    return pc1Clone;
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
