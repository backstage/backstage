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
  FrontendFeature,
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createExtensionKind,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';
import { getComponentData } from '@backstage/core-plugin-api';
import { collectLegacyRoutes } from './collectLegacyRoutes';

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
export function convertLegacyApp(
  rootElement: React.JSX.Element,
): FrontendFeature[] {
  if (getComponentData(rootElement, 'core.type') === 'FlatRoutes') {
    return collectLegacyRoutes(rootElement);
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
    namespace: 'app',
    name: 'layout',
    attachTo: { id: 'app', input: 'root' },
    inputs: {
      content: createExtensionInput(
        {
          element: coreExtensionData.reactElement,
        },
        { singleton: true },
      ),
    },
    output: {
      element: coreExtensionData.reactElement,
    },
    factory({ inputs }) {
      // Clone the root element, this replaces the FlatRoutes declared in the app with out content input
      return {
        element: React.cloneElement(
          rootEl,
          undefined,
          inputs.content.output.element,
        ),
      };
    },
  });

  const CoreNavOverride = CurrentCoreNav.override({
    // namespace: 'app',
    // name: 'nav',
    // attachTo: { id: 'app/layout', input: 'nav' },
    // output: {},
    factory: () => ({}),
    disabled: true,
  });

  createExtensionOverride({
    extension: CurrentCoreNav,
    factory: () => null,
  });

  const collectedRoutes = collectLegacyRoutes(routesEl);

  return [
    ...collectedRoutes,
    createExtensionOverrides({
      extensions: [CoreNavOverride, CoreNavOverride],
    }),
  ];
}

const EntityCardExtension = createExtensionKind({
  kind: 'entity-card',
  attachTo: { id: 'entity-card', input: 'default' },
  inputs: {
    loader: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs }, props: { title: string }) {
    console.log(inputs.loader);
    return {
      element: React.createElement('h1'),
    };
  },
});

const GithubCard = EntityCardExtension.new({
  props: {
    title: 'GitHub Card',
  },
  factory({ inputs: { loader } }) {
    console.log(loader);
    return {
      element: React.createElement('h2'),
    };
  },
});

GithubCard.override({
  attachTo: { id: 'entity-card', input: 'github' },
  inputs: {
    loader: createExtensionInput(
      {
        element: coreExtensionData.reactElement,
      },
      { singleton: false },
    ),
    loader2: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  factory({ originalFactory, inputs }) {
    inputs.loader2;
    inputs.loader;
    return originalFactory({
      inputsOverride: inputs,
    });
  },
});
