import PluginBase from './PluginBase';
import PluginManager from './PluginManager';
import PluginRoute from './PluginRoute';
import PluginRedirect from './PluginRedirect';

import { registerFeatureFlag } from 'shared/apis/featureFlags/featureFlagsActions';
import FeatureFlagsRegistry from 'shared/apis/featureFlags/featureFlags';

export type PluginConfig = {
  manifest: object;

  register?(registries: { router: Router; menu: Menu; featureFlags: FeatureFlags }): void;
};

export type Router = {
  registerRoute(path: string, Component: React.ComponentType<any>, options?: RouteOptions): void;
  registerRedirect(path: string, target: string, options?: RedirectOptions): void;
};

export type RouteOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type RedirectOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type MenuItemOptions = {
  // The title of the menu item as displayed in search.
  title: string;
  // An indexed description. All words in here are searchable.
  description?: string;
  // The id of the menu item. If no id is provided, a lower-kebab-case transform of the title will be used.
  id?: string;
  // The dot-delimited path to the node in the menu tree (e.g. "tools.groups"). Defaults to 'general'.
  parentIdPath?: string;
  // The url to go ot when the user clicks this menu item.
  url?: string;
  // What to display on the right-side of the search (e.g. "Guide" or "Service").
  type?: string;
  // Additional words (space-delimited) that can be used to search for this. Not displayed.
  searchWords?: string;
};

export type Menu = {
  add(options: MenuItemOptions): void;
};

export type FeatureFlags = {
  register(id: string): void;
  get(id: string): boolean;
};

export default function createPlugin(plugin: PluginConfig): { new (pluginManager: PluginManager): PluginBase } {
  return class extends PluginBase {
    manifest = plugin.manifest;

    initialize() {
      plugin.register?.({
        router: {
          registerRoute: (path, Component, options = {}) => {
            const { exact = true } = options;
            this.registerRoute(new PluginRoute(this, path, exact, Component));
          },
          registerRedirect: (path, target, options = {}) => {
            const { exact = true } = options;
            this.registerRedirect(new PluginRedirect(this, path, target, exact));
          },
        },
        menu: {
          add: options => {
            this.addMenuItem(options);
          },
        },
        featureFlags: {
          register: id => {
            registerFeatureFlag(id);
          },
          get: id => {
            return FeatureFlagsRegistry.getItem(id);
          },
        },
      });
    }
  };
}
