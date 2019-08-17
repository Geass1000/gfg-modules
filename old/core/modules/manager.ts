import { InjectableScope } from './../shared/enums/injectable.enums';
import * as _ from 'lodash';

import { Interfaces } from './shared';

import * as DI from '../di';
import * as Shared from '../shared';
import { TreeNode } from './tree-node';
import { Tree } from './tree';
import * as DIInterfaces from './../di/shared/interfaces';
import { GfgHelper } from '../shared/gfg.helper';
import { ProviderType } from '../shared/enums/element.enums';

export class Manager {
  constructor (private config: Interfaces.Manager.Config) {}

  init () {
    this.initAppModules();
  }

  initGlobalModules () {
  }

  initAppModules () {
    const appTree = this.config.appTree;


    const treeIterator = appTree.postorderTraversal();
    for (treeIterator.start(); !treeIterator.isStoped(); treeIterator.next()) {
      const container = treeIterator.value.container;

      const diIterator = container.getIterator();
      for (diIterator.start(0); !diIterator.isStoped(); diIterator.next()) {
        // const deps = container.getClassDependencies(diIterator.value);
      }
    }
  }

  initValueElement (
    el: Shared.Interfaces.Element.Provider.Value,
  ): DIInterfaces.ElementFactory {
    const value = el.useValue;

    return () => {
      return value;
    };
  }

  initFactoryElement (
    node: TreeNode,
    el: Shared.Interfaces.Element.Provider.Factory,
  ): DIInterfaces.ElementFactory {
    const injectDeps = el.inject || [];

    const factoryArgs: any[] = _.map(injectDeps, (injectDep) => {
      return this.createDependency(node, injectDep);
    });

    const factoryResult = el.useFactory(...factoryArgs);

    return () => {
      return factoryResult;
    };
  }

  initClassElement (
    node: TreeNode,
    el: Shared.Interfaces.Element.Provider.Class
  ): DIInterfaces.ElementFactory {
    const deps = GfgHelper.getClassDependencies(el.useClass);

    const params: any[] = _.map(deps.params, (param) => {
      return this.createDependency(node, param);
    });

    const props: any[] = _.map(deps.props, (prop) => {
      return this.createDependency(node, prop.value);
    });

    const createClassFn = () => {
      const instance = new el.useClass(...params);

      _.map(deps.props, (prop, index) => {
        instance[prop.key] = props[index];
      });
      return instance;
    };

    switch (deps.config.scope) {
      case InjectableScope.Singleton:
        const instance = createClassFn();
        return () => {
          return instance;
        };
      case InjectableScope.Transient:
      default:
        return createClassFn;
    }
  }

  createDependency (
    node: TreeNode,
    elKey: Shared.Interfaces.Element.Key,
  ): any | any[] {
    const tree = new Tree(node);

    const trees = _.unionBy([tree], this.config.globalTrees, 'value');

    let activeNode: TreeNode;
    for (let i = 0; i < trees.length; i++) {
      activeNode = this.findDependency(elKey, trees[i]);

      if (!_.isUndefined(activeNode)) {
        break;
      }
    }

    const elements = activeNode.container.getElements(elKey);

    const deps = _.map(elements, (element) => {
      if (!_.isNull(element.factory)) {
        return element.factory();
      }
      const newFactory = this.createDependencyFactory(activeNode, element);
      element.factory = newFactory;
      return newFactory();
    });

    return deps.length === 1 ? deps[0] : deps;
  }

  createDependencyFactory (node: TreeNode, element: DI.Element) {
    switch (element.type) {
      case ProviderType.Value:
        return this.initValueElement(element.config as Shared.Interfaces.Element.Provider.Value);
      case ProviderType.Factory:
        return this.initFactoryElement(node, element.config as Shared.Interfaces.Element.Provider.Factory);
      case ProviderType.Class:
        return this.initClassElement(node, element.config as Shared.Interfaces.Element.Provider.Class);
    }
  }

  findDependency (
    elKey: Shared.Interfaces.Element.Key, tree: Tree,
  ): TreeNode {
    const treeIterator = tree.postorderTraversal();

    for (treeIterator.start(); !treeIterator.isStoped(); treeIterator.next()) {
      const node = treeIterator.value;
      const elements = node.container.getElements(elKey);

      if (elements.length !== 0) {
        treeIterator.stop();
        return node;
      }
    }

    return undefined;
  }
}
