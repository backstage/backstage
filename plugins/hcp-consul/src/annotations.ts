/*
 * Copyright 2023 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';

/** @public */
export const CONSUL_NAMESPACE_ANNOTATION = 'consul.io/namespace';

/** @public */
export const CONSUL_PARTITION_ANNOTATION = 'consul.io/partition';

/** @public */
export const CONSUL_NAME_ANNOTATION = 'consul.io/name';

/** @public */
export const CONSUL_CLUSTER_RESOUCR_NAME_ANNOTATION =
  'consul.io/cluster_resource_name';

/** @public */
export const isHcpConsulServiceAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CONSUL_NAME_ANNOTATION]) &&
  Boolean(
    entity.metadata.annotations?.[CONSUL_CLUSTER_RESOUCR_NAME_ANNOTATION],
  );
