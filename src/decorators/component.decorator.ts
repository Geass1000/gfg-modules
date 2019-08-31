import { DIInterfaces } from '../shared/interfaces';
import { MetadataHelper } from '../shared/helpers';

export function Component (config?: DIInterfaces.ComponentDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    MetadataHelper.setDecoratorConfig(config, target);
  };
}
