/*
 * Copyright 2022 The Backstage Authors
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
import { getVoidLogger } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';

import { GitLabOrgReaderProcessor } from './GitLabOrgReaderProcessor';

function mockConfig() {
  return new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.example.com',
          token: 'test-token',
          apiBaseUrl: 'https://gitlab.example.com/api/v4',
        },
        {
          host: 'gitlab.com',
          token: 'test-token',
        },
      ],
    },
  });
}

describe('GitLabOrgReaderProcessor', () => {
  describe('getProcessorName', () => {
    it('should provide its processor name', () => {
      const processor = GitLabOrgReaderProcessor.fromConfig(mockConfig(), {
        logger: getVoidLogger(),
      });

      expect(processor.getProcessorName()).toEqual('gitlab-org');
    });
  });

  describe('unrelated entries', () => {
    it('should skip unhandled types', async () => {
      const processor = GitLabOrgReaderProcessor.fromConfig(mockConfig(), {
        logger: getVoidLogger(),
      });
      const instanceLocation: LocationSpec = {
        type: 'unhandled-type-by-processor',
        target: 'https://gitlab.example.com',
      };
      await expect(
        processor.readLocation(instanceLocation, false, () => {}),
      ).resolves.toEqual(false);

      const gitlabLocation: LocationSpec = {
        type: 'unhandled-type-by-processor',
        target: 'https://gitlab.com',
      };
      await expect(
        processor.readLocation(gitlabLocation, false, () => {}),
      ).resolves.toEqual(false);
    });

    it('should throw if target is unknown', async () => {
      const processor = GitLabOrgReaderProcessor.fromConfig(mockConfig(), {
        logger: getVoidLogger(),
      });
      const location: LocationSpec = {
        type: 'gitlab-org',
        target: 'https://example.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow();
    });
  });
});
