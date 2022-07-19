/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { readGithubMultiOrgConfig } from './config';

describe('config', () => {
  describe('readGithubMultiOrgConfig', () => {
    function config(
      orgs: { name: string; groupNamespace?: string; userNamespace?: string }[],
    ) {
      return new ConfigReader({ orgs });
    }

    it('reads org configs', () => {
      const output = readGithubMultiOrgConfig(
        config([
          { name: 'foo', groupNamespace: 'apple', userNamespace: 'red' },
          { name: 'bar', groupNamespace: 'Orange', userNamespace: 'blue' },
        ]),
      );

      expect(output).toEqual([
        { name: 'foo', groupNamespace: 'apple', userNamespace: 'red' },
        { name: 'bar', groupNamespace: 'orange', userNamespace: 'blue' },
      ]);
    });

    it('defaults groupNamespace to org name if undefined', () => {
      const output = readGithubMultiOrgConfig(
        config([
          { name: 'foo', userNamespace: 'red' },
          { name: 'bar', userNamespace: 'blue' },
        ]),
      );

      expect(output).toEqual([
        { name: 'foo', groupNamespace: 'foo', userNamespace: 'red' },
        { name: 'bar', groupNamespace: 'bar', userNamespace: 'blue' },
      ]);
    });

    it('defaults userNamespace to undefined if unspecified', () => {
      const output = readGithubMultiOrgConfig(
        config([{ name: 'foo' }, { name: 'bar' }]),
      );

      expect(output).toEqual([
        { name: 'foo', groupNamespace: 'foo', userNamespace: undefined },
        { name: 'bar', groupNamespace: 'bar', userNamespace: undefined },
      ]);
    });
  });
});
