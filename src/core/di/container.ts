import { ContainerIterator } from './container.iterator';
import { GfgHelper } from './../shared/gfg.helper';
import * as _ from 'lodash';

import { Element } from '../shared/interfaces/gfg.interfaces';
import * as Shared from '../shared';

export class Container {
  private elStorage: (Element.UseProvider | Element.UseProvider[])[];

  static create (): Container {
    return new Container();
  }
  private constructor () {
    this.elStorage = [];
  }

  public getIterator (): ContainerIterator {
    const iterator = new ContainerIterator(this.elStorage);
    return iterator;
  }

  public bind (provider: any) {
    const isClassElement = GfgHelper.isClassElement(provider);

    if (!isClassElement) {
      this.setElement(provider);
      return;
    }

    this.setElement({
      provide: provider,
      useClass: provider,
    });
  }

  private getElement (
    elKey: Element.Key,
  ): Element.UseProvider | Element.UseProvider[] {
    return _.find(this.elStorage, [ 'provide', elKey ]);
  }

  private setElement (newEl: Element.UseProvider): void {
    const els = this.getElement(newEl.provide);
    const index = _.findIndex(this.elStorage, [ 'provide', newEl.provide ]);

    if ((newEl.multi && !_.isUndefined(els) && !_.isArray(els))
      || (!newEl.multi && _.isArray(els))) {
      throw new Error (`Mixing multi and non multi provider is not possible for token ${newEl.provide}`);
    }

    if (_.isArray(els)) {
      this.elStorage[index] = _.concat(els, newEl);
      return;
    }

    if (!_.isUndefined(els)) {
      this.elStorage[index] = newEl;
      return;
    }

    this.elStorage.push(newEl.multi ? [newEl] : newEl);
  }
}
