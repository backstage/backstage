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
  mockReleaseVersionCalver,
  mockReleaseCandidateCalver,
} from '../../test-helpers/test-helpers';
import { getCalverTagParts } from './getCalverTagParts';

describe('getCalverTagParts', () => {
  it('should return tagParts for RC tag', () => {
    const result = getCalverTagParts(mockReleaseCandidateCalver.tagName);

    expect(result).toMatchInlineSnapshot(`
        Object {
          "calver": "2020.01.01",
          "patch": 1,
          "prefix": "rc",
        }
      `);
  });

  it('should return tagParts for Version tag', () => {
    const result = getCalverTagParts(mockReleaseVersionCalver.tagName);

    expect(result).toMatchInlineSnapshot(`
        Object {
          "calver": "2020.01.01",
          "patch": 1,
          "prefix": "version",
        }
      `);
  });

  it('should return null for invalid prefix', () => {
    expect(() =>
      getCalverTagParts('invalid-2020.01.01_1'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
  });

  it('should return null for invalid calver (missing padded zero)', () => {
    expect(() =>
      getCalverTagParts('rc-2020.1.01_1'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
  });

  it('should return null for invalid calver (missing day)', () => {
    expect(() =>
      getCalverTagParts('rc-2020.01_1'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
  });

  it('should return null for invalid patch (letter instead of number)', () => {
    expect(() =>
      getCalverTagParts('rc-2020.01.01_a'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid calver tag"`);
  });
});
