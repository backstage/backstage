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

import path from 'path';
import { getRepoSourceDirectory, isExecutable, parseRepoUrl } from './util';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

describe('getRepoSourceDirectory', () => {
  it('should return workspace root if no sub folder is given', () => {
    expect(
      getRepoSourceDirectory(path.join('/', 'var', 'workspace'), undefined),
    ).toEqual(path.join('/', 'var', 'workspace'));
  });

  it('should return path in workspace if sub folder is given', () => {
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        path.join('path', 'of', 'subfolder'),
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'path', 'of', 'subfolder'));
  });

  it('should not allow traversal outside the workspace root', () => {
    // We have to construct the path manually here, as path.join would mitigate the path traversal
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        `..${path.sep}secret`,
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'secret'));
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        `.${path.sep}path${path.sep}..${path.sep}..${path.sep}secret`,
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'secret'));
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        path.join('/', 'absolute', 'secret'),
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'absolute', 'secret'));
  });
});

describe('isExecutable', () => {
  it('should return true for file mode 777', () => {
    expect(isExecutable(0o100777)).toBe(true);
  });
  it('should return true for file mode 775', () => {
    expect(isExecutable(0o100775)).toBe(true);
  });
  it('should return true for file mode 755', () => {
    expect(isExecutable(0o100755)).toBe(true);
  });
  it('should return true for file mode 700', () => {
    expect(isExecutable(0o100700)).toBe(true);
  });
  it('should return true for file mode 770', () => {
    expect(isExecutable(0o100770)).toBe(true);
  });
  it('should return true for file mode 670', () => {
    expect(isExecutable(0o100670)).toBe(true);
  });
  it('should return false for file mode 644', () => {
    expect(isExecutable(0o100644)).toBe(false);
  });
  it('should return false for file mode 600', () => {
    expect(isExecutable(0o100600)).toBe(false);
  });
  it('should return false for file mode 640', () => {
    expect(isExecutable(0o100640)).toBe(false);
  });
});

describe('parseRepoUrl', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'www.gitlab.com',
          token: 'token',
          apiBaseUrl: 'https://api.gitlab.com',
        },
      ],
      bitbucket: [
        {
          host: 'www.bitbucket.net',
          apiBaseUrl: 'https://api.hosted.bitbucket.net',
        },
        {
          host: 'www.bitbucket.org',
          username: 'username',
          appPassword: 'password',
          apiBaseUrl: 'https://api.hosted.bitbucket.org',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  it('should throw an exception if no parameters are passed (gitlab)', () => {
    expect(() => parseRepoUrl('www.gitlab.com', integrations)).toThrow(
      'Invalid repo URL passed to publisher: https://www.gitlab.com/, missing owner',
    );
  });
  it('should return the project ID in the `project` parameter (gitlab)', () => {
    expect(
      parseRepoUrl('www.gitlab.com?project=234', integrations),
    ).toStrictEqual({
      host: 'www.gitlab.com',
      organization: undefined,
      owner: undefined,
      project: '234',
      repo: null,
      workspace: undefined,
    });
  });
  it('should throw an exception if the repo parameter is missing, but owner parameter is set', () => {
    expect(() =>
      parseRepoUrl('www.gitlab.com?owner=owner', integrations),
    ).toThrow(
      'Invalid repo URL passed to publisher: https://www.gitlab.com/?owner=owner, missing repo',
    );
  });
  it('should throw an exception if the owner parameter is missing, but repo parameter is set (gitlab)', () => {
    expect(() =>
      parseRepoUrl('www.gitlab.com?repo=repo', integrations),
    ).toThrow(
      'Invalid repo URL passed to publisher: https://www.gitlab.com/?repo=repo, missing owner',
    );
  });
  it('should return the workspace, project and repo (bitbucket.org)', () => {
    expect(
      parseRepoUrl(
        'www.bitbucket.org?project=project&workspace=workspace&repo=repo',
        integrations,
      ),
    ).toStrictEqual({
      host: 'www.bitbucket.org',
      organization: undefined,
      owner: undefined,
      project: 'project',
      repo: 'repo',
      workspace: 'workspace',
    });
  });
  it('should return the project and repo (another bitbucket instance)', () => {
    expect(
      parseRepoUrl('www.bitbucket.net?project=project&repo=repo', integrations),
    ).toStrictEqual({
      host: 'www.bitbucket.net',
      organization: undefined,
      owner: undefined,
      project: 'project',
      repo: 'repo',
      workspace: undefined,
    });
  });
  it('should throw an exception if the workspace parameter is missing for bitbucket.org instance (bitbucket.org)', () => {
    expect(() =>
      parseRepoUrl('www.bitbucket.org?project=project&repo=repo', integrations),
    ).toThrow(
      'Invalid repo URL passed to publisher: https://www.bitbucket.org/?project=project&repo=repo, missing workspace',
    );
  });
});
