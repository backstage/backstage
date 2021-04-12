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
import { format } from 'date-fns';

import { GhGetReleaseResponse } from '../../types/types';
import {
  mockSemverProject,
  mockCalverProject,
} from '../../test-helpers/test-helpers';
import { getRcGheInfo } from './getRcGheInfo';

const injectedDate = format(1611869955783, 'yyyy.MM.dd');

describe('getRCGheInfo', () => {
  describe('calver', () => {
    const latestRelease = {
      tag_name: 'rc-2020.01.01_0',
    } as GhGetReleaseResponse;

    it('should return correct Ghe info', () => {
      expect(
        getRcGheInfo({
          project: mockCalverProject,
          latestRelease,
          semverBumpLevel: 'minor',
          injectedDate,
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "rcBranch": "rc/2021.01.28",
          "rcReleaseTag": "rc-2021.01.28_0",
          "releaseName": "Version 2021.01.28",
        }
      `);
    });
  });

  describe('semver', () => {
    const latestRelease = {
      tag_name: 'rc-1.1.1',
    } as GhGetReleaseResponse;

    it("should return correct Ghe info when there's previous releases", () => {
      expect(
        getRcGheInfo({
          project: mockSemverProject,
          latestRelease,
          semverBumpLevel: 'minor',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "rcBranch": "rc/1.2.0",
          "rcReleaseTag": "rc-1.2.0",
          "releaseName": "Version 1.2.0",
        }
      `);
    });

    it("should return correct Ghe info when there's no previous release", () => {
      expect(
        getRcGheInfo({
          project: mockSemverProject,
          latestRelease: null,
          semverBumpLevel: 'minor',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "rcBranch": "rc/0.0.1",
          "rcReleaseTag": "rc-0.0.1",
          "releaseName": "Version 0.0.1",
        }
      `);
    });
  });
});
