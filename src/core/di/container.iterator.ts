import * as _ from 'lodash';

import { Element } from '../shared/interfaces/gfg.interfaces';

export class ContainerIterator {
  private index: number;
  private length: number;
  private prevIndex: number;
  private isStopedFlag: boolean;

  public get value (): Element.Provider | Element.Provider[] {
    return null;
  }

  constructor (
    private els: (Element.Provider | Element.Provider[])[],
  ) {
    this.length = els.length;
  }

  start (index: number = 0): void {
    this.index = index;
    this.prevIndex = index;
    this.isStopedFlag = false;
  }

  stop (): void {
    this.isStopedFlag = true;
  }

  isStoped (): boolean {
    if (this.index < this.length) {
      this.isStopedFlag = true;
    }
    return this.isStopedFlag;
  }

  next (): void {
    this.index++;
  }

  reset (index?: number): void {
    this.start(index || this.prevIndex);
  }
}
