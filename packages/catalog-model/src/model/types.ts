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

import { OpaqueType } from '@internal/opaque';
import { CatalogModelOp } from './operations';
import { JsonObject } from '@backstage/types';

// #region CatalogModelLayer

/**
 * An opaque type that represents a set of catalog model layers.
 *
 * @alpha
 */
export interface CatalogModelLayer {
  readonly $$type: '@backstage/CatalogModelLayer';
  /**
   * The unique ID of the model layer.
   *
   * @remarks
   * @example `catalog.backstage.io/kind-api`
   *
   * This identifier is used for purposes of deduplication and tracking. It is
   * expected to be stable and descriptive. Prefer prefixing the ID with a
   * matching domain name. The backstage.io domain name is reserved for use by
   * the Backstage project itself.
   */
  readonly layerId: string;
}

/**
 * The opaque type that represents a catalog model layer.
 *
 * @internal
 * @remarks
 *
 * Model layers are essentially an array of operations. Several such model
 * layers are merged together to form a final outcome.
 */
export const OpaqueCatalogModelLayer = OpaqueType.create<{
  public: CatalogModelLayer;
  versions: {
    readonly version: 'v1';
    readonly layerId: string;
    readonly ops: Array<CatalogModelOp>;
  };
}>({
  type: '@backstage/CatalogModelLayer',
  versions: ['v1'],
});

// #endregion

// #region CatalogModel

/**
 * A compiled catalog model.
 *
 * @alpha
 */
export interface CatalogModel {
  /**
   * Lists all kinds in the model.
   */
  listKinds(): CatalogModelKindSummary[];

  /**
   * Lists all relations in the model.
   */
  listRelations(): CatalogModelRelationSummary[];

  /**
   * Returns summaries of the shared metadata fields in the model, including
   * all declared annotations, labels, and tags.
   */
  getMetadata(): {
    annotations: CatalogModelAnnotationSummary[];
    labels: CatalogModelLabelSummary[];
    tags: CatalogModelTagSummary[];
  };

  /**
   * Look up a kind in the model.
   *
   * @returns The kind if found, or `undefined` if no matching kind exists.
   * @throws TypeError if the kind exists in the model, but not for this apiVersion or type.
   */
  getKind(options: {
    kind: string;
    apiVersion: string;
    spec?: { type?: string };
  }): CatalogModelKind | undefined;

  /**
   * Look up all relations that originate from a given kind.
   *
   * @param kind - The kind name, e.g. "Component".
   * @returns The relations originating from the kind, or `undefined` if the
   *   kind is not known.
   */
  getRelations(options: { kind: string }): CatalogModelRelation[] | undefined;
}

// #endregion

// #region CatalogModelKind

/**
 * A compiled catalog model kind.
 *
 * @alpha
 */
export interface CatalogModelKind {
  /**
   * A human-readable description of the kind.
   */
  description: string;

  /**
   * The API version(s) of the kind that this schema applies to, e.g.
   * "backstage.io/v1alpha1".
   */
  apiVersions: string[];

  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component".
     */
    singular: string;

    /**
     * The plural form of the kind name, e.g. "components".
     */
    plural: string;
  };

  /**
   * The relation fields declared for this kind, with full dot-separated paths
   * into the entity (e.g. "spec.owner").
   */
  relationFields: Array<{
    /**
     * The full dot-separated path to the field in the entity, e.g. "spec.owner".
     */
    path: string;
    /**
     * The relation type that this field generates, e.g. "ownedBy".
     */
    relation: string;
    /**
     * The default kind for parsing shorthand entity refs.
     */
    defaultKind?: string;
    /**
     * The default namespace for parsing shorthand entity refs.
     */
    defaultNamespace?: 'inherit' | 'default';
    /**
     * The kinds that are allowed as targets for this relation field.
     */
    allowedKinds?: string[];
  }>;

  /**
   * The JSON schema of the kind.
   *
   * @remarks
   *
   * This can be used for validation of entities. Note that it is up to the
   * caller to ensure that the kind and apiVersion match what you are validating
   * against.
   */
  jsonSchema: JsonObject;
}

// #endregion

// #region CatalogModelKindSummary

/**
 * A summary of a catalog model kind, without version-specific details such as
 * schemas and relation fields.
 *
 * @alpha
 */
export interface CatalogModelKindSummary {
  /**
   * A human-readable description of the kind.
   */
  description: string;

  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component".
     */
    singular: string;

    /**
     * The plural form of the kind name, e.g. "components".
     */
    plural: string;
  };

  /**
   * The available versions and spec types for this kind.
   *
   * @remarks
   *
   * Each entry represents a unique apiVersion/specType combination that can be
   * passed to {@link CatalogModel.getKind} to retrieve the full kind details.
   */
  versions: Array<{
    /**
     * The API version, e.g. "backstage.io/v1alpha1".
     */
    apiVersion: string;
    /**
     * The spec type, if any, e.g. "service". Undefined means the default
     * (untyped) version.
     */
    specType?: string;
  }>;
}

// #endregion

// #region CatalogModelRelation

/**
 * A compiled catalog model relation.
 *
 * @alpha
 */
export interface CatalogModelRelation {
  /**
   * The kinds that this relation can originate from.
   */
  fromKind: string[];
  /**
   * The kinds that this relation can point to.
   */
  toKind: string[];
  /**
   * A human-readable description of the relation.
   */
  description: string;
  /**
   * The forward direction of this relation.
   */
  forward: {
    type: string;
    title: string;
  };
  /**
   * The reverse direction of this relation.
   */
  reverse: {
    type: string;
    title: string;
  };
}

// #endregion

// #region CatalogModelAnnotationSummary

/**
 * A summary of a catalog model annotation.
 *
 * @alpha
 */
export interface CatalogModelAnnotationSummary {
  /**
   * The annotation key, e.g. "backstage.io/managed-by-location".
   */
  name: string;
  /**
   * A short human-readable title for the annotation.
   */
  title?: string;
  /**
   * A human-readable description of the annotation.
   */
  description: string;
}

// #endregion

// #region CatalogModelLabelSummary

/**
 * A summary of a catalog model label.
 *
 * @alpha
 */
export interface CatalogModelLabelSummary {
  /**
   * The label key, e.g. "backstage.io/orphan".
   */
  name: string;
  /**
   * A short human-readable title for the label.
   */
  title?: string;
  /**
   * A human-readable description of the label.
   */
  description: string;
}

// #endregion

// #region CatalogModelTagSummary

/**
 * A summary of a catalog model tag.
 *
 * @alpha
 */
export interface CatalogModelTagSummary {
  /**
   * The tag value, e.g. "java".
   */
  name: string;
  /**
   * A short human-readable title for the tag.
   */
  title?: string;
  /**
   * A human-readable description of the tag.
   */
  description: string;
}

// #endregion

// #region CatalogModelRelationSummary

/**
 * A summary of a catalog model relation.
 *
 * @alpha
 */
export interface CatalogModelRelationSummary {
  /**
   * The kinds that this relation can originate from.
   */
  fromKind: string[];
  /**
   * The kinds that this relation can point to.
   */
  toKind: string[];
  /**
   * A human-readable description of the relation.
   */
  description: string;
  /**
   * The forward direction of this relation.
   */
  forward: {
    type: string;
    title: string;
  };
  /**
   * The reverse direction of this relation.
   */
  reverse: {
    type: string;
    title: string;
  };
}

// #endregion
