import { Container } from './../di/container';
import * as _ from 'lodash';

import { Singleton } from '../shared/singleton.base';

import { TreeNode } from './tree-node';
import { GfgHelper } from '../shared/gfg.helper';

import * as GfgInterfaces from '../shared/interfaces/gfg.interfaces';
import { Tree } from './tree';

export class TreeBuilder extends Singleton {

  /**
   * Creates a DI Tree for `root` module and global DI Tree Nodes (DITN).
   *
   * @param  {any} rootModule - class of the `root` module
   * @returns void
   */
  public create(rootModule: any): void {
    // Creates DI Tree for `root` module and global DITNs
    const rootNode = this.visitModule(null, rootModule);
    const tree = new Tree(rootNode);

    const globalNodes: TreeNode[] = [];


    // If module is `global`, fn will add `current` module to global list
    // and set parent of `current` module to `null` and return `null`.  
    // if (GfgHelper.isGlobalElement(curModule)) {
    //   node.setParent(null);
    //   globalNodes.push(node);
    //   return null;
    // }
  }

  /**
   * Visits a `current` module. Fn does:
   * 1. Creates the DI Tree Node (DITN) for `current` module.
   * 2. Calls itself for each child module (recursion).
   * 3. Visits `providers` and `components` lists of `current` module.
   * 4. Sets all children (modules, providers and components).
   * 5. Sets `current` module as `global` or returns DITN for `current` module.
   * 
   * @param  {TreeNode} parentModule - DITN of the parent
   * @param  {any} curModule - class of the `module`
   * @returns TreeNode
   */
  private visitModule(parentModule: TreeNode, curModule: any): TreeNode {
    // Gets the config of `current` module and creates DITN for him
    const moduleConfig: GfgInterfaces.Module = GfgHelper.getElementConfig(curModule);
    const diContainer = Container.create();
    const node = new TreeNode({ value: curModule, container: diContainer });

    // Visits the each imported module and returns DITN for this module
    // Skips modules who returns `null`
    const moduleNodes = _.chain(moduleConfig.imports)
      .map((module) => this.visitModule(node, module))
      .filter((module) => !_.isNull(module))
      .value();

    // Visits the each provider and returns DITN for this provider
    _.forEach(moduleConfig.providers, (provider) => {
      diContainer.bind(provider);
    });

    // Sets children of `current` module
    node.addChildren(moduleNodes);

    // Else fn will set a parent of `current` module
    // and return DITN of `current` module
    node.setParent(parentModule);
    return node;
  }
}
