import unittest
import mkdocs.config as config
import mkdocs.plugins as plugins
from .core import TechDocsCore


class DummyTechDocsCorePlugin(plugins.BasePlugin):
    pass


class TestTechDocsCoreConfig(unittest.TestCase):
    def setUp(self):
        self.techdocscore = TechDocsCore()
        self.plugin_collection = plugins.PluginCollection()
        plugin = DummyTechDocsCorePlugin()
        self.plugin_collection["techdocs-core"] = plugin
        self.mkdocs_yaml_config = {"plugins": self.plugin_collection}

    def test_removes_techdocs_core_plugin_from_config(self):
        final_config = self.techdocscore.on_config(self.mkdocs_yaml_config)
        self.assertTrue("techdocs-core" not in final_config["plugins"])

    def test_merge_default_config_and_user_config(self):
        self.mkdocs_yaml_config["markdown_extension"] = []
        self.mkdocs_yaml_config["mdx_configs"] = {}
        self.mkdocs_yaml_config["markdown_extension"].append(["toc"])
        self.mkdocs_yaml_config["mdx_configs"]["toc"] = {"toc_depth": 3}
        final_config = self.techdocscore.on_config(self.mkdocs_yaml_config)
        self.assertTrue("toc" in final_config["mdx_configs"])
        self.assertTrue("permalink" in final_config["mdx_configs"]["toc"])
        self.assertTrue("toc_depth" in final_config["mdx_configs"]["toc"])

    def test_override_default_config_with_user_config(self):
        self.mkdocs_yaml_config["markdown_extension"] = []
        self.mkdocs_yaml_config["mdx_configs"] = {}
        self.mkdocs_yaml_config["markdown_extension"].append(["toc"])
        self.mkdocs_yaml_config["mdx_configs"]["toc"] = {"permalink": False}
        final_config = self.techdocscore.on_config(self.mkdocs_yaml_config)
        self.assertTrue("toc" in final_config["mdx_configs"])
        self.assertTrue("permalink" in final_config["mdx_configs"]["toc"])
        self.assertFalse(final_config["mdx_configs"]["toc"]["permalink"])
