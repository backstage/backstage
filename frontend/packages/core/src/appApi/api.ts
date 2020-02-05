import AppBuilder from './AppBuilder';
import { EntityConfig } from './types';
import EntityKind from './EntityKind';
import OverviewPageBuilder from './OverviewPageBuilder';
import EntityViewBuilder from './EntityViewPageBuilder';

export function createApp() {
  return new AppBuilder();
}

export function createEntityKind(config: EntityConfig) {
  return new EntityKind(config);
}

export function createOverviewPage() {
  return new OverviewPageBuilder();
}

export function createEntityView() {
  return new EntityViewBuilder();
}
