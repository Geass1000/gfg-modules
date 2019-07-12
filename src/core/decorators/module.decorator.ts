import { Container } from '../di/container';
import { GfgHelper } from '../shared/gfg.helper';
import * as GfgInterfaces from '../shared/interfaces/gfg.interfaces';

export function Module(config: GfgInterfaces.Module) {
  return <T extends { new(...args: any[]): {} }>(Module: T) => {
    GfgHelper.setClassElement(Module);
    GfgHelper.setElementConfig(config, Module);
  };
}
