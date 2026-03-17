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

import { columnFactories, EntityColumnConfig } from './columnFactories';

/** @alpha */
export const entityColumnPresets = {
  component: {
    columns: [
      columnFactories.createEntityRefColumn({ defaultKind: 'component' }),
      columnFactories.createOwnerColumn(),
      columnFactories.createSpecTypeColumn(),
      columnFactories.createSpecLifecycleColumn(),
      columnFactories.createMetadataDescriptionColumn(),
    ] as EntityColumnConfig[],
    helpLink:
      'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component',
  },
  resource: {
    columns: [
      columnFactories.createEntityRefColumn({ defaultKind: 'resource' }),
      columnFactories.createOwnerColumn(),
      columnFactories.createSpecTypeColumn(),
      columnFactories.createSpecLifecycleColumn(),
      columnFactories.createMetadataDescriptionColumn(),
    ] as EntityColumnConfig[],
    helpLink:
      'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-resource',
  },
  system: {
    columns: [
      columnFactories.createEntityRefColumn({ defaultKind: 'system' }),
      columnFactories.createOwnerColumn(),
      columnFactories.createMetadataDescriptionColumn(),
    ] as EntityColumnConfig[],
    helpLink:
      'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-system',
  },
  domain: {
    columns: [
      columnFactories.createEntityRefColumn({ defaultKind: 'domain' }),
      columnFactories.createOwnerColumn(),
      columnFactories.createMetadataDescriptionColumn(),
    ] as EntityColumnConfig[],
    helpLink:
      'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-domain',
  },
} as const;
