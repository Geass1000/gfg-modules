import { GfgHelper } from '../shared/gfg.helper';
import * as GfgInterfaces from '../shared/interfaces/gfg.interfaces';

export function Global () {
  return <T extends new(...args: any[]) => {}>(Module: T) => {
    GfgHelper.setGlobalElement(Module);
  };
}
