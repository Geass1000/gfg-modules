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

  public getClassDependencies (elKey: Element.Key) {
    const classParams: any[] = Reflect.getMetadata(`design:paramtypes`, elKey) || [];

    const config: Shared.Interfaces.Gfg.Injectable =
      GfgHelper.getElementConfig(elKey) || {};
    const injectedParams: Shared.Interfaces.Metadata.ParameterDep[] =
      GfgHelper.getParameterDeps(elKey) || [];
    const injectedProps: Shared.Interfaces.Metadata.PropertyDep[] =
      GfgHelper.getPropertyDeps(elKey) || [];

    const injectedClassParams = _.map(classParams, (classParam, index) => {
      const injectedParam = _.find(injectedParams, [ 'index', index ]);
      if (!_.isUndefined(injectedParam)) {
        return injectedParam.value;
      }

      if (this.isNativeType(classParam)) {
        throw new Error(`${elKey.name} (${index} -> ${classParam.name}). Native types not supported.`);
      }

      return classParam;
    });

    return {
      config: config,
      params: injectedClassParams,
      props: injectedProps,
    };
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

  /**
   * Checks the metatype.
   * If metatype is a `native` type method will return `true'.
   *
   * @return {boolean}
   */
  private isNativeType (metatype: any): boolean {
    const types: any[] = [ String, Boolean, Number, Object ];
    return _.includes(types, metatype);
  }
}
