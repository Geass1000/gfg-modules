import { InjectableInterfaces } from '../../shared/interfaces';
import { ProviderContainer } from '../../provider';

export interface InjectableModule {
  component: InjectableInterfaces.ClassType;
  config: InjectableInterfaces.InjectableDecorator;
  container: ProviderContainer;
}
