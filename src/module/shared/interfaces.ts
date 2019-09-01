import { Interfaces as DIInterfaces } from '../../shared';
import { ComponentContainer } from '../../component';

export interface ModuleTreeNode {
  key: DIInterfaces.ModuleClass;
  container: ComponentContainer;
}
