import BackstageMenuItem from 'shared/apis/menu/BackstageMenuItem';

import dashify from 'dashify';

/**
 * Every plugin in Backstage needs to extend PluginBase.
 *
 * Each PluginBase subclass can be added to Backstage in the pluginManagerBootstrap.js file.
 *
 * For more information, see:
 *
 *   https://backstage.spotify.net/docs/developing-a-plugin
 */
export default class PluginBase {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Called by SystemZ when the Plugin is mounted
   *
   * @param pluginManager
   */
  constructor(pluginManager) {
    this.pluginManager = pluginManager;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get id() {
    return this.manifest.id;
  }

  get owner() {
    return this.manifest.owner;
  }

  get stackoverflowTags() {
    const tags = this.manifest.facts && this.manifest.facts.stackoverflow_tags;
    return tags || [];
  }

  //-----------------------------------
  // Plugin Lifecycle
  //-----------------------------------
  /**
   * Can be overridden. Called when the plugin is successfully registered by SystemZ.
   */
  initialize() {
    // noop
  }

  //-----------------------------------
  // Configuration
  //-----------------------------------
  /**
   * Add a menu item to the DefaultMenu. By default this adds to the 'general' menu node, which
   * is not displayed anywhere in Backstage (yet).
   *
   * This is a shortcut to creating a linked search item.
   *
   * @param title The title of the menu item as displayed in search.
   * @param description An indexed description. All words in here are searchable.
   * @param searchWords Additional words (space-delimited) that can be used to search for this. Not displayed.
   * @param url The url to go ot when the user clicks this menu item.
   * @param type What to display on the right-side of the search (e.g. "Guide" or "Service").
   * @param options Additional options for the BackstageMenuItem.
   * @param parentIdPath The dot-delimited path to the node in the menu tree (e.g. "tools.groups")
   */
  addMenuItem({ id, title, description, searchWords, url, type, options, parentIdPath = 'general' }) {
    let menu = this.pluginManager.menu;

    options = options || {
      ignoreParentsInTitle: true,
    };

    options.url = url;
    options.tags = searchWords;
    options.description = description;
    options.type = type;

    if (parentIdPath) {
      menu = menu.getByIdPath(parentIdPath);

      if (!menu) {
        throw new Error(`Could not find the menu with the path '${parentIdPath}'!`);
      }
    }

    menu.add(new BackstageMenuItem(this, id || dashify(title), title, options));
  }

  /**
   * Register a PluginRoute instance with the PluginManager.
   *
   * @param pluginRoute An instance of PluginRoute from the pluginApi.
   */
  registerRoute(pluginRoute) {
    return this.pluginManager.registerRoute(pluginRoute);
  }

  /**
   * Register a PluginRoute instance with the PluginManager.
   *
   * @param pluginRoute An instance of PluginRoute from the pluginApi.
   */
  registerRedirect(pluginRedirect) {
    return this.pluginManager.registerRedirect(pluginRedirect);
  }

  toString() {
    return `${this.manifest.title} (${this.manifest.owner})`;
  }
}
