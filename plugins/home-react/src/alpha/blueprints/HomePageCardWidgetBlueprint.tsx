/*
 * Copyright 2025 The Backstage Authors
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

import { lazy, ReactElement } from 'react';
import {
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { attachComponentData } from '@backstage/core-plugin-api';
import {
  CardExtension,
  CardExtensionProps,
  WidgetLayout,
  WidgetSettings,
  ComponentParts,
} from '../../extensions';
import { homePageWidgetDataRef } from '../dataRefs';

/**
 * Parameters for creating a card-based home page widget extension.
 *
 * The `components` loader returns {@link ComponentParts} that are rendered
 * inside an InfoCard with a title header, optional actions, and settings
 * support.
 *
 * For widgets that manage their own visual presentation and do not need card
 * chrome (search bars, banners, hero sections, etc.), use
 * {@link HomePageWidgetBlueprint} instead.
 *
 * @alpha
 */
export type HomePageCardWidgetBlueprintParams = {
  /**
   * Async loader that returns the component parts rendered within the card.
   *
   * The parts are wrapped in a `InfoCard`, giving the widget
   * a title header, optional secondary action, settings popover, and a context
   * provider automatically.
   * The `Content` part is required and renders the main body of the card.
   * The `Actions` part is optional and renders a button in the card header next to the title.
   * The `ContextProvider` is also optional and can be used to wrap the widget in a React context provider, allowing the `Content` and `Actions` components to consume shared context values.
   * The `Settings` part is optional and renders the content of the settings modal when the user clicks the settings button in the card header.
   */
  components: () => Promise<ComponentParts>;
  /** Optional name for the widget. Defaults to the extension ID. */
  name?: string;
  /** Title displayed as the card heading. */
  title?: string;
  /** Description shown in the widget catalog. */
  description?: string;
  /** Layout hints used by the customizable grid. */
  layout?: WidgetLayout;
  /** Schema used to configure widget settings. */
  settings?: WidgetSettings;
  /** Default props forwarded to the rendered widget component. */
  componentProps?: Record<string, unknown>;
};

const DEFAULT_WIDGET_ATTACH_POINT = {
  id: 'page:home',
  input: 'widgets',
} as const;

/**
 * Creates card-based widgets that can be installed into the home page grid.
 *
 * Each widget is wrapped in an `InfoCard`, providing a title
 * header, optional secondary action, settings popover, and a context provider
 * out of the box.
 *
 * For widgets that manage their own visual presentation without card chrome
 * (search bars, banners, hero sections, etc.), use
 * {@link HomePageWidgetBlueprint} instead.
 *
 * @alpha
 */
export const HomePageCardWidgetBlueprint = createExtensionBlueprint({
  kind: 'home-page-widget',
  attachTo: DEFAULT_WIDGET_ATTACH_POINT,
  dataRefs: {
    widget: homePageWidgetDataRef,
  },
  output: [homePageWidgetDataRef],
  *factory(params: HomePageCardWidgetBlueprintParams, { node }) {
    const widgetName = params.name ?? node.spec.id;
    const componentProps = params.componentProps ?? {};
    const isCustomizable = params.settings?.schema !== undefined;

    const LazyCard = lazy(() =>
      params.components().then(parts => ({
        default: (props: CardExtensionProps<Record<string, unknown>>) => (
          <CardExtension
            {...props}
            {...parts}
            title={props.title || params.title}
            isCustomizable={isCustomizable}
          />
        ),
      })),
    );

    const Widget = (
      props: CardExtensionProps<Record<string, unknown>>,
    ): ReactElement => (
      <ExtensionBoundary node={node}>
        <LazyCard {...props} />
      </ExtensionBoundary>
    );

    attachComponentData(Widget, 'core.extensionName', widgetName);
    attachComponentData(Widget, 'title', params.title);
    attachComponentData(Widget, 'description', params.description);
    attachComponentData(Widget, 'home.widget.config', {
      layout: params.layout,
      settings: params.settings,
    });

    yield homePageWidgetDataRef({
      node,
      component: <Widget {...componentProps} />,
      name: widgetName,
      title: params.title,
      description: params.description,
      layout: params.layout,
      settings: params.settings,
    });
  },
});
