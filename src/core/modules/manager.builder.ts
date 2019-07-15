import * as _ from 'lodash';
import * as Bluebird from 'bluebird';

import { Container } from '../di/container';
import { Singleton } from '../shared/singleton.base';

import { TreeNode } from './tree-node';
import { GfgHelper } from '../shared/gfg.helper';

import * as GfgInterfaces from '../shared/interfaces/gfg.interfaces';
import { Tree } from './tree';
import { Manager } from './manager';

export class ManagerBuilder extends Singleton {

  /**
   * Creates a DI Tree for `root` module and global DI Tree Nodes (DITN).
   *
   * @param  {any} rootModule - class of the `root` module
   * @returns void
   */
  public async build (rootModule: any): Promise<Manager> {
    // Build application tree
    const appTree = this.buildAppTree(rootModule);

    // Get array of trees of global modules from app tree
    const globalTrees: Tree[] = await this.extractGlobalModules(appTree);

    // Create an instance of module manager
    const moduleManager = new Manager({ appTree, globalTrees, });
    return moduleManager;
  }

  /**
   * Creates a DI Tree for `root` module and global DI Tree Nodes (DITN).
   *
   * @param  {any} rootModule - class of the `root` module
   * @returns void
   */
  public buildAppTree (rootModule: any): Tree {
    // Creates DI Tree for `root` module and global DITNs
    const rootNode = this.buildAppTreeNodes(null, rootModule);
    return new Tree(rootNode);
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
  private buildAppTreeNodes (parentModule: TreeNode, curModule: any): TreeNode {
    // Gets the config of `current` module and creates DITN for him
    const moduleConfig: GfgInterfaces.Module = GfgHelper.getElementConfig(curModule);
    const diContainer = Container.create();

    // Visits the each provider and returns DITN for this provider
    _.forEach(moduleConfig.providers, (provider) => {
      diContainer.bind(provider);
    });

    const node = new TreeNode({ value: curModule, container: diContainer });

    // Visits the each imported module and returns DITN for this module
    // Skips modules who returns `null`
    const moduleNodes = _.chain(moduleConfig.imports)
      .map((module) => this.buildAppTreeNodes(node, module))
      .filter((module) => !_.isNull(module))
      .value();

    const reverseModuleNodes = _.reverse([ ...moduleNodes, ]);
    // Sets children of `current` module
    node.setChildren(reverseModuleNodes);

    // Else fn will set a parent of `current` module
    // and return DITN of `current` module
    node.parent = parentModule;
    return node;
  }

  private async extractGlobalModules (tree: Tree): Promise<Tree[]> {
    const globalTrees: Tree[] = [];

    return new Bluebird<Tree[]>((resolve, reject) => {
      const iterator = tree.preorderTraversal();
      iterator.getNotifier().subscribe((node) => {
        if (!GfgHelper.isGlobalElement(node.value)) {
          return;
        }

        node.parent.removeChildren(node);
        node.parent = null;
        const globalTree = new Tree(node);
        globalTrees.push(globalTree);
      }, () => {}, () => { resolve(globalTrees); });
      iterator.traverse();
    });
  }
}
