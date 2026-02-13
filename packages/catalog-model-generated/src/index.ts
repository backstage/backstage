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

// Do not edit manually.

export type { Entity, EntityMeta } from '@backstage/catalog-model';
import type { Entity, EntityMeta } from '@backstage/catalog-model';

export type ComponentEntitySpec = {
  /** Component type */
  type: string;
  /** Current lifecycle stage */
  lifecycle: 'production' | 'experimental' | 'deprecated';
  /** The owning entity */
  owner: string;
  /** The system this belongs to */
  system?: string | undefined;
  /** Parent component if this is a subcomponent */
  subcomponentOf?: string | undefined;
  /** APIs this component provides */
  providesApis?: string[] | undefined;
  /** APIs this component consumes */
  consumesApis?: string[] | undefined;
  /** Other entities this component depends on */
  dependsOn?: string[] | undefined;
  /** Finance cost center code for billing attribution */
  costCenter: string;
  /** SLA tier for incident response */
  tier: 'critical' | 'standard' | 'internal';
  /** Team responsible for day-to-day maintenance */
  team: string;
};

export type ComponentEntityAnnotations = {
  /** Slack channel for the team owning this component */
  'company.com/slack-channel': string;
  /** Link to the operational runbook */
  'company.com/runbook-url': string;
  /** Datadog dashboard URL for monitoring */
  'company.com/datadog-dashboard': string;
  /** Identifier used to find Kubernetes resources. Matches app.kubernetes.io/name label by default. */
  'backstage.io/kubernetes-id': string;
  /** Kubernetes kind of the resource. If not set, all kinds are searched. */
  'backstage.io/kubernetes-kind'?: string | undefined;
  /** Kubernetes name of the resource. If not set, all names are searched. */
  'backstage.io/kubernetes-name'?: string | undefined;
  /** Kubernetes namespace override. If not set, all namespaces are searched. */
  'backstage.io/kubernetes-namespace'?: string | undefined;
  /** Custom label selector query for finding pods. */
  'backstage.io/kubernetes-label-selector'?: string | undefined;
  /** Target cluster name. If not set, all configured clusters are searched. */
  'backstage.io/kubernetes-cluster'?: string | undefined;
  [x: string]: unknown;
};

export type ComponentEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Component';
  metadata: EntityMeta & {
    annotations?: ComponentEntityAnnotations;
  };
  spec: ComponentEntitySpec;
};

export function isComponentEntity(entity: Entity): entity is ComponentEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'Component'
  );
}

export type APIEntitySpec = {
  /** API type */
  type: string;
  /** Current lifecycle stage */
  lifecycle: 'production' | 'experimental' | 'deprecated';
  /** The owning entity */
  owner: string;
  /** The system this belongs to */
  system?: string | undefined;
  /** The API definition */
  definition: string;
  [x: string]: unknown;
};

export type APIEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'API';
  spec: APIEntitySpec;
};

export function isAPIEntity(entity: Entity): entity is APIEntity {
  return entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'API';
}

export type SystemEntitySpec = {
  /** The owning entity */
  owner: string;
  /** The domain this system belongs to */
  domain?: string | undefined;
  [x: string]: unknown;
};

export type SystemEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'System';
  spec: SystemEntitySpec;
};

export function isSystemEntity(entity: Entity): entity is SystemEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'System'
  );
}

export type DomainEntitySpec = {
  /** The owning entity */
  owner: string;
  [x: string]: unknown;
};

export type DomainEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Domain';
  spec: DomainEntitySpec;
};

export function isDomainEntity(entity: Entity): entity is DomainEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'Domain'
  );
}

export type ResourceEntitySpec = {
  /** Resource type */
  type: string;
  /** The owning entity */
  owner: string;
  /** The system this belongs to */
  system?: string | undefined;
  /** Other entities this resource depends on */
  dependsOn?: string[] | undefined;
  /** Entities that depend on this resource */
  dependencyOf?: string[] | undefined;
  [x: string]: unknown;
};

export type ResourceEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Resource';
  spec: ResourceEntitySpec;
};

export function isResourceEntity(entity: Entity): entity is ResourceEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'Resource'
  );
}

export type GroupEntitySpec = {
  /** Group type */
  type: string;
  /** Parent group */
  parent?: string | undefined;
  /** Child groups */
  children: string[];
  /** Users that are members of this group */
  members?: string[] | undefined;
  [x: string]: unknown;
};

export type GroupEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Group';
  spec: GroupEntitySpec;
};

export function isGroupEntity(entity: Entity): entity is GroupEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'Group'
  );
}

export type UserEntitySpec = {
  /** Groups this user belongs to */
  memberOf: string[];
  [x: string]: unknown;
};

export type UserEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'User';
  spec: UserEntitySpec;
};

export function isUserEntity(entity: Entity): entity is UserEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'User'
  );
}

export type LocationEntitySpec = {
  /** Location type */
  type?: string | undefined;
  /** Single target location */
  target?: string | undefined;
  /** List of target locations */
  targets?: string[] | undefined;
  /** Whether the location target must exist */
  presence?: ('required' | 'optional') | undefined;
  [x: string]: unknown;
};

export type LocationEntity = Entity & {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Location';
  spec: LocationEntitySpec;
};

export function isLocationEntity(entity: Entity): entity is LocationEntity {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'Location'
  );
}

export type DatabaseEntitySpec = {
  /** Database engine type */
  engine: 'postgres' | 'mysql' | 'mongodb' | 'redis';
  /** Engine version */
  version: string;
  /** Team responsible for this database */
  owner: string;
  maxConnections?: string | undefined;
  [x: string]: unknown;
};

export type DatabaseEntity = Entity & {
  apiVersion: 'my-org.io/v1alpha1';
  kind: 'Database';
  spec: DatabaseEntitySpec;
};

export function isDatabaseEntity(entity: Entity): entity is DatabaseEntity {
  return (
    entity.apiVersion === 'my-org.io/v1alpha1' && entity.kind === 'Database'
  );
}

export interface CatalogEntityTypeRegistry {
  Component: ComponentEntity;
  API: APIEntity;
  System: SystemEntity;
  Domain: DomainEntity;
  Resource: ResourceEntity;
  Group: GroupEntity;
  User: UserEntity;
  Location: LocationEntity;
  Database: DatabaseEntity;
}

export type CatalogEntity =
  | ComponentEntity
  | APIEntity
  | SystemEntity
  | DomainEntity
  | ResourceEntity
  | GroupEntity
  | UserEntity
  | LocationEntity
  | DatabaseEntity;
