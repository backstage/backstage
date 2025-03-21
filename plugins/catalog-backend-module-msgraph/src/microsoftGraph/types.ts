/*
 * Copyright 2020 The Backstage Authors
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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { MicrosoftGraphProviderConfig } from './config';
/**
 * Customize the ingested User entity
 *
 * @public
 */
export type UserTransformer = (
  user: MicrosoftGraph.User,
  userPhoto?: string,
) => Promise<UserEntity | undefined>;

/**
 * Customize the ingested organization Group entity
 *
 * @public
 */
export type OrganizationTransformer = (
  organization: MicrosoftGraph.Organization,
) => Promise<GroupEntity | undefined>;

/**
 * Customize the ingested Group entity
 *
 * @public
 */
export type GroupTransformer = (
  group: MicrosoftGraph.Group,
  groupPhoto?: string,
) => Promise<GroupEntity | undefined>;

/**
 * Customize the MSGraph Provider Config Dynamically
 *
 * Transforming fields that are not used for each scheduled ingestion (e.g., id, schedule)
 * will have no effect.
 *
 * @public
 */
export type ProviderConfigTransformer = (
  provider: MicrosoftGraphProviderConfig,
) => Promise<MicrosoftGraphProviderConfig>;
