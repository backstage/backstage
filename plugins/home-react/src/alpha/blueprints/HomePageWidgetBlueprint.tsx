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
import { WidgetLayout, WidgetSettings } from '../../extensions';
import { homePageWidgetDataRef } from '../dataRefs';

/**
 * Parameters for creating a generic (non-card) home page widget extension.
 *
 * The `loader` returns a self-contained React component that is rendered
 * directly inside an `ExtensionBoundary` — without any InfoCard chrome, title
 * header, or divider. Layout and visual presentation are entirely the
 * component's responsibility.
 *
 * Typical use cases: full-width search bars, banners, hero sections, or any
 * widget that is not logically a "card".
 *
 * For card-based widgets (wrapped in an InfoCard with a title header, actions,
 * and settings support), use {@link HomePageCardWidgetBlueprint} instead.
 *
 * @alpha
 */
export type HomePageWidgetBlueprintParams = {
  /**
   * Async loader that returns a self-contained React component.
   * The component will receive any saved widget settings as props.
   */
  loader: () => Promise<ComponentType<Record<string, unknown>>>;
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
 * Creates generic (non-card) widgets that can be installed into the home page
 * grid.
 *
 * The component returned by `loader` is rendered directly inside an
 * `ExtensionBoundary` without any InfoCard wrapping. Use this blueprint for
 * widgets that manage their own visual presentation (search bars, banners,
 * hero sections, etc.).
 *
 * For card-based widgets (InfoCard with title header, actions, and settings
 * support), use {@link HomePageCardWidgetBlueprint} instead.
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

    const LazyComponent = lazy(() =>
      params.loader().then(Component => ({
        default: Component as ComponentType<Record<string, unknown>>,
      })),
    );

    const Widget = (props: Record<string, unknown>): ReactElement => (
      <ExtensionBoundary node={node}>
        <LazyComponent {...props} />
      </ExtensionBoundary>
    );

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
      component: <Widget />,
      name: widgetName,
      title: params.title,
      description: params.description,
      layout: params.layout,
      settings: params.settings,
    });
  },
});
