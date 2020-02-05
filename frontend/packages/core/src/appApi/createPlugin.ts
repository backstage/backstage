import { BackstagePlugin, PluginConfig } from './types';

function createPlugin(config: PluginConfig): BackstagePlugin {
  return {
    register() {},
    ...config,
  };
}

export default createPlugin;
