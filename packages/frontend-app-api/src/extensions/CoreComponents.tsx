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

import React, { PropsWithChildren, useMemo } from 'react';
import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
  createProgressExtension,
  createBootErrorPageExtension,
  createNotFoundErrorPageExtension,
  createErrorBoundaryFallbackExtension,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { components as defaultComponents } from '../../../app-defaults/src/defaults';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppContextProvider } from '../../../core-app-api/src/app/AppContext';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { useApp } from '../../../core-plugin-api/src/app/useApp';

export const DefaultProgressComponent = createProgressExtension({
  component: async () => defaultComponents.Progress,
});

export const DefaultBootErrorPageComponent = createBootErrorPageExtension({
  component: async () => defaultComponents.BootErrorPage,
});

export const DefaultNotFoundErrorPageComponent =
  createNotFoundErrorPageExtension({
    component: async () => defaultComponents.NotFoundErrorPage,
  });

export const DefaultErrorBoundaryComponent =
  createErrorBoundaryFallbackExtension({
    component: async () => defaultComponents.ErrorBoundaryFallback,
  });

export const CoreComponents = createExtension({
  id: 'core.components',
  attachTo: { id: 'core', input: 'components' },
  inputs: {
    progress: createExtensionInput(
      {
        component: coreExtensionData.components.progress,
      },
      {
        optional: true,
        singleton: true,
      },
    ),
    bootErrorPage: createExtensionInput(
      {
        component: coreExtensionData.components.bootErrorPage,
      },
      {
        optional: true,
        singleton: true,
      },
    ),
    notFoundErrorPage: createExtensionInput(
      {
        component: coreExtensionData.components.notFoundErrorPage,
      },
      {
        optional: true,
        singleton: true,
      },
    ),
    errorBoundaryFallback: createExtensionInput(
      {
        component: coreExtensionData.components.errorBoundaryFallback,
      },
      {
        optional: true,
        singleton: true,
      },
    ),
  },
  output: {
    provider: coreExtensionData.reactComponent,
  },
  factory({ bind, inputs }) {
    bind({
      provider: function Provider(props: PropsWithChildren<{}>) {
        const { children } = props;
        const app = useApp();

        const context = useMemo(
          () => ({
            ...app,
            // Only override components
            getComponents: () => {
              const {
                progress,
                bootErrorPage,
                notFoundErrorPage,
                errorBoundaryFallback,
              } = inputs;

              const {
                Progress,
                BootErrorPage,
                NotFoundErrorPage,
                ErrorBoundaryFallback,
                ...components
              } = app.getComponents();

              return {
                ...components,
                Progress: progress?.component ?? Progress,
                BootErrorPage: bootErrorPage?.component ?? BootErrorPage,
                NotFoundErrorPage:
                  notFoundErrorPage?.component ?? NotFoundErrorPage,
                ErrorBoundaryFallback:
                  errorBoundaryFallback?.component ?? ErrorBoundaryFallback,
              };
            },
          }),
          [app],
        );

        return (
          <AppContextProvider appContext={context}>
            {children}
          </AppContextProvider>
        );
      },
    });
  },
});
