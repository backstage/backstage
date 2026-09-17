/*
 * Copyright 2021 The Backstage Authors
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

// Temporarily re-export the JSON types from @backstage/types
import type {
  JsonArray as CoreJsonArray,
  JsonObject as CoreJsonObject,
  JsonPrimitive as CoreJsonPrimitive,
  JsonValue as CoreJsonValue,
} from '@backstage/types';

/**
 * A type representing all allowed JSON primitive values.
 *
 * @public
 * @deprecated Please use the same type from `@backstage/types` instead
 */
export type JsonPrimitive = CoreJsonPrimitive;

/**
 * A type representing all allowed JSON object values.
 *
 * @public
 * @deprecated Please use the same type from `@backstage/types` instead
 */
export type JsonObject = CoreJsonObject;

/**
 * A type representing all allowed JSON array values.
 *
 * @public
 * @deprecated Please use the same type from `@backstage/types` instead
 */
export type JsonArray = CoreJsonArray;

/**
 * A type representing all allowed JSON values.
 *
 * @public
 * @deprecated Please use the same type from `@backstage/types` instead
 */
export type JsonValue = CoreJsonValue;
