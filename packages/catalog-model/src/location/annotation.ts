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

/**
 * Entity annotation containing the location from which the entity is sourced.
 *
 * @public
 */
export const ANNOTATION_LOCATION = 'backstage.io/managed-by-location';

/**
 * Entity annotation containing the originally sourced location which ultimately
 * led to this entity being ingested.
 *
 * @public
 */
export const ANNOTATION_ORIGIN_LOCATION =
  'backstage.io/managed-by-origin-location';

/**
 * Entity annotation pointing to the source (e.g. source code repository root or
 * similar) for this entity.
 *
 * @public
 */
export const ANNOTATION_SOURCE_LOCATION = 'backstage.io/source-location';
