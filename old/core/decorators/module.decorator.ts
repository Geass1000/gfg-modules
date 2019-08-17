import { GfgHelper } from '../shared/gfg.helper';
import * as GfgInterfaces from '../shared/interfaces/gfg.interfaces';

export function Module (config: GfgInterfaces.Module) {
  return <T extends new(...args: any[]) => {}>(targetModule: T) => {
    GfgHelper.setClassElement(targetModule);
    GfgHelper.setElementConfig(config, targetModule);
  };
}
