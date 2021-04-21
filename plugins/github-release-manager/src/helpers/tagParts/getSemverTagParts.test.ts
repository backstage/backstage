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
  mockReleaseCandidateSemver,
  mockReleaseVersionSemver,
} from '../../test-helpers/test-helpers';
import { getSemverTagParts } from './getSemverTagParts';

describe('getSemverTagParts', () => {
  it('should return tagParts for RC tag', () =>
    expect(getSemverTagParts(mockReleaseCandidateSemver.tagName))
      .toMatchInlineSnapshot(`
        Object {
          "major": 1,
          "minor": 2,
          "patch": 3,
          "prefix": "rc",
        }
      `));

  it('should return tagParts for Version tag', () =>
    expect(getSemverTagParts(mockReleaseVersionSemver.tagName))
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
      getSemverTagParts('invalid-1.2.3'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid semver tag"`);
  });

  it('should throw for invalid semver (missing patch)', () => {
    expect(() =>
      getSemverTagParts('rc-1.2'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid semver tag"`);
  });

  it('should throw for invalid semver (founds calver)', () => {
    expect(() =>
      getSemverTagParts('rc-1337.01.01_1'),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid semver tag, found calver"`);
  });
});
