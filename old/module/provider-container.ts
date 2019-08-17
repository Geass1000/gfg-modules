import * as _ from 'lodash';

import { ContainerIterator } from './container-iterator';
import { ContainerElement } from './container-element';
import { Interfaces } from './shared';

export class ProviderContainer {
  private storage: ContainerElement[];

  static create (): ProviderContainer {
    return new ProviderContainer();
  }

  private constructor () {
    this.storage = [];
  }

  public getIterator (): ContainerIterator {
    const iterator = new ContainerIterator(this.storage);
    return iterator;
  }

  public bind (provider: Interfaces.Provider) {
    const element = new ContainerElement(provider);

    this.setElement(element);
  }

  public getElements (
    elKey: Interfaces.Provider.InjectableKey,
  ): ContainerElement[] {
    const elements = _.filter(this.storage, (element) => {
      return element.key === elKey;
    });
    return elements;
  }

  private setElement (newElement: ContainerElement): void {
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
      throw new Error (`Mixing multi and non multi provider is not possible for token ${newElement.key}`);
    }

    if (newElIsMultiDep) {
      this.storage.push(newElement);
      return;
    }

    this.storage = _.unionBy([ newElement ], elements, 'key');
  }

  isMultiDependency (element: ContainerElement) {
    const isMulti = _.get(element, 'config.multi', false);
    return isMulti;
  }
}
