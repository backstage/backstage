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
 * Common parameters shared by all home page widget types.
 *
 * @alpha
 */
export type HomePageWidgetBaseParams = {
  /** Optional name for the widget. Defaults to the extension ID. */
  name?: string;
  /** Title for the widget. For card widgets this is rendered as the card heading. */
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

/**
 * Parameters for a card-based home page widget (default).
 *
 * The `components` loader returns {@link ComponentParts} rendered inside an
 * `InfoCard` with a title header, optional actions, settings popover, and
 * context provider.
 *
 * @alpha
 */
export type HomePageCardWidgetParams = HomePageWidgetBaseParams & {
  render?: 'card';
  /**
   * Async loader that returns the component parts rendered within the InfoCard.
   *
   * - `Content` (required): main body of the card.
   * - `Actions` (optional): button rendered in the card header next to the title.
   * - `ContextProvider` (optional): wraps the widget in a React context provider.
   * - `Settings` (optional): content of the settings modal.
   */
  components: () => Promise<ComponentParts>;
};

/**
 * Parameters for a basic (non-card) home page widget.
 *
 * The `loader` returns a self-contained React component rendered directly
 * inside an `ExtensionBoundary` — without any InfoCard chrome. Layout and
 * visual presentation are entirely the component's responsibility.
 *
 * Typical use cases: full-width search bars, banners, or hero sections.
 *
 * @alpha
 */
export type HomePageBasicWidgetParams = HomePageWidgetBaseParams & {
  render: 'basic';
  /**
   * Async loader that returns a self-contained React component.
   * The component will receive any saved widget settings as props.
   */
  loader: () => Promise<ComponentType<Record<string, unknown>>>;
};

/**
 * Parameters for creating a home page widget extension.
 *
 * Use `render: 'card'` (or omit `render`, as it defaults to `'card'`) for
 * widgets wrapped in an `InfoCard` with a title header, actions, and settings
 * support. Use `render: 'basic'` for widgets that manage their own visual
 * presentation (search bars, banners, hero sections, etc.).
 *
 * @alpha
 */
export type HomePageWidgetBlueprintParams =
  | HomePageCardWidgetParams
  | HomePageBasicWidgetParams;

const DEFAULT_WIDGET_ATTACH_POINT = {
  id: 'page:home',
  input: 'widgets',
} as const;

/**
 * Creates widgets that can be installed into the home page grid.
 *
 * - `render?: 'card'` (default): wrapped in an `InfoCard` with a title header,
 *   optional secondary action, settings popover, and context provider. Provide
 *   a `components` loader that returns {@link ComponentParts}.
 * - `render: 'basic'`: renders the component returned by `loader` directly
 *   inside an `ExtensionBoundary`, without any card chrome. Use this for
 *   search bars, banners, hero sections, or any widget that manages its own
 *   visual presentation.
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

    let Widget: (props: Record<string, unknown>) => ReactElement;

    if (params.render === 'basic') {
      const LazyComponent = lazy(() =>
        params.loader().then(Component => ({
          default: Component as ComponentType<Record<string, unknown>>,
        })),
      );

      Widget = (props: Record<string, unknown>): ReactElement => (
        <ExtensionBoundary node={node}>
          <LazyComponent {...props} />
        </ExtensionBoundary>
      );
    } else {
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
    attachComponentData(Widget, 'core.extensionId', node.spec.id);
    attachComponentData(Widget, 'title', params.title);
    attachComponentData(Widget, 'description', params.description);
    attachComponentData(Widget, 'home.widget.config', {
      layout: params.layout,
      settings: params.settings,
    });

    yield homePageWidgetDataRef({
      node,
      component: <Widget {...(params.componentProps ?? {})} />,
      name: widgetName,
      title: params.title,
      description: params.description,
      layout: params.layout,
      settings: params.settings,
    });
  },
});
