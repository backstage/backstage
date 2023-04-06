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
import { isEntityKind } from './isEntityKind';

describe('isEntityKind', () => {
  describe('apply', () => {
    it('returns true when entity is the correct kind', () => {
      const component: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'some-component',
        },
      };
      expect(
        isEntityKind.apply(component, {
          kinds: ['b'],
        }),
      ).toBe(true);
    });

    it('returns false when entity is not the correct kind', () => {
      const component: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'some-component',
        },
      };
      expect(
        isEntityKind.apply(component, {
          kinds: ['c'],
        }),
      ).toBe(false);
    });
  });

  describe('toQuery', () => {
    it('returns an appropriate catalog-backend filter', () => {
      expect(
        isEntityKind.toQuery({
          kinds: ['b'],
        }),
      ).toEqual({
        key: 'kind',
        values: ['b'],
      });
    });
  });
});
