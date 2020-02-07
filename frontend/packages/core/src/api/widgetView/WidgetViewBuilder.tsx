import React, { ComponentType } from 'react';
import { App, AppComponentBuilder } from '../app/types';
import { Widget } from './types';
import DefaultWidgetView from '../../components/DefaultWidgetView';

type WidgetViewRegistration = {
  type: 'component';
  widget: Widget;
};

export default class WidgetViewBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<WidgetViewRegistration>();
  private output?: ComponentType<any>;

  add(widget: Widget): WidgetViewBuilder {
    this.registrations.push({ type: 'component', widget });
    return this;
  }

  build(_app: App): ComponentType<any> {
    if (this.output) {
      return this.output;
    }

    const widgets = this.registrations.map(reg => {
      switch (reg.type) {
        case 'component':
          return reg.widget;
        default:
          throw new Error(`Unknown WidgetViewBuilder registration`);
      }
    });

    this.output = () => <DefaultWidgetView widgets={widgets} />;
    return this.output;
  }
}
