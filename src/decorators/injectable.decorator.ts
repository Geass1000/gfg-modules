import { InjectableInterfaces } from '../shared/interfaces';
import { MetadataHelper } from '../shared/helpers';

export function Injectable (config?: InjectableInterfaces.InjectableDecorator) {
  return <T extends new(...args: any[]) => {}>(target: T) => {
    MetadataHelper.setDecoratorConfig(config, target);
  };
}
