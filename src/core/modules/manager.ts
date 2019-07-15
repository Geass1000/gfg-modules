import { InjectableScope } from './../shared/enums/injectable.enums';
import * as _ from 'lodash';

import { Interfaces } from './shared';

import * as DI from '../di/container';
import * as Shared from '../shared';
import { TreeNode } from './tree-node';
import { Tree } from './tree';
import * as DIInterfaces from './../di/shared/interfaces';
import { GfgHelper } from '../shared/gfg.helper';
import { ElementType } from '../di/shared/enums';

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
      return this.createDependency(node, injectDep)();
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
      return this.createDependency(node, param)();
    });

    const props: any[] = _.map(deps.props, (prop) => {
      return this.createDependency(node, prop.value)();
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

  createDependency (node: TreeNode, elKey: Shared.Interfaces.Element.Key): DIInterfaces.ElementFactory {
    const tree = new Tree(node);

    const trees = _.unionBy([tree], this.config.globalTrees, 'value');

    let activeNode: TreeNode;
    for (let i = 0; i < trees.length; i++) {
      activeNode = this.findDependency(elKey, trees[i]);

      if (!_.isUndefined(activeNode)) {
        break;
      }
    }

    let newDepFn: any;
    // switch (depType) {
    //   case ElementType.Value:
    //     newDepFn = this.initValueElement(dep as Element.Provider.Value);
    //     break;
    //   case ElementType.Factory:
    //     newDepFn = this.initFactoryElement(node, dep as Element.Provider.Factory);
    //     break;
    //   case ElementType.Class:
    //     newDepFn = this.initClassElement(node, dep as Element.Provider.Class);
    //     break;
    // }
    // activeNode.container.setElementFn(elKey, newDepFn);
    return newDepFn;
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
