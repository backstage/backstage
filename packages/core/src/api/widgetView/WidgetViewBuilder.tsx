/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType } from 'react';
import { AppComponentBuilder } from 'api/app/types';
import { Widget } from './types';
import BackstagePlugin from 'api/plugin/Plugin';
import DefaultWidgetView from 'components/DefaultWidgetView';

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

  build(): ComponentType<any> {
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
          {
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
