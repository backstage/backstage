/*
 * Copyright 2026 The Backstage Authors
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
import { AppIcon } from '@backstage/core-components';
import { apiDocsConfigApi, apiDocsHasApisEntityCard } from './syncExtensions';

/**
 * The part of the API docs plugin that is loaded together with the app when
 * the rest of the plugin is deferred, see
 * {@link https://backstage.io/docs/frontend-system/building-plugins/index#deferred-loading | the docs on deferred loading}.
 *
 * @remarks
 *
 * It holds the extensions that are needed before the plugin is first used:
 * the API docs config API, which the entity cards use, and the "has APIs"
 * entity card, since its entity filter is a function.
 *
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'api-docs',
  title: 'APIs',
  icon: <AppIcon fontSize="inherit" id="kind:api" />,
  extensions: [apiDocsConfigApi, apiDocsHasApisEntityCard],
});
