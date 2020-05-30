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

import React from 'react';
import privateExports, {
  AppOptions,
  ApiRegistry,
  defaultSystemIcons,
} from '@backstage/core-api';

import { ErrorPage } from '../layout/ErrorPage';
import { lightTheme, darkTheme } from '@backstage/theme';

const { PrivateAppImpl } = privateExports;

// createApp is defined in core, and not core-api, since we need access
// to the components inside core to provide defaults.
// The actual implementation of the app class still lives in core-api,
// as it needs to be used by dev- and test-utils.

/**
 * Creates a new Backstage App.
 */
export function createApp(options?: AppOptions) {
  const DefaultNotFoundPage = () => (
    <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
  );

  const apis = options?.apis ?? ApiRegistry.from([]);
  const icons = { ...defaultSystemIcons, ...options?.icons };
  const plugins = options?.plugins ?? [];
  const components = {
    NotFoundErrorPage: DefaultNotFoundPage,
    ...options?.components,
  };
  const themes = options?.themes ?? [
    {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      theme: lightTheme,
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      variant: 'dark',
      theme: darkTheme,
    },
  ];

  const app = new PrivateAppImpl({ apis, icons, plugins, components, themes });

  app.verify();

  return app;
}
