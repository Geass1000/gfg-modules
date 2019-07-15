import { InjectableScope } from './../shared/enums/injectable.enums';
import * as _ from 'lodash';

import { Interfaces } from './shared';

import * as DI from '../di/container';
import { Element } from '../shared/interfaces/gfg.interfaces';
import { TreeNode } from './tree-node';
import { Tree } from './tree';
import { ElementFunction } from './../di/shared/interfaces';
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

  initValueElement (el: Element.Provider.Value): ElementFunction {
    const value = el.useValue;

    return () => {
      return value;
    };
  }

  initFactoryElement (node: TreeNode, el: Element.Provider.Factory): ElementFunction {
    const injectDeps = el.inject || [];

    const factoryArgs: any[] = _.map(injectDeps, (injectDep) => {
      return this.createDependency(node, injectDep)();
    });

    const factoryResult = el.useFactory(...factoryArgs);

    return () => {
      return factoryResult;
    };
  }

  initClassElement (node: TreeNode, el: Element.Provider.Class): ElementFunction {
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

  createDependency (node: TreeNode, elKey: Element.Key): any {
    const tree = new Tree(node);

    const trees = _.unionBy([tree], this.config.globalTrees, 'value');

    let activeNode: TreeNode,
      dep: Element.UseProvider | Element.UseProvider[];
    for (let i = 0; i < trees.length; i++) {
      const treeIterator = trees[i].postorderTraversal();
      for (treeIterator.start(); !treeIterator.isStoped(); treeIterator.next()) {
        activeNode = treeIterator.value;

        const depFn = activeNode.container.getElementFn(elKey);
        if (depFn) {
          return depFn;
        }

        dep = activeNode.container.getElement(elKey);
        if (!_.isNil(dep)) {
          treeIterator.stop();
        }
      }

      if (!_.isNil(dep)) {
        break;
      }
    }

    const depType = activeNode.container.getElementType(elKey);

    let newDepFn: any;
    switch (depType) {
      case ElementType.Value:
        newDepFn = this.initValueElement(dep as Element.Provider.Value);
        break;
      case ElementType.Factory:
        newDepFn = this.initFactoryElement(node, dep as Element.Provider.Factory);
        break;
      case ElementType.Class:
        newDepFn = this.initClassElement(node, dep as Element.Provider.Class);
        break;
    }
    activeNode.container.setElementFn(elKey, newDepFn);
    return newDepFn;
  }

  findDependency (elKey: Element.Key): TreeNode {
    return null;
  }
}
