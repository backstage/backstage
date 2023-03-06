/*
 * Copyright 2022 The Backstage Authors
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

import { catalogPlugin } from '@backstage/plugin-catalog-backend/alpha';
import { catalogModuleTemplateKind } from '@backstage/plugin-scaffolder-backend/alpha';
import { createBackend } from '@backstage/backend-defaults';
import { appPlugin } from '@backstage/plugin-app-backend/alpha';
import { todoPlugin } from '@backstage/plugin-todo-backend';
import { techdocsPlugin } from '@backstage/plugin-techdocs-backend/alpha';
import { searchPlugin } from '@backstage/plugin-search-backend';
import { searchIndexRegistry } from './plugins/search';

const backend = createBackend();

backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());
backend.add(appPlugin({ appPackageName: 'example-app' }));
backend.add(todoPlugin());
backend.add(techdocsPlugin());

backend.add(searchPlugin());
backend.add(searchIndexRegistry());

backend.start();
