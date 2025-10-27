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
import { compatWrapper } from '@backstage/core-compat-api';
import {
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import {
  CardExtension,
  CardExtensionProps,
  CardLayout,
  CardSettings,
  ComponentParts,
} from '../../extensions';
import { homePageWidgetDataRef } from '../dataRefs';

/** @alpha */
export interface HomepageWidgetBlueprintParams {
  /**
   * Optional name for the widget. If not provided, the extension will use only its kind
   * in the extension ID.
   */
  name?: string;
  /**
   * Optional title displayed for the widget, used as the default card heading.
   */
  title?: string;
  /**
   * Optional description shown in the widget catalog when adding new cards.
   */
  description?: string;
  /**
   * Component parts rendered within the card.
   */
  components: () => Promise<ComponentParts>;
  /**
   * Layout hints used by the customizable grid.
   */
  layout?: CardLayout;
  /**
   * Schema used to configure widget settings.
   */
  settings?: CardSettings;
  /**
   * Default props forwarded to the rendered widget component.
   */
  componentProps?: Record<string, unknown>;
}

const DEFAULT_WIDGET_ATTACH_POINT = {
  id: 'page:home',
  input: 'widgets',
} as const;

/**
 * Creates widgets that can be installed into the home page grid.
 *
 * @alpha
 */
export const HomepageWidgetBlueprint = createExtensionBlueprint({
  kind: 'home-widget',
  attachTo: DEFAULT_WIDGET_ATTACH_POINT,
  output: [homePageWidgetDataRef],
  *factory(params: HomepageWidgetBlueprintParams, { node }) {
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
    ): ReactElement =>
      compatWrapper(
        <ExtensionBoundary node={node}>
          <LazyCard {...props} />
        </ExtensionBoundary>,
      );

    yield homePageWidgetDataRef({
      component: <Widget {...(params.componentProps ?? {})} />,
      name: params.name,
      title: params.title,
      description: params.description,
      layout: params.layout,
      settings: params.settings,
    });
  },
});
