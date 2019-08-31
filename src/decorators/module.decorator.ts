import { Interfaces } from '../shared';
import { MetadataHelper } from '../shared/helpers';

export function Module (config?: Interfaces.ModuleDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    MetadataHelper.setDecoratorConfig(config, target);
  };
}
