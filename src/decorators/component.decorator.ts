import { Interfaces } from '../shared';
import { Helper } from '../shared';

export function Component (config?: Interfaces.ComponentDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    Helper.setDecoratorConfig(config, target);
  };
}
