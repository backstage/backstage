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

import { Entity, LocationSpec } from '@backstage/catalog-model';
import { AnnotateLocationEntityProcessor } from './AnnotateLocationEntityProcessor';

describe('AnnotateLocationEntityProcessor', () => {
  describe('preProcessEntity', () => {
    it('adds annotations', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
        },
      };

      const location: LocationSpec = {
        type: 'url',
        target: 'my-location',
      };
      const originLocation: LocationSpec = {
        type: 'url',
        target: 'my-origin-location',
      };

      const processor = new AnnotateLocationEntityProcessor();

      expect(
        await processor.preProcessEntity(
          entity,
          location,
          () => {},
          originLocation,
        ),
      ).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'backstage.io/managed-by-location': 'url:my-location',
            'backstage.io/managed-by-origin-location': 'url:my-origin-location',
          },
        },
      });
    });
  });
});
