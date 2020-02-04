# PluginAPI Guiding Principles

The Backstage PluginAPI is designed with several primary goals:

- All objects in Backstage should be easily debuggable
- All objects in Backstage should be easily traceable to a human owner

To accomplish this, there are a few rules that should be followed:

- There is one PluginManager
- The PluginManager singleton can have 1 or more child plugins
- The PluginManager is responsible for bootstrapping all the plugins and letting them
  interact with eachother
- A plugin must extend PluginBase
- A plugin registers itself with the PluginManager (see pluginManagerBootstrap.js)
- A plugin may contain 1 or more URL routes
- A plugin is responsible for all the routes it owns
- A plugin should be kind and not load resources that it does not need until one of its routes
  is entered
- A plugin may provide resources to other plugins (API, components, etc.)
- A plugin should be able to be turned on or off without breaking any other plugin

# Class Structure

    + EventDispatcher: standard event bus
      + PluginManager: singleton
      + PluginBase
        + SystemZPlugin
        + EssencePlugin
        + ...
