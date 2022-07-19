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

import { hasAnnotation } from './hasAnnotation';

describe('hasAnnotation permission rule', () => {
  describe('apply', () => {
    it('returns false when specified annotation is not present', () => {
      expect(
        hasAnnotation.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
              },
            },
          },
          'backstage.io/test-annotation',
        ),
      ).toEqual(false);
    });

    it('returns false when no annotations are present', () => {
      expect(
        hasAnnotation.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
            },
          },
          'backstage.io/test-annotation',
        ),
      ).toEqual(false);
    });

    it('returns true when specified annotation is present', () => {
      expect(
        hasAnnotation.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'test-component',
              annotations: {
                'other-annotation': 'foo',
                'backstage.io/test-annotation': 'bar',
              },
            },
          },
          'backstage.io/test-annotation',
        ),
      ).toEqual(true);
    });
  });

  describe('toQuery', () => {
    it('returns an appropriate catalog-backend filter', () => {
      expect(hasAnnotation.toQuery('backstage.io/test-annotation')).toEqual({
        key: 'metadata.annotations.backstage.io/test-annotation',
      });
    });
  });
});
