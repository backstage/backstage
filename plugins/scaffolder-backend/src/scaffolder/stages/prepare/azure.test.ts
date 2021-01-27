/*
 * Copyright 2020 Spotify AB
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

import fs from 'fs-extra';
import os from 'os';
import { resolve } from 'path';
import { AzurePreparer } from './azure';
import { getVoidLogger, Git } from '@backstage/backend-common';

jest.mock('fs-extra');

describe('AzurePreparer', () => {
  const mockGitClient = {
    clone: jest.fn(),
  };

  const logger = getVoidLogger();

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  const preparer = AzurePreparer.fromConfig({
    host: 'dev.azure.com',
    token: 'fake-azure-token',
  });

  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const checkoutPath = resolve(workspacePath, 'checkout');
  const templatePath = resolve(workspacePath, 'template');
  const prepareOptions = {
    url:
      'https://dev.azure.com/backstage-org/backstage-project/_git/template-repo',
    workspacePath,
    logger,
  };

  it('calls the clone command with token from integrations config', async () => {
    await preparer.prepare(prepareOptions);
    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      password: 'fake-azure-token',
      username: 'notempty',
    });
    expect(fs.move).toHaveBeenCalledWith(checkoutPath, templatePath);
    expect(fs.rmdir).toHaveBeenCalledWith(resolve(templatePath, '.git'));
  });

  it('calls the clone command with the correct arguments for a repository', async () => {
    await preparer.prepare(prepareOptions);

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url:
        'https://dev.azure.com/backstage-org/backstage-project/_git/template-repo',
      dir: checkoutPath,
    });
  });

  it('calls the clone command with the correct arguments for a repository when no path is provided', async () => {
    await preparer.prepare({
      url:
        'https://dev.azure.com/backstage-org/backstage-project/_git/template-repo',
      workspacePath,
      logger,
    });

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url:
        'https://dev.azure.com/backstage-org/backstage-project/_git/template-repo',
      dir: checkoutPath,
    });
    expect(fs.move).toHaveBeenCalledWith(checkoutPath, templatePath);
  });

  it('moves the template from path if it is specified', async () => {
    const path = './subdir';
    await preparer.prepare({
      url: `https://dev.azure.com/backstage-org/backstage-project/_git/template-repo?path=${encodeURIComponent(
        path,
      )}`,
      logger,
      workspacePath,
    });

    expect(fs.move).toHaveBeenCalledWith(
      resolve(checkoutPath, 'subdir'),
      templatePath,
    );
  });
});
