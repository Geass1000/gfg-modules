import { DIInterfaces } from '../shared/interfaces';
import { MetadataHelper } from '../shared/helpers';

export function Module (config?: DIInterfaces.ModuleDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    MetadataHelper.setDecoratorConfig(config, target);
  };
}
