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

import {
  ANNOTATION_EDIT_URL,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  ANNOTATION_SOURCE_LOCATION,
  ANNOTATION_VIEW_URL,
  Entity,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { identity, merge, pickBy } from 'lodash';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';

/** @public */
export class AnnotateLocationEntityProcessor implements CatalogProcessor {
  constructor(
    private readonly options: {
      integrations: ScmIntegrationRegistry;
    },
  ) {}

  getProcessorName(): string {
    return 'AnnotateLocationEntityProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
    _: CatalogProcessorEmit,
    originLocation: LocationSpec,
  ): Promise<Entity> {
    const { integrations } = this.options;
    let viewUrl;
    let editUrl;
    let sourceLocation;

    if (location.type === 'url') {
      const scmIntegration = integrations.byUrl(location.target);

      viewUrl = location.target;
      editUrl = scmIntegration?.resolveEditUrl(location.target);

      const sourceUrl = scmIntegration?.resolveUrl({
        url: './',
        base: location.target,
      });

      if (sourceUrl) {
        sourceLocation = stringifyLocationRef({
          type: 'url',
          target: sourceUrl,
        });
      }
    }

    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [ANNOTATION_LOCATION]: stringifyLocationRef(location),
              [ANNOTATION_ORIGIN_LOCATION]:
                stringifyLocationRef(originLocation),
              [ANNOTATION_VIEW_URL]: viewUrl,
              [ANNOTATION_EDIT_URL]: editUrl,
              [ANNOTATION_SOURCE_LOCATION]: sourceLocation,
            },
            identity,
          ),
        },
      },
      entity,
    );
  }
}
