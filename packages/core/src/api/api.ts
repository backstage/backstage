import AppBuilder from './app/AppBuilder';
import EntityKind, { EntityConfig } from './entity/EntityKind';
import WidgetViewBuilder from './widgetView/WidgetViewBuilder';
import EntityPageBuilder from './entityView/EntityPageBuilder';
import BackstagePlugin, { PluginConfig } from './plugin/Plugin';

export function createApp() {
  return new AppBuilder();
}

export function createEntityKind(config: EntityConfig) {
  return new EntityKind(config);
}

export function createWidgetView() {
  return new WidgetViewBuilder();
}

export function createEntityPage() {
  return new EntityPageBuilder();
}

export function createPlugin(config: PluginConfig): BackstagePlugin {
  return new BackstagePlugin(config);
}
