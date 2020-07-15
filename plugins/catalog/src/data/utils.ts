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

import {
  EntityMeta,
  LocationSpec,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

export function findLocationForEntityMeta(
  meta: EntityMeta,
): LocationSpec | undefined {
  if (!meta) {
    return undefined;
  }

  const annotation = meta.annotations?.[LOCATION_ANNOTATION];
  if (!annotation) {
    return undefined;
  }

  const separatorIndex = annotation.indexOf(':');
  if (separatorIndex === -1) {
    return undefined;
  }

  return {
    type: annotation.substring(0, separatorIndex),
    target: annotation.substring(separatorIndex + 1),
  };
}
