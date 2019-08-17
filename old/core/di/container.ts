import * as _ from 'lodash';
import { GfgHelper } from './../shared/gfg.helper';

import { Element } from './element';
import * as ElementInterfaces from '../shared/interfaces/element.interfaces';
import { ContainerIterator } from './container.iterator';
import * as Interfaces from './shared/interfaces';

export class Container {
  private storage: Element[];

  static create (): Container {
    return new Container();
  }
  private constructor () {
    this.storage = [];
  }

  public getIterator (): ContainerIterator {
    const iterator = new ContainerIterator(this.storage);
    return iterator;
  }

  public bind (provider: ElementInterfaces.Provider) {
    const element = new Element(provider);

    this.setElement(element);
  }

  public getElements (
    elKey: ElementInterfaces.Key,
  ): Element[] {
    const elements = _.filter(this.storage, (element) => {
      return element.key === elKey;
    });
    return elements;
  }

  private setElement (newElement: Element): void {
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

  isMultiDependency (element: Element) {
    const isMulti = _.get(element, 'config.multi', false);
    return isMulti;
  }
}
