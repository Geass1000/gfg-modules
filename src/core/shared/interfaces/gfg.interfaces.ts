import { Token } from '../../token';
import { InjectableScope } from '../enums/injectable.enums';
import * as Element from './element.interfaces';

export interface Type<T> extends Function {
  // tslint:disable-next-line
  new (...args: any[]): any;
}

export interface Injectable {
  scope?: InjectableScope;
}

export interface Module {
  imports?: any[];
  providers?: Element.Provider[];
  exports?: any[];
}
