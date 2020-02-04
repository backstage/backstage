import PluginRoute from './PluginRoute';
import PluginRedirect from './PluginRedirect';

export = PluginBase;

declare type MenuItem = {
  title: string;
  description?: string;
  searchWords?: string;
  url?: string;
  type?: string;
  parentIdPath?: string;
  options?: string;
  id?: string;
};

declare class PluginBase {
  id: string;
  owner: string;
  stackoverflowTags: string[];
  initialize(): void;
  registerRoute(route: PluginRoute): void;
  registerRedirect(redirect: PluginRedirect): void;
  addMenuItem(menuItem: MenuItem): void;
}
