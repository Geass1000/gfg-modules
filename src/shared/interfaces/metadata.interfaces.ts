import * as InjectableInterfaces from './injectable.interfaces';
import { InjectableEnums } from '../enums';

export type PropertyKey = string | symbol;

export interface PropertyDependency {
  key: PropertyKey;
  // ProviderContainerToken for construction and property, any for property
  value: InjectableInterfaces.InjectableKey;
}

export interface ParameterDependency {
  index: number;
  // ProviderContainerToken for construction and property, any for property
  value: InjectableInterfaces.InjectableKey;
}
