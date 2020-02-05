import { ComponentType } from 'react';
import { EntityConfig } from '../entity/EntityKind';

export type App = {
  getEntityConfig(kind: string): EntityConfig;
};

export class AppComponentBuilder<T = any> {
  build(_app: App): ComponentType<T> {
    throw new Error('Must override build() in AppComponentBuilder');
  }
}
