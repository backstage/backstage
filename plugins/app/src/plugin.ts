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
  ComponentsApi,
  IconsApi,
  FeatureFlagsApi,
  TranslationsApi,
  DefaultProgressComponent,
  DefaultNotFoundErrorPageComponent,
  DefaultErrorBoundaryComponent,
  oauthRequestDialogAppRootElement,
  alertDisplayAppRootElement,
  DefaultSignInPage,
  dialogDisplayAppRootElement,
} from './extensions';
import { apis } from './defaultApis';

/** @public */
export const appPlugin = createFrontendPlugin({
  id: 'app',
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
    ComponentsApi,
    IconsApi,
    FeatureFlagsApi,
    TranslationsApi,
    DefaultProgressComponent,
    DefaultNotFoundErrorPageComponent,
    DefaultErrorBoundaryComponent,
    DefaultSignInPage,
    oauthRequestDialogAppRootElement,
    alertDisplayAppRootElement,
    dialogDisplayAppRootElement,
  ],
});
