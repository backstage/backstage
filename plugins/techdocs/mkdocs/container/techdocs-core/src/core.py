"""
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
"""

from mkdocs.plugins import BasePlugin, PluginCollection
from mkdocs.theme import Theme

from mkdocs.contrib.search import SearchPlugin

from mkdocs_monorepo_plugin.plugin import MonorepoPlugin

class TechDocsCore(BasePlugin):
    def on_config(self, config):
       # Theme
       config['theme'] = Theme(name="material")

       # Plugins
       del config['plugins']['techdocs-core']
       
       search_plugin = SearchPlugin()
       search_plugin.load_config({})

       monorepo_plugin = MonorepoPlugin()
       monorepo_plugin.load_config({})
       
       config['plugins']['search'] = search_plugin
       config['plugins']['monorepo'] = monorepo_plugin

        search_plugin = SearchPlugin()
        search_plugin.load_config({})
        config["plugins"]["search"] = search_plugin

        return config
