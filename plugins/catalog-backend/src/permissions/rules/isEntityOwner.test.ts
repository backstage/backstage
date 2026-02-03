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
import { isEntityOwner } from './isEntityOwner';

describe('isEntityOwner', () => {
  describe('apply', () => {
    it('returns true when entity is owned by the given user', () => {
      const component: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'some-component',
        },
        relations: [
          {
            type: 'ownedBy',
            targetRef: 'user:default/spiderman',
          },
        ],
      };
      expect(
        isEntityOwner.apply(component, {
          claims: ['user:default/spiderman'],
        }),
      ).toBe(true);
    });

    it('returns false when entity is not owned by the given user', () => {
      const component: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'some-component',
        },
        relations: [
          {
            type: 'ownedBy',
            targetRef: 'user:default/green-goblin',
          },
        ],
      };
      expect(
        isEntityOwner.apply(component, {
          claims: ['user:default/spiderman'],
        }),
      ).toBe(false);
    });

    it('returns false when entity does not have an owner', () => {
      const component: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'some-component',
        },
      };
      expect(
        isEntityOwner.apply(component, {
          claims: ['user:default/spiderman'],
        }),
      ).toBe(false);
    });
  });

  describe('toQuery', () => {
    it('returns an appropriate catalog-backend filter', () => {
      expect(
        isEntityOwner.toQuery({
          claims: ['user:default/spiderman'],
        }),
      ).toEqual({
        key: 'relations.ownedBy',
        values: ['user:default/spiderman'],
      });
    });
  });
});
