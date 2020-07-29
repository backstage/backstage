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
import tempfile
import os


class TechDocsCore(BasePlugin):
    def on_config(self, config):
        fp = open(os.path.join(tempfile.gettempdir(), "techdocs_metadata.json"), "w+")
        fp.write(
            '{\n  "site_name": "{{ config.site_name }}",\n  "site_description": "{{ config.site_description }}"\n}'
        )

        # Theme
        config["theme"] = Theme(
            name="material", static_templates=["techdocs_metadata.json",],
        )
        config["theme"].dirs.append(tempfile.gettempdir())

        # Plugins
        del config["plugins"]["techdocs-core"]

        search_plugin = SearchPlugin()
        search_plugin.load_config({})

        monorepo_plugin = MonorepoPlugin()
        monorepo_plugin.load_config({})

        config["plugins"]["search"] = search_plugin
        config["plugins"]["monorepo"] = monorepo_plugin

        search_plugin = SearchPlugin()
        search_plugin.load_config({})
        config["plugins"]["search"] = search_plugin

        # Markdown Extensions
        config["markdown_extensions"].append("admonition")
        config["markdown_extensions"].append("abbr")
        config["markdown_extensions"].append("attr_list")
        config["markdown_extensions"].append("def_list")
        config["markdown_extensions"].append("codehilite")
        config["mdx_configs"]["codehilite"] = {
            "linenums": True,
            "guess_lang": False,
            "pygments_style": "friendly",
        }
        config["markdown_extensions"].append("toc")
        config["mdx_configs"]["toc"] = {
            "permalink": True,
        }
        config["markdown_extensions"].append("footnotes")
        config["markdown_extensions"].append("markdown.extensions.tables")
        config["markdown_extensions"].append("pymdownx.betterem")
        config["mdx_configs"]["pymdownx.betterem"] = {
            "smart_enable": "all",
        }
        config["markdown_extensions"].append("pymdownx.caret")
        config["markdown_extensions"].append("pymdownx.critic")
        config["markdown_extensions"].append("pymdownx.details")
        config["markdown_extensions"].append("pymdownx.emoji")
        config["mdx_configs"]["pymdownx.emoji"] = {
            "emoji_generator": "!!python/name:pymdownx.emoji.to_svg",
        }
        config["markdown_extensions"].append("pymdownx.inlinehilite")
        config["markdown_extensions"].append("pymdownx.magiclink")
        config["markdown_extensions"].append("pymdownx.mark")
        config["markdown_extensions"].append("pymdownx.smartsymbols")
        config["markdown_extensions"].append("pymdownx.superfences")
        config["markdown_extensions"].append("pymdownx.tasklist")
        config["mdx_configs"]["pymdownx.tasklist"] = {
            "custom_checkbox": True,
        }
        config["markdown_extensions"].append("pymdownx.tilde")

        return config
