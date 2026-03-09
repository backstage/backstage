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

import { ComponentType, lazy, ReactElement } from 'react';
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
 * Parameters for creating a home page widget extension.
 *
 * Provide either `components` (card-based, wrapped in InfoCard) or `loader`
 * (generic, rendered directly without card chrome). Exactly one must be
 * provided — they are mutually exclusive.
 *
 * @alpha
 */
export type HomePageWidgetBlueprintParams =
  | {
      /**
       * Component parts rendered within the card.
       *
       * Use this when the widget should be displayed as an InfoCard with a
       * title header, optional actions, settings, and a context provider. This
       * is the original card-based API and remains the recommended choice for
       * card widgets.
       */
      components: () => Promise<ComponentParts>;
      loader?: never;
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
    }
  | {
      /**
       * Async loader that returns a self-contained React component.
       *
       * Use this when the widget should render freely without any card chrome
       * (no InfoCard, no title header, no divider). The returned component is
       * rendered directly inside an ExtensionBoundary — layout and visual
       * presentation are entirely the component's responsibility.
       *
       * Typical use cases: full-width search bars, banners, hero sections, or
       * any widget that is not logically a "card".
       */
      loader: () => Promise<ComponentType<{}>>;
      components?: never;
      /** Optional name for the widget. Defaults to the extension ID. */
      name?: string;
      /** Title for the widget (used for catalogue display, not rendered as a heading). */
      title?: string;
      /** Description shown in the widget catalog. */
      description?: string;
      /** Layout hints used by the customizable grid. */
      layout?: WidgetLayout;
      /** Schema used to configure widget settings. */
      settings?: WidgetSettings;
    };

const DEFAULT_WIDGET_ATTACH_POINT = {
  id: 'page:home',
  input: 'widgets',
} as const;

/**
 * Creates widgets that can be installed into the home page grid.
 *
 * @alpha
 */
export const HomePageWidgetBlueprint = createExtensionBlueprint({
  kind: 'home-page-widget',
  attachTo: DEFAULT_WIDGET_ATTACH_POINT,
  dataRefs: {
    widget: homePageWidgetDataRef,
  },
  output: [homePageWidgetDataRef],
  *factory(params: HomePageWidgetBlueprintParams, { node }) {
    const widgetName = params.name ?? node.spec.id;
    // Narrow componentProps here while the union is still discriminated.
    // loader-based widgets receive no props; card-based widgets may have componentProps.
    const componentProps = params.loader ? {} : params.componentProps ?? {};

    let Widget: (props: Record<string, unknown>) => ReactElement;

    if (params.loader) {
      // Generic (non-card) path: the component is rendered directly, without
      // any CardExtension / InfoCard wrapping. The widget author is fully
      // responsible for the visual presentation.
      const LazyComponent = lazy(() =>
        params.loader().then(Component => ({ default: Component })),
      );

      Widget = (): ReactElement => (
        <ExtensionBoundary node={node}>
          <LazyComponent />
        </ExtensionBoundary>
      );
    } else {
      // Card-based path (original behaviour): wraps ComponentParts in
      // CardExtension → InfoCard.
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

      Widget = (
        props: CardExtensionProps<Record<string, unknown>>,
      ): ReactElement => (
        <ExtensionBoundary node={node}>
          <LazyCard {...props} />
        </ExtensionBoundary>
      );
    }

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
