import React, { ComponentType } from 'react';
import { App, AppComponentBuilder } from '../app/types';
import { Widget } from './types';
import BackstagePlugin from '../plugin/Plugin';
import DefaultWidgetView from '../../components/DefaultWidgetView';

type WidgetViewRegistration =
  | {
      type: 'component';
      widget: Widget;
    }
  | {
      type: 'plugin';
      plugin: BackstagePlugin;
    };

export default class WidgetViewBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<WidgetViewRegistration>();
  private output?: ComponentType<any>;

  add(widget: Widget): WidgetViewBuilder {
    this.registrations.push({ type: 'component', widget });
    return this;
  }

  register(plugin: BackstagePlugin): WidgetViewBuilder {
    this.registrations.push({ type: 'plugin', plugin });
    return this;
  }

  build(_app: App): ComponentType<any> {
    if (this.output) {
      return this.output;
    }

    const widgets = new Array<Widget>();

    for (const reg of this.registrations) {
      switch (reg.type) {
        case 'component':
          widgets.push(reg.widget);
          break;
        case 'plugin':
          let added = false;
          for (const output of reg.plugin.output()) {
            if (output.type === 'widget') {
              widgets.push(output.widget);
              added = true;
            }
          }
          if (!added) {
            throw new Error(
              `Plugin ${reg.plugin} was registered as widget provider, but did not provide any widgets`,
            );
          }
          break;
        default:
          throw new Error(`Unknown WidgetViewBuilder registration`);
      }
    }

    this.output = () => <DefaultWidgetView widgets={widgets} />;
    return this.output;
  }
}
