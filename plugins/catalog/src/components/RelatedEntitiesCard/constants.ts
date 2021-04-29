/*
 * Copyright 2021 Spotify AB
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
import {
  ComponentEntity,
  Entity,
  ResourceEntity,
  SystemEntity,
} from '@backstage/catalog-model';
import { EntityTable } from '@backstage/plugin-catalog-react';

export const componentColumns = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: 'component' }),
  EntityTable.columns.createOwnerColumn(),
  EntityTable.columns.createSpecTypeColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  EntityTable.columns.createMetadataDescriptionColumn(),
];
export const componentHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-component';
export const asComponentEntities = (entities: Entity[]) =>
  entities as ComponentEntity[];

export const resourceColumns = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: 'resource' }),
  EntityTable.columns.createOwnerColumn(),
  EntityTable.columns.createSpecTypeColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  EntityTable.columns.createMetadataDescriptionColumn(),
];
export const resourceHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-resource';
export const asResourceEntities = (entities: Entity[]) =>
  entities as ResourceEntity[];

export const systemColumns = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: 'system' }),
  EntityTable.columns.createOwnerColumn(),
  EntityTable.columns.createMetadataDescriptionColumn(),
];
export const systemHelpLink =
  'https://backstage.io/docs/features/software-catalog/descriptor-format#kind-system';
export const asSystemEntities = (entities: Entity[]) =>
  entities as SystemEntity[];
