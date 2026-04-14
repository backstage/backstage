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

import { createCatalogModelLayer } from '../model/createCatalogModelLayer';
import { ANNOTATION_EDIT_URL, ANNOTATION_VIEW_URL } from '../entity';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  ANNOTATION_SOURCE_LOCATION,
} from '../location';

export const wellKnownAnnotationsModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/well-known-annotations',
  builder: model => {
    model.addAnnotation({
      name: ANNOTATION_LOCATION,
      description:
        'The location reference that the catalog uses to manage and update the entity.',
    });
    model.addAnnotation({
      name: ANNOTATION_ORIGIN_LOCATION,
      description:
        'The original location reference that first discovered the entity.',
    });
    model.addAnnotation({
      name: ANNOTATION_SOURCE_LOCATION,
      description:
        'The location reference of the source data for the entity, e.g. a file in a repository.',
    });
    model.addAnnotation({
      name: 'backstage.io/orphan',
      description:
        'Set to "true" when the entity is not referenced by any location and is scheduled for deletion.',
    });
    model.addAnnotation({
      name: ANNOTATION_VIEW_URL,
      description:
        'A URL to view the entity in an external tool, e.g. a source code repository.',
    });
    model.addAnnotation({
      name: ANNOTATION_EDIT_URL,
      description:
        'A URL to edit the entity in an external tool, e.g. a source code repository.',
    });
  },
});
