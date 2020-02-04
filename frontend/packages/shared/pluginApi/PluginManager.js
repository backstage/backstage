import { PluginBase, PluginRedirect, PluginRoute } from 'shared/pluginApi';

import store from 'core/store';

const REQUIRED_PLUGIN_YAML_PROPERTIES = ['title', 'id', 'owner', 'description'];

const verifyPlugin = plugin => {
  if (!(plugin instanceof PluginBase)) {
    throw new Error('This plugin does not extend PluginBase!', plugin);
  }

  if (!plugin.manifest) {
    throw new Error('This plugin does not have a manifest property!', plugin);
  }

  REQUIRED_PLUGIN_YAML_PROPERTIES.forEach(property => {
    if (plugin.manifest[property] === undefined) {
      throw new Error(`Plugin did not have required manifest plugin-info.yaml property '${property}'.`, plugin);
    }
  });
};

/**
 * There should only be one instance of the PluginManager.
 */
export default class PluginManager {
  //-----------------------------------
  // Properties
  //-----------------------------------
  pluginDefinitions = [];
  pluginRedirects = [];
  plugins = [];
  routes = [];
  routesByPath = {};

  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(pluginDefinitions, setupMenu) {
    this.pluginDefinitions = pluginDefinitions;

    this.setupMenu = setupMenu;

    this.initialize();
  }

  /**
   * There is one and only one root plugin. The Backstage Plugin.
   *
   * @returns {*}
   */
  get rootPlugin() {
    return this.plugins.filter(plugin => !!plugin.rootPlugin)[0];
  }

  /**
   * The active plugin is the plugin that owns the current activated root route.
   *
   * @param value
   */
  set activePlugin(value) {
    if (value === this._activePlugin) {
      return;
    }

    this._activePlugin = value;
  }

  get activePlugin() {
    return this._activePlugin || this.rootPlugin;
  }

  /**
   * The activeRootPluginRoute is the currently activated root route. There will always be only one (or there
   * should only be)
   *
   * @param value
   */
  set activeRootPluginRoute(value) {
    if (value === this._activeRootPluginRoute) {
      return;
    }

    if (value && !(value instanceof PluginRoute)) {
      throw new Error('PluginManager::set activeRootPluginRoute was passed an object that does not extend PluginRoute');
    }

    this._activeRootPluginRoute = value;
  }

  get activeRootPluginRoute() {
    return this._activeRootPluginRoute;
  }

  /**
   * The React Router history object. Set in the constructor of App.js
   *
   * @param value
   */
  set history(value) {
    this._history = value;

    this._history.listen(this.history_listenHandler);
  }

  get history() {
    return this._history;
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  initialize() {
    const pluginsById = {};

    this.pluginDefinitions.forEach((pluginDefinition, ix) => {
      if (pluginDefinition instanceof Function) {
        const plugin = (this.plugins[ix] = new pluginDefinition(this));

        verifyPlugin(plugin);

        if (pluginsById[plugin.manifest.id]) {
          throw new Error(`It appears more than one plugin have the same id: '${plugin.manifest.id}'`);
        }
        pluginsById[plugin.manifest.id] = plugin;
      } else {
        throw new Error('This plugin is not a class (should extend PluginBase):', pluginDefinition);
      }
    });

    this.menu = this.setupMenu(this);

    this.plugins.forEach(plugin => {
      plugin.initialize();
    });

    store.dispatch({ type: 'STORE_ALL_ROUTES', routes: this.routes });
  }

  //-----------------------------------
  // Render
  //-----------------------------------
  renderRoutes() {
    return this.routes.map(pluginRoute => pluginRoute.render());
  }

  renderRedirects() {
    return this.pluginRedirects.map(pluginRedirect => pluginRedirect.render());
  }

  //-----------------------------------
  // Object Registration
  //-----------------------------------
  registerRoute(pluginRoute) {
    if (!(pluginRoute instanceof PluginRoute)) {
      throw new Error(
        `When registering a route, make sure you register an extension of the PluginRoute class, received '${pluginRoute}'`,
      );
    }

    const paths = pluginRoute.path instanceof Array ? pluginRoute.path : [pluginRoute.path];
    paths.forEach(path => (this.routesByPath[path] = pluginRoute));

    this.routes.push(pluginRoute);

    return pluginRoute;
  }

  registerRedirect(pluginRedirect) {
    if (!(pluginRedirect instanceof PluginRedirect)) {
      throw new Error(
        `When registering a redirect, make sure you register an extension of the PluginRedirect class, received '${pluginRedirect}'`,
      );
    }

    this.pluginRedirects.push(pluginRedirect);

    return pluginRedirect;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  /**
   * This is the *first* handler called when the BrowserHistory object dispatches to its listeners.
   *
   * The next "handler" is the render() method in PluginRoute.
   *
   * The thing is, when we are transitioning between routes it is possible that someone could navigate
   * to a route that is not managed by any PluginRoute instance. If this occurs, we do not know
   * "which" plugin is responsible for the new route. So the following check ensures that if no plugin
   * "claims" ownership of the route, then we can flip our system back to the SystemZ plugin.
   *
   * @param location
   * @param action
   */
  history_listenHandler = () => {
    // This line is important to "reset" the active plugin on a route change in case
    this._routeChangeHandledByPluginRoute = undefined;

    setTimeout(() => {
      if (!this._routeChangeHandledByPluginRoute) {
        // If after 100 milliseconds of a route change, no plugin has "claimed" the route, then
        // we know that somehow we have entered a route that is not handled by any plugin so we
        // revert our plugin to the root one.
        this.activePlugin = this.rootPlugin;
        this.activeRootPluginRoute = undefined;
      }
    }, 100);
  };
}
