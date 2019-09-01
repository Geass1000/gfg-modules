import * as _ from 'lodash';

import { ComponentContainerIterator } from './component-container-iterator';
import { ComponentContainerElement } from './component-container-element';
import { Interfaces as DIInterfaces } from '../shared';

export class ComponentContainer {
  private storage: ComponentContainerElement[];

  static create (): ComponentContainer {
    return new ComponentContainer();
  }

  private constructor () {
    this.storage = [];
  }

  public clone () {
    const containerClone = ComponentContainer.create();

    const containerIterator = this.getIterator();
    for (containerIterator.start(0); !containerIterator.isStoped(); containerIterator.next()) {
      const elClone = containerIterator.value.clone();
      containerClone.addElement(elClone);
    }

    return containerClone;
  }

  public merge (
    ComponentContainer1: ComponentContainer,
    ...restContainers: ComponentContainer[]
  ): ComponentContainer {
    const pc1Clone = ComponentContainer1.clone();

    _.forEach(restContainers, (container) => {
      const containerIterator = container.getIterator();
      for (containerIterator.start(0); !containerIterator.isStoped(); containerIterator.next()) {
        const elClone = containerIterator.value.clone();
        pc1Clone.addElement(elClone);
      }
    });

    return pc1Clone;
  }

  public getIterator (): ComponentContainerIterator {
    const iterator = new ComponentContainerIterator(this.storage);
    return iterator;
  }

  public getStorage (): ComponentContainerElement[] {
    return [ ...this.storage ];
  }

  public addProvider (provider: DIInterfaces.ComponentSectionElement) {
    const element = new ComponentContainerElement(provider);
    this.addElement(element);
  }

  public getElementsByKey (
    elKey: DIInterfaces.ComponentKey,
  ): ComponentContainerElement[] {
    const elements = _.filter(this.storage, (element) => {
      return element.key === elKey;
    });
    return elements;
  }

  public addElement (
    newElement: ComponentContainerElement,
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

  isMultiProvider (element: ComponentContainerElement) {
    const isMulti = _.get(element, 'config.multi', false);
    return isMulti;
  }
}
