/*
 * Copyright 2023 The Backstage Authors
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

import React, {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  isValidElement,
} from 'react';
import {
  FrontendModule,
  FrontendPlugin,
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import { getComponentData } from '@backstage/core-plugin-api';
import { collectLegacyRoutes } from './collectLegacyRoutes';
import { compatWrapper } from './compatWrapper';

function selectChildren(
  rootNode: ReactNode,
  selector?: (element: ReactElement<{ children?: ReactNode }>) => boolean,
  strictError?: string,
): Array<ReactElement<{ children?: ReactNode }>> {
  return Children.toArray(rootNode).flatMap(node => {
    if (!isValidElement<{ children?: ReactNode }>(node)) {
      return [];
    }

    if (node.type === Fragment) {
      return selectChildren(node.props.children, selector, strictError);
    }

    if (selector === undefined || selector(node)) {
      return [node];
    }

    if (strictError) {
      throw new Error(strictError);
    }

    return selectChildren(node.props.children, selector, strictError);
  });
}

/** @public */
export interface ConvertLegacyAppOptions {
  /**
   * By providing an entity page element here it will be split up and converted
   * into individual extensions for the catalog plugin in the new frontend
   * system.
   *
   * In order to use this option the entity page and other catalog extensions
   * must be removed from the legacy app, and the catalog plugin for the new
   * frontend system must be installed instead.
   *
   * In order for this conversion to work the entity page must be a plain React
   * element tree without any component wrapping anywhere between the root
   * element and the `EntityLayout.Route` elements.
   *
   * When enabling this conversion you are likely to encounter duplicate entity
   * page content provided both via the old structure and the new plugins. Any
   * duplicate content needs to be removed from the old structure.
   */
  entityPage?: React.JSX.Element;
}

/** @public */
export function convertLegacyApp(
  rootElement: React.JSX.Element,
  options: ConvertLegacyAppOptions = {},
): (FrontendPlugin | FrontendModule)[] {
  if (getComponentData(rootElement, 'core.type') === 'FlatRoutes') {
    return collectLegacyRoutes(rootElement, options?.entityPage);
  }

  const appRouterEls = selectChildren(
    rootElement,
    el => getComponentData(el, 'core.type') === 'AppRouter',
  );
  if (appRouterEls.length !== 1) {
    throw new Error(
      "Failed to convert legacy app, AppRouter element could not been found. Make sure it's at the top level of the App element tree",
    );
  }

  const rootEls = selectChildren(
    appRouterEls[0].props.children,
    el =>
      Boolean(el.props.children) &&
      selectChildren(
        el.props.children,
        innerEl => getComponentData(innerEl, 'core.type') === 'FlatRoutes',
      ).length === 1,
  );
  if (rootEls.length !== 1) {
    throw new Error(
      "Failed to convert legacy app, Root element containing FlatRoutes could not been found. Make sure it's within the AppRouter element of the App element tree",
    );
  }
  const [rootEl] = rootEls;

  const routesEls = selectChildren(
    rootEls[0].props.children,
    el => getComponentData(el, 'core.type') === 'FlatRoutes',
  );
  if (routesEls.length !== 1) {
    throw new Error(
      'Unexpectedly failed to find FlatRoutes in app element tree',
    );
  }
  const [routesEl] = routesEls;

  const CoreLayoutOverride = createExtension({
    name: 'layout',
    attachTo: { id: 'app/root', input: 'children' },
    inputs: {
      content: createExtensionInput([coreExtensionData.reactElement], {
        singleton: true,
      }),
    },
    output: [coreExtensionData.reactElement],
    factory({ inputs }) {
      // Clone the root element, this replaces the FlatRoutes declared in the app with out content input
      return [
        coreExtensionData.reactElement(
          compatWrapper(
            React.cloneElement(
              rootEl,
              undefined,
              inputs.content.get(coreExtensionData.reactElement),
            ),
          ),
        ),
      ];
    },
  });
  const CoreNavOverride = createExtension({
    name: 'nav',
    attachTo: { id: 'app/layout', input: 'nav' },
    output: [],
    factory: () => [],
    disabled: true,
  });

  const collectedRoutes = collectLegacyRoutes(routesEl, options?.entityPage);

  return [
    ...collectedRoutes,
    createFrontendModule({
      pluginId: 'app',
      extensions: [CoreLayoutOverride, CoreNavOverride],
    }),
  ];
}
