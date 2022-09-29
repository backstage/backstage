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

import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import { scaffolderCatalogModule } from '@backstage/plugin-scaffolder-backend';
import { createBackend } from '@backstage/backend-defaults';
import { appPlugin } from '@backstage/plugin-app-backend';

const backend = createBackend();

backend.add(catalogPlugin());
backend.add(scaffolderCatalogModule());
backend.add(appPlugin({ appPackageName: 'example-app' }));
backend.start();
