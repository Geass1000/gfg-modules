import { Interfaces } from '../shared';
import { MetadataHelper } from '../shared/helpers';

export function Component (config?: Interfaces.ComponentDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    MetadataHelper.setDecoratorConfig(config, target);
  };
}
