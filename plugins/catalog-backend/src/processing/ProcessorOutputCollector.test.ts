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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import { mockServices } from '@backstage/backend-test-utils';
import { processingResult } from '@backstage/plugin-catalog-node';
import { ProcessorOutputCollector } from './ProcessorOutputCollector';

describe('ProcessorOutputCollector', () => {
  it('sets location annotations from where an entity was read, ignoring values in the entity itself', () => {
    const parentEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: 'parent',
        annotations: {
          [ANNOTATION_LOCATION]: 'url:https://example.com/catalog-info.yaml',
          [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com/origin.yaml',
        },
      },
      spec: { type: 'url', target: 'https://example.com/catalog-info.yaml' },
    };
    const collector = new ProcessorOutputCollector(
      mockServices.logger.mock(),
      parentEntity,
    );

    collector.generic()(
      processingResult.entity(
        { type: 'url', target: 'https://example.com/components.yaml' },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'child',
            annotations: {
              [ANNOTATION_LOCATION]: 'url:https://elsewhere.example.net/a.yaml',
              [ANNOTATION_ORIGIN_LOCATION]:
                'url:https://elsewhere.example.net/b.yaml',
              'example.com/other': 'kept',
            },
          },
          spec: { type: 'service', owner: 'me', lifecycle: 'production' },
        },
      ),
    );

    const { deferredEntities, errors } = collector.results();
    expect(errors).toEqual([]);
    expect(deferredEntities).toHaveLength(1);
    expect(deferredEntities[0].entity.metadata.annotations).toEqual({
      [ANNOTATION_LOCATION]: 'url:https://example.com/components.yaml',
      [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com/origin.yaml',
      'example.com/other': 'kept',
    });
  });
});
