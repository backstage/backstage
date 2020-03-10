import AppBuilder from './app/AppBuilder';
import WidgetViewBuilder from './widgetView/WidgetViewBuilder';
import BackstagePlugin, { PluginConfig } from './plugin/Plugin';

export function createApp() {
  return new AppBuilder();
}

export function createWidgetView() {
  return new WidgetViewBuilder();
}

export function createPlugin(config: PluginConfig): BackstagePlugin {
  return new BackstagePlugin(config);
}
