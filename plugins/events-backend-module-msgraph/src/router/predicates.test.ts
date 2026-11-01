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

import { and, changeTypeIs, or, resourceTypeIs } from './predicates';
import type { Change } from './types';

describe('predicates', () => {
  const baseChange: Change = {
    changeType: 'created',
    resourceType: 'users',
    resourceId: 'u1',
  };

  describe('changeTypeIs', () => {
    it('returns true for exact match', () => {
      expect(changeTypeIs('created')(baseChange)).toBe(true);
    });
    it('is case-insensitive', () => {
      expect(changeTypeIs('CREATED')(baseChange)).toBe(true);
      expect(changeTypeIs('Created')(baseChange)).toBe(true);
    });
    it('returns false for non-matching type', () => {
      expect(changeTypeIs('deleted')(baseChange)).toBe(false);
    });
  });

  describe('resourceTypeIs', () => {
    it('returns true for exact match', () => {
      expect(resourceTypeIs('users')(baseChange)).toBe(true);
    });
    it('is case-insensitive', () => {
      expect(resourceTypeIs('USERS')(baseChange)).toBe(true);
      expect(resourceTypeIs('Users')(baseChange)).toBe(true);
    });
    it('returns false for non-matching type', () => {
      expect(resourceTypeIs('groups')(baseChange)).toBe(false);
    });
  });

  describe('and', () => {
    it('returns true if all predicates are true', () => {
      const pred = and(changeTypeIs('created'), resourceTypeIs('users'));
      expect(pred(baseChange)).toBe(true);
    });
    it('returns false if any predicate is false', () => {
      const pred = and(changeTypeIs('created'), resourceTypeIs('groups'));
      expect(pred(baseChange)).toBe(false);
    });
    it('returns true for no predicates (vacuous truth)', () => {
      const pred = and();
      expect(pred(baseChange)).toBe(true);
    });
  });

  describe('or', () => {
    it('returns true if any predicate is true', () => {
      const pred = or(changeTypeIs('created'), resourceTypeIs('groups'));
      expect(pred(baseChange)).toBe(true);
    });
    it('returns false if all predicates are false', () => {
      const pred = or(changeTypeIs('deleted'), resourceTypeIs('groups'));
      expect(pred(baseChange)).toBe(false);
    });
    it('returns false for no predicates', () => {
      const pred = or();
      expect(pred(baseChange)).toBe(false);
    });
  });
});
