from mkdocs.plugins import BasePlugin, PluginCollection
from mkdocs.theme import Theme

from mkdocs.contrib.search import SearchPlugin

class TechDocsCore(BasePlugin):
    def on_config(self, config):
       # Theme
       config['theme'] = Theme(name="material")

       # Plugins
       del config['plugins']['techdocs-core']

       search_plugin = SearchPlugin()
       search_plugin.load_config({})
       config['plugins']['search'] = search_plugin

       return config

