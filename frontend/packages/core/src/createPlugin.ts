import { BackstagePlugin } from './types';

export type PluginConfig = {
  id: string;
};

function createPlugin(config: PluginConfig): BackstagePlugin {
  return config;
}

export default createPlugin;
