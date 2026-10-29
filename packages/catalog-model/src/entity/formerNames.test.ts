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

import { getEntityFormerRefs } from './formerNames';
import { ANNOTATION_FORMER_NAMES } from './constants';
import { Entity } from './Entity';

function makeEntity(value?: string, namespace?: string): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'current',
      ...(namespace ? { namespace } : {}),
      ...(value !== undefined
        ? { annotations: { [ANNOTATION_FORMER_NAMES]: value } }
        : {}),
    },
  };
}

describe('formerNames', () => {
  describe('getEntityFormerRefs', () => {
    it('returns normalized full refs', () => {
      expect(
        getEntityFormerRefs(
          makeEntity('Component:Other/Old-Name, api:default/old-api'),
        ),
      ).toEqual(['component:other/old-name', 'api:default/old-api']);
      expect(getEntityFormerRefs(makeEntity('API:Team/Legacy'))).toEqual([
        'api:team/legacy',
      ]);
    });

    it('defaults kind and namespace for short refs', () => {
      expect(
        getEntityFormerRefs(makeEntity('old-name, legacy/older', 'team-a')),
      ).toEqual(['component:team-a/old-name', 'component:legacy/older']);
      expect(getEntityFormerRefs(makeEntity('old-name'))).toEqual([
        'component:default/old-name',
      ]);
    });

    it('ignores whitespace, empty and malformed entries', () => {
      expect(
        getEntityFormerRefs(
          makeEntity(' , old-name ,, :bad, a:b/c/d, x/y:z, na me '),
        ),
      ).toEqual(['component:default/old-name']);
    });

    it('removes duplicates and the entity own ref', () => {
      expect(
        getEntityFormerRefs(
          makeEntity(
            'old-name, component:default/OLD-NAME, current, component:default/current',
          ),
        ),
      ).toEqual(['component:default/old-name']);
    });

    it('returns an empty list without a usable annotation', () => {
      expect(getEntityFormerRefs(makeEntity())).toEqual([]);
      expect(getEntityFormerRefs(makeEntity(''))).toEqual([]);
      expect(getEntityFormerRefs(makeEntity(' , ,,'))).toEqual([]);
    });
  });
});
