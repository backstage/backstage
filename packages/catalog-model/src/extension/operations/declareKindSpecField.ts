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

import { JsonObject } from '@backstage/types';

/**
 * Mark a field as a source of relations. The field is expected to be a string
 * or string array.
 */
export interface OpDeclareKindSpecFieldV1 {
  op: 'declareKindSpecField.v1';

  /**
   * The kind that this field belongs to.
   */
  kind: string;
  /**
   * The API version that this declaration applies to.
   */
  apiVersion: string;
  /**
   * The spec.type that this applies to.
   *
   * @remarks
   *
   * This can be used to make kinds whose spec effectively are discriminated
   * unions. If you don't specify this, the field will apply to a spec that has
   * no type given at all, or to those where the type is not among the set of
   * any other known declared spec types.
   */
  specType?: string;
  /**
   * The path to the field.
   *
   * @remarks
   *
   * Each element in the path is a key of an object. Example: `["spec", "owner"]`.
   */
  path: readonly string[];

  /**
   * The properties that apply to this field-
   */
  properties: {
    /**
     * Short description of the kind.
     */
    description: string;
    /**
     * The schema of the field.
     */
    schema: {
      jsonSchema: JsonObject;
    };
  };
}
