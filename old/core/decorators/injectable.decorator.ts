import { GfgHelper } from '../shared/gfg.helper';
import * as GfgInterfaces from '../shared/interfaces/gfg.interfaces';

export function Injectable (config?: GfgInterfaces.Injectable) {
  return <T extends new(...args: any[]) => {}>(targetInjectable: T) => {
    GfgHelper.setClassElement(targetInjectable);
    GfgHelper.setElementConfig(config, targetInjectable);
  };
}
