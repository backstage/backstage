import { ComponentType } from 'react';

export type Widget = {
  size: 4 | 6 | 8 | 12;
  component: ComponentType<any>;
};

export type WidgetViewProps = {
  widgets: Widget[];
};
