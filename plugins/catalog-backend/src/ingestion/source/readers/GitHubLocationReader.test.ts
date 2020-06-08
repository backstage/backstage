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

jest.mock('node-fetch');

import fetch from 'node-fetch';
import { GitHubLocationReader } from './GitHubLocationReader';

const { Response } = jest.requireActual('node-fetch');

describe('Unit: GitHubLocationReader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the file and parses it correctly', async () => {
    (fetch as any).mockResolvedValueOnce(new Response('hello'));

    const reader = new GitHubLocationReader();
    const buffer = await reader.tryRead(
      'github',
      'https://github.com/spotify/backstage/blob/master/plugins/catalog-backend/fixtures/one_component.yaml',
    );

    expect(buffer?.toString('utf8')).toBe('hello');
  });

  it('changes the url to point to https://raw.githubusercontent.com', async () => {
    const gitHubUrl = `https://github.com`;
    const project = `spotify/backstage`;
    const folderPath = `master/plugins/catalog-backend/fixtures`;
    const componentFilename = `one_component.yaml`;
    const rawGitHubUrl = `https://raw.githubusercontent.com`;

    const reader = new GitHubLocationReader();
    (fetch as any).mockResolvedValueOnce(new Response('hello'));

    await reader.tryRead(
      'github',
      `${gitHubUrl}/${project}/blob/${folderPath}/${componentFilename}`,
    );

    expect(fetch).toHaveBeenCalledWith(
      `${rawGitHubUrl}/${project}/${folderPath}/${componentFilename}`,
    );
  });

  describe('rejects wrong urls', () => {
    const reader = new GitHubLocationReader();

    it.each([
      ['http://example.com/one_component.yaml'],
      ['http://github.com/one_component.yaml'],
      ['http://github.com/PROJECT/one_component.yaml'],
      ['http://github.com/PROJECT/REPO/one_component.yaml'],
      ['http://github.com/PROJECT/REPO/one_component.json'],
    ])(
      '%p',
      async (url: string) =>
        await expect(reader.tryRead('github', url)).rejects.toThrow(/url/),
    );
  });
});

describe('Integration: GitHubLocationSource', () => {
  beforeAll(() => {
    (fetch as any).mockImplementation(jest.requireActual('node-fetch'));
  });

  it('fetches the fixture from backstage repo', async () => {
    (fetch as any).mockResolvedValueOnce(new Response('component3'));

    const PERMANENT_LINK =
      'https://github.com/spotify/backstage/blob/ee84a874f8e37f87940cbe515a86c07a2db29541/plugins/catalog-backend/fixtures/one_component.yaml';

    const reader = new GitHubLocationReader();
    const result = await reader.tryRead('github', PERMANENT_LINK);

    expect(result?.toString('utf8')).toContain('component3');
  });
});
