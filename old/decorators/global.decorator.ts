import { Helper } from './shared';

export function Global () {
  return <T extends new(...args: any[]) => {}>(Module: T) => {
    Helper.setGlobalModule(Module);
  };
}
