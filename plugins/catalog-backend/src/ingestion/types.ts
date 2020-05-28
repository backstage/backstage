/*
 * Copyright 2020 Spotify AB
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

import { ComponentDescriptorV1beta1 } from './descriptors/ComponentDescriptorV1beta1Parser';

export type ComponentDescriptor = ComponentDescriptorV1beta1;

/**
 * Metadata fields common to all versions/kinds of entity.
 *
 * @see https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#objectmeta-v1-meta
 */
export type EntityMeta = {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * A positive nonzero number that indicates the current generation of data
   * for this entity; the value is incremented each time the spec changes.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations.
   */
  generation?: number;

  /**
   * The name of the entity.
   *
   * Must be uniqe within the catalog at any given point in time, for any
   * given namespace, for any given kind.
   */
  name?: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;
};

/**
 * The format envelope that's common to all versions/kinds.
 *
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
 */
export type Entity = {
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Optional metadata related to the entity.
   */
  metadata?: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: object;
};

/**
 * Parses and validates descriptors.
 *
 * The output must be validated and well formed.
 */
export type DescriptorParser = {
  /**
   * Parses and validates a single raw descriptor.
   *
   * @param descriptor A raw descriptor object
   * @returns A structure describing the parsed and validated descriptor
   * @throws An Error if the descriptor was malformed
   */
  parse(descriptor: object): Promise<Entity>;
};

/**
 * Parses and validates a single envelope into its materialized kind.
 *
 * These parsers may assume that the envelope is already validated and well
 * formed.
 */
export type KindParser = {
  /**
   * Try to parse an envelope into a materialized kind.
   *
   * @param envelope A valid descriptor envelope
   * @returns A materialized type, or undefined if the given version/kind is
   *          not meant to be handled by this parser
   * @throws An Error if the type was handled and found to not be properly
   *         formatted
   */
  tryParse(envelope: Entity): Promise<Entity | undefined>;
};

export class ParserError extends Error {
  constructor(message?: string, private _entityName?: string | undefined) {
    super(message);
  }
  get entityName() {
    return this._entityName;
  }
}

export type ReaderOutput =
  | { type: 'error'; error: Error }
  | { type: 'data'; data: object };

export type LocationReader = {
  /**
   * Reads the contents of a single location.
   *
   * @param type The type of location to read
   * @param target The location target (type-specific)
   * @returns The parsed contents, as an array of unverified descriptors or
   *          errors where the individual documents could not be parsed.
   * @throws An error if the location as a whole could not be read
   */
  read(type: string, target: string): Promise<ReaderOutput[]>;
};

export type LocationSource = {
  /**
   * Reads the contents of a single location.
   *
   * @param target The location target to read
   * @returns The parsed contents, as an array of unverified descriptors
   * @throws An error if the location target could not be read
   */
  read(target: string): Promise<ReaderOutput[]>;
};
