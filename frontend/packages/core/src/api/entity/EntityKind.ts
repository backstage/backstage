import { ComponentType } from 'react';
import { AppComponentBuilder } from '../app/types';

export type EntityConfig = {
  kind: string;
  title: string;
  icon: React.ComponentType<{ fontSize: number }>;
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
