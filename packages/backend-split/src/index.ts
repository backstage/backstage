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

import { createBackend } from '@backstage/backend-defaults';
import { systemMetadataServiceFactory } from '@backstage/backend-defaults/alpha/systemMetadata';

const backend = createBackend();

backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend'));

backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
backend.add(import('@backstage/plugin-permission-backend'));

backend.add(import('./experimental/instanceMetadata'));
backend.add(import('./experimental/systemMetadata'));
backend.add(systemMetadataServiceFactory);

backend.start();
