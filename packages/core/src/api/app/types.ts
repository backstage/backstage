import { ComponentType } from 'react';
import { IconComponent, SystemIconKey } from '../../icons';

export type App = {
  getSystemIcon(key: SystemIconKey): IconComponent;
};

export class AppComponentBuilder<T = any> {
  build(_app: App): ComponentType<T> {
    throw new Error('Must override build() in AppComponentBuilder');
  }
}
