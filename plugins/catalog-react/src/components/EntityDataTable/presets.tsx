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

import { ColumnConfig } from '@backstage/ui';
import { columnFactories, EntityRow } from './columnFactories';

/** @public */
export const componentColumnConfig: ColumnConfig<EntityRow>[] = [
  columnFactories.createEntityRefColumn({ defaultKind: 'component' }),
  columnFactories.createOwnerColumn(),
  columnFactories.createSpecTypeColumn(),
  columnFactories.createSpecLifecycleColumn(),
  columnFactories.createMetadataDescriptionColumn(),
];

/** @public */
export const resourceColumnConfig: ColumnConfig<EntityRow>[] = [
  columnFactories.createEntityRefColumn({ defaultKind: 'resource' }),
  columnFactories.createOwnerColumn(),
  columnFactories.createSpecTypeColumn(),
  columnFactories.createSpecLifecycleColumn(),
  columnFactories.createMetadataDescriptionColumn(),
];

/** @public */
export const systemColumnConfig: ColumnConfig<EntityRow>[] = [
  columnFactories.createEntityRefColumn({ defaultKind: 'system' }),
  columnFactories.createOwnerColumn(),
  columnFactories.createMetadataDescriptionColumn(),
];

/** @public */
export const domainColumnConfig: ColumnConfig<EntityRow>[] = [
  columnFactories.createEntityRefColumn({ defaultKind: 'domain' }),
  columnFactories.createOwnerColumn(),
  columnFactories.createMetadataDescriptionColumn(),
];

/** @public */
export const componentEntityHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component';

/** @public */
export const resourceEntityHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-resource';

/** @public */
export const systemEntityHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-system';

/** @public */
export const domainEntityHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-domain';
