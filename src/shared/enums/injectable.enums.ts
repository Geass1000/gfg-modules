
export enum InjectableScope {
  Transient = 'transient',
  Singleton = 'singleton',
  Request = 'request',
}

export enum InjectableType {
  Class = 'class',
  Value = 'value',
  Factory = 'factory',
}
