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
import { GithubPreparer } from './github';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { getVoidLogger, Git } from '@backstage/backend-common';

jest.mock('fs-extra');

describe('GitHubPreparer', () => {
  let mockEntity: TemplateEntityV1alpha1;
  const mockGitClient = {
    clone: jest.fn(),
  };
  const logger = getVoidLogger();

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const preparer = GithubPreparer.fromConfig({
    host: 'github.com',
    token: 'fake-token',
  });

  it('calls the clone command with the correct arguments for a repository', async () => {
    await preparer.prepare({
      url:
        'https://github.com/benjdlambert/backstage-graphql-template/blob/master/templates/graphql-starter/template',
      logger,
      workspacePath: '/tmp',
    });

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://github.com/benjdlambert/backstage-graphql-template',
      dir: expect.any(String),
    });
    expect(fs.move).toHaveBeenCalledWith(
      '/tmp/checkout/templates/graphql-starter/template',
      '/tmp/template',
    );
    expect(fs.rmdir).toHaveBeenCalledWith('/tmp/template/.git');
  });

  it('calls the clone command with the correct arguments for a repository when no path is provided', async () => {
    await preparer.prepare({
      url:
        'https://github.com/benjdlambert/backstage-graphql-template/blob/master',
      logger,
      workspacePath: '/tmp',
    });

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://github.com/benjdlambert/backstage-graphql-template',
      dir: expect.any(String),
    });
    expect(fs.move).toHaveBeenCalledWith('/tmp/checkout', '/tmp/template');
    expect(fs.rmdir).toHaveBeenCalledWith('/tmp/template/.git');
  });

  it('calls the clone command with token', async () => {
    await preparer.prepare({
      url:
        'https://github.com/benjdlambert/backstage-graphql-template/blob/master',
      logger,
      workspacePath: '/tmp',
    });

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      username: 'fake-token',
      password: 'x-oauth-basic',
    });
  });
});
