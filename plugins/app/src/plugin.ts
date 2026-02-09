/*
 * Copyright 2024 The Backstage Authors
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

import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import {
  App,
  AppLanguageApi,
  AppLayout,
  AppNav,
  AppRoot,
  AppRoutes,
  AppThemeApi,
  DarkTheme,
  LightTheme,
  SwappableComponentsApi,
  IconsApi,
  FeatureFlagsApi,
  PluginWrapperApi,
  TranslationsApi,
  oauthRequestDialogAppRootElement,
  alertDisplayAppRootElement,
  DefaultSignInPage,
  dialogDisplayAppRootElement,
  Progress,
  NotFoundErrorPage,
  ErrorDisplay,
  PageLayout,
  LegacyComponentsApi,
} from './extensions';
import { apis } from './defaultApis';

/** @public */
export const appPlugin = createFrontendPlugin({
  pluginId: 'app',
  info: { packageJson: () => import('../package.json') },
  extensions: [
    ...apis,
    App,
    AppLanguageApi,
    AppLayout,
    AppNav,
    AppRoot,
    AppRoutes,
    AppThemeApi,
    DarkTheme,
    LightTheme,
    SwappableComponentsApi,
    IconsApi,
    FeatureFlagsApi,
    PluginWrapperApi,
    TranslationsApi,
    DefaultSignInPage,
    oauthRequestDialogAppRootElement,
    alertDisplayAppRootElement,
    dialogDisplayAppRootElement,
    Progress,
    NotFoundErrorPage,
    ErrorDisplay,
    PageLayout,
    LegacyComponentsApi,
  ],
});
