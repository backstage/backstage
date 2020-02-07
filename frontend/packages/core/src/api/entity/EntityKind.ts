import { ComponentType } from 'react';
import { AppComponentBuilder } from '../app/types';
import { IconComponent } from '../types';

export type EntityConfig = {
  kind: string;
  title: string;
  icon: IconComponent;
  color: {
    primary: string;
    secondary: string;
  };
  pages: {
    list?: ComponentType<{}> | AppComponentBuilder;
    view?: ComponentType<{}> | AppComponentBuilder;
  };
};

export default class EntityKind {
  constructor(readonly config: EntityConfig) {}
}
