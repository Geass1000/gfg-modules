import { GfgHelper } from './../shared/gfg.helper';
import * as _ from 'lodash';

import { Element } from 'core/shared/interfaces/gfg.interfaces';

export class Container {
  private elStorage: (Element.Provider | Element.Provider[])[];

  static create (): Container {
    return new Container();
  }

  private constructor () {
    this.elStorage = [];
  }

  // public bindClass(elKey: Element.Key): void {
  //   const classParams: any[] = Reflect.getMetadata(`design:paramtypes`, elKey);

  //   const injectedParams: Shared.Interfaces.Metadata.ParameterDep[] =
  //     Reflect.getMetadata(Shared.Constants.Metadata.ParameterDeps, elKey);
  //   const injectedProps: Shared.Interfaces.Metadata.PropertyDep[] =
  //     Reflect.getMetadata(Shared.Constants.Metadata.PropertyDeps, elKey);

  //   const newClassParams = _.map(classParams, (value, index) => {
  //     return _.isUndefined(injectedParams[index]) 
  //       ? value : injectedParams[index];
  //   });
  // }

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

  private getElement(
    elKey: Element.Key,
  ): Element.Provider | Element.Provider[] {
    return _.find(this.elStorage, [ 'provide', elKey ]);
  }

  private setElement(newEl: Element.Provider): void {
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

    this.elStorage[index] = newEl.multi ? [newEl] : newEl;
  }
}
