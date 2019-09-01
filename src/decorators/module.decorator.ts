import { Interfaces } from '../shared';
import { Helper } from '../shared';

export function Module (config?: Interfaces.ModuleDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    Helper.setDecoratorConfig(config, target);
  };
}
