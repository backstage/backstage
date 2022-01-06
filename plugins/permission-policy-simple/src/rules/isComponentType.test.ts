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

import { Entity } from '@backstage/catalog-model';
import { isComponentType } from './isComponentType';

const testEntity = ({
  kind,
  type,
}: {
  kind: string;
  type: string;
}): Entity => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind,
  metadata: {
    name: 'test',
  },
  spec: {
    type,
  },
});

describe('isComponentType', () => {
  describe('apply', () => {
    it('returns true for component entities with matching type', () => {
      expect(
        isComponentType.apply(testEntity({ kind: 'Component', type: 'foo' }), [
          'foo',
          'bar',
        ]),
      ).toEqual(true);
    });

    it('matches kind case-insensitively', () => {
      expect(
        isComponentType.apply(testEntity({ kind: 'cOmPoNeNt', type: 'foo' }), [
          'foo',
          'bar',
        ]),
      ).toEqual(true);
    });

    it('matches type case-insensitively', () => {
      expect(
        isComponentType.apply(testEntity({ kind: 'Component', type: 'BaR' }), [
          'foo',
          'BaR',
        ]),
      ).toEqual(true);
    });

    it('returns false for non-component entities', () => {
      expect(
        isComponentType.apply(testEntity({ kind: 'User', type: 'foo' }), [
          'foo',
          'bar',
        ]),
      ).toEqual(false);
    });

    it('returns false for component entities with mismatched type', () => {
      expect(
        isComponentType.apply(testEntity({ kind: 'Component', type: 'quux' }), [
          'foo',
          'bar',
        ]),
      ).toEqual(false);
    });
  });
});
