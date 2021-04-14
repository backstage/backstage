/*
 * Copyright 2021 Spotify AB
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
  mockCalverProject,
  mockSemverProject,
} from '../../test-helpers/test-helpers';
import { getTagParts } from './getTagParts';

describe('getTagParts', () => {
  describe('calver', () => {
    it('should return tagParts for RC tag', () =>
      expect(
        getTagParts({ project: mockCalverProject, tag: 'rc-2020.01.01_1' }),
      ).toMatchInlineSnapshot(`
        Object {
          "calver": "2020.01.01",
          "patch": 1,
          "prefix": "rc",
        }
      `));

    it('should return tagParts for Version tag', () =>
      expect(
        getTagParts({
          project: mockCalverProject,
          tag: 'version-2020.01.01_1',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "calver": "2020.01.01",
          "patch": 1,
          "prefix": "version",
        }
      `));

    it('should return null for invalid prefix', () => {
      expect(() =>
        getTagParts({
          project: mockCalverProject,
          tag: 'invalid-2020.01.01_1',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
    });

    it('should return null for invalid calver (missing padded zero)', () => {
      expect(() =>
        getTagParts({ project: mockCalverProject, tag: 'rc-2020.1.01_1' }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
    });

    it('should return null for invalid calver (missing day)', () => {
      expect(() =>
        getTagParts({ project: mockCalverProject, tag: 'rc-2020.01_1' }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
    });

    it('should return null for invalid patch (letter instead of number)', () => {
      expect(() =>
        getTagParts({ project: mockCalverProject, tag: 'rc-2020.01.01_a' }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
    });
  });

  describe('semver', () => {
    it('should return tagParts for RC tag', () =>
      expect(getTagParts({ project: mockSemverProject, tag: 'rc-1.2.3' }))
        .toMatchInlineSnapshot(`
        Object {
          "major": 1,
          "minor": 2,
          "patch": 3,
          "prefix": "rc",
        }
      `));

    it('should return tagParts for Version tag', () =>
      expect(getTagParts({ project: mockSemverProject, tag: 'version-1.2.3' }))
        .toMatchInlineSnapshot(`
        Object {
          "major": 1,
          "minor": 2,
          "patch": 3,
          "prefix": "version",
        }
      `));

    it('should throw for invalid prefix', () => {
      expect(() =>
        getTagParts({ project: mockSemverProject, tag: 'invalid-1.2.3' }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid semver tag"`);
    });

    it('should throw for invalid semver (missing patch)', () => {
      expect(() =>
        getTagParts({ project: mockSemverProject, tag: 'rc-1.2' }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid semver tag"`);
    });
  });
});
