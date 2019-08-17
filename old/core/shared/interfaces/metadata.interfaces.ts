import { Token } from '../../token';
export type PropertyKey = string | symbol;

export interface PropertyDep {
  key: PropertyKey;
  // Token for construction and property, any for property
  value: Token | any;
}

export interface ParameterDep {
  index: number;
  // Token for construction and property, any for property
  value: Token | any;
}
