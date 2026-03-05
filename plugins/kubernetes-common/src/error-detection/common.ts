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

import { DetectedError, ErrorMapper } from './types';

// Run through the each error mapper for each object
// returning a deduplicated (mostly) result
export const detectErrorsInObjects = <T>(
  objects: T[],
  errorMappers: ErrorMapper<T>[],
): DetectedError[] => {
  return objects.flatMap(o => {
    return errorMappers.flatMap(em => em.detectErrors(o));
  });
};
