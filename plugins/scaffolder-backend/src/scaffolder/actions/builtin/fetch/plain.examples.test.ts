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

import yaml from 'yaml';

import os from 'os';
import { resolve as resolvePath } from 'path';
import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchPlainAction } from './plain';
import { PassThrough } from 'stream';
import { fetchContents } from '@backstage/plugin-scaffolder-node';
import { examples } from './plain.examples';

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: jest.fn(),
}));

describe('fetch:plain examples', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );
  const reader: UrlReader = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const action = createFetchPlainAction({ integrations, reader });
  const mockContext = {
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
      }),
    );
  });

  it('should fetch plain to a specified directory', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath, 'fetched-data'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
      }),
    );
  });
});
