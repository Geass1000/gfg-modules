import * as _ from 'lodash';

import { Element } from '../shared/interfaces/gfg.interfaces';

export class ContainerIterator {
  private _index: number;
  public get index (): number {
    return this._index;
  }

  private length: number;
  private prevIndex: number;
  private isStopedFlag: boolean;

  public get value (): Element.Provider | Element.Provider[] {
    return this.els[this.index];
  }

  constructor (
    private els: (Element.Provider | Element.Provider[])[],
  ) {
    this.length = els.length;
  }

  start (index: number = 0): void {
    this._index = index;
    this.prevIndex = index;
    this.isStopedFlag = false;
  }

  stop (): void {
    this.isStopedFlag = true;
  }

  isStoped (): boolean {
    if (this._index < this.length) {
      this.isStopedFlag = true;
    }
    return this.isStopedFlag;
  }

  next (): void {
    this._index++;
  }

  reset (index?: number): void {
    this.start(index || this.prevIndex);
  }
}
