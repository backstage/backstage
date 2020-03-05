import { ComponentType } from 'react';
import { EntityConfig } from '../entity/EntityKind';
import { IconComponent, SystemIconKey } from '../../icons';

export type App = {
  getEntityConfig(kind: string): EntityConfig;
  getSystemIcon(key: SystemIconKey): IconComponent;
};

export class AppComponentBuilder<T = any> {
  build(_app: App): ComponentType<T> {
    throw new Error('Must override build() in AppComponentBuilder');
  }
}
