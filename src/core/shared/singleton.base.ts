
export class Singleton {
  protected static instance: any;

  // protected constructor () { ; }

  static getInstance<T extends typeof Singleton>(this: T): InstanceType<T> {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance as InstanceType<T>;
  }
}