/*
 * Copyright 2024 The Backstage Authors
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

import type { ZodTypeAny, ZodString } from 'zod/v4';

/**
 * Relation metadata attached to entity reference schemas.
 * Used by the registry to build the relation graph.
 * @public
 */
export interface RelationMetadata {
  forward: string;
  reverse: string;
  targetKinds?: string[];
}

/**
 * Symbol for storing relation metadata on Zod schemas.
 * @internal
 */
export const RELATION_METADATA = Symbol('relationMetadata');

/**
 * A Zod string schema with relation metadata support.
 * @public
 */
export interface EntityRefSchema extends ZodString {
  withRelations(opts: { forward: string; reverse: string }): this;
  [RELATION_METADATA]?: RelationMetadata;
}

/**
 * Extended Zod interface with catalog-specific helpers.
 * All standard Zod methods work, plus catalog domain helpers.
 * @public
 */
export interface CatalogZ {
  string: typeof import('zod/v4').z.string;
  number: typeof import('zod/v4').z.number;
  boolean: typeof import('zod/v4').z.boolean;
  object: typeof import('zod/v4').z.object;
  array: typeof import('zod/v4').z.array;
  enum: typeof import('zod/v4').z.enum;
  record: typeof import('zod/v4').z.record;
  optional: typeof import('zod/v4').z.optional;
  literal: typeof import('zod/v4').z.literal;
  union: typeof import('zod/v4').z.union;

  /** Creates an entity reference schema with optional kind constraints. */
  entityRef(opts?: {
    kind?: string | string[];
    description?: string;
  }): EntityRefSchema;

  /** Standard lifecycle enum for catalog entities. */
  lifecycle(): import('zod/v4').ZodEnum<{
    production: 'production';
    experimental: 'experimental';
    deprecated: 'deprecated';
  }>;
}

/**
 * CRD-style metadata for a catalog kind.
 * @public
 */
export interface KindMetadata {
  apiVersion: string;
  names: {
    kind: string;
    singular: string;
    plural: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
}

/**
 * Configuration for creating a new catalog kind.
 * @public
 */
export interface CreateKindConfig {
  apiVersion: string;
  names: {
    kind: string;
    singular: string;
    plural: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
  schema: (z: CatalogZ) => {
    spec?: Record<string, ZodTypeAny>;
    metadata?: {
      annotations?: Record<string, ZodTypeAny>;
      labels?: Record<string, ZodTypeAny>;
      [key: string]: any;
    };
  };
}

/**
 * Extension callback for adding fields to a schema.
 * @public
 */
export type ExtensionCallback = (z: CatalogZ) => Record<string, ZodTypeAny>;

/**
 * Resolved kind information after the registry has been resolved.
 * @public
 */
export interface ResolvedKind {
  metadata: KindMetadata;
  specFields: Record<string, ZodTypeAny>;
  metadataFields: Record<string, ZodTypeAny>;
}
