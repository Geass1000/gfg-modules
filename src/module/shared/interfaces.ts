import { InjectableInterfaces } from '../../shared/interfaces';
import { ProviderContainer } from '../../provider';

export interface ModuleTreeNode {
  key: InjectableInterfaces.InjectableKey;
  container: ProviderContainer;
}
