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
  component: defaultComponents.Progress,
});

export const DefaultBootErrorPageComponent = createBootErrorPageExtension({
  component: defaultComponents.BootErrorPage,
});

export const DefaultNotFoundErrorPageComponent =
  createNotFoundErrorPageExtension({
    component: defaultComponents.NotFoundErrorPage,
  });

export const DefaultErrorBoundaryComponent =
  createErrorBoundaryFallbackExtension({
    component: defaultComponents.ErrorBoundaryFallback,
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
        singleton: true,
      },
    ),
    bootErrorPage: createExtensionInput(
      {
        component: coreExtensionData.components.bootErrorPage,
      },
      {
        singleton: true,
      },
    ),
    notFoundErrorPage: createExtensionInput(
      {
        component: coreExtensionData.components.notFoundErrorPage,
      },
      {
        singleton: true,
      },
    ),
    errorBoundaryFallback: createExtensionInput(
      {
        component: coreExtensionData.components.errorBoundaryFallback,
      },
      {
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
        const parentContext = useApp();

        const appContext = useMemo(
          () => ({
            ...parentContext,
            // Only override components
            getComponents: () => ({
              // Skipping Router and SignInPage
              ...parentContext.getComponents(),
              Progress: inputs.progress.component,
              BootErrorPage: inputs.bootErrorPage.component,
              NotFoundErrorPage: inputs.notFoundErrorPage.component,
              ErrorBoundaryFallback: inputs.errorBoundaryFallback.component,
            }),
          }),
          [parentContext],
        );

        return (
          <AppContextProvider appContext={appContext}>
            {children}
          </AppContextProvider>
        );
      },
    });
  },
});
