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

import fs from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';
import { GitHubLocationSource } from '../GitHubLocationSource';

const { Response } = jest.requireActual('node-fetch');

const FIXTURES_DIR = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'fixtures',
);
const fixtures = fs.readdirSync(FIXTURES_DIR).reduce((acc, filename) => {
  acc[filename] = fs.readFileSync(path.resolve(FIXTURES_DIR, filename), 'utf8');
  return acc;
}, {} as Record<string, string>);

describe('Unit: GitHubLocationSource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the file and parses it correctly', async () => {
    (fetch as any).mockReturnValueOnce(
      Promise.resolve(new Response(fixtures['one_component.yaml'])),
    );
    const reader = new GitHubLocationSource();

    const result = await reader.read(
      'https://github.com/spotify/backstage/blob/master/plugins/catalog-backend/fixtures/one_component.yaml',
    );

    expect(result[0].type).toBe('data');
    expect((result[0] as any).data.metadata.name).toBe('component3');
  });

  it('changes the url to point to https://raw.githubusercontent.com', async () => {
    const gitHubUrl = `https://github.com`;
    const project = `spotify/backstage`;
    const folderPath = `master/plugins/catalog-backend/fixtures`;
    const componentFilename = `one_component.yaml`;
    const rawGitHubUrl = `https://raw.githubusercontent.com`;
    const reader = new GitHubLocationSource();
    (fetch as any).mockReturnValueOnce(
      Promise.resolve(new Response(fixtures[componentFilename])),
    );

    await reader.read(
      `${gitHubUrl}/${project}/blob/${folderPath}/${componentFilename}`,
    );

    expect(fetch).toHaveBeenCalledWith(
      `${rawGitHubUrl}/${project}/${folderPath}/${componentFilename}`,
    );
  });

  describe('rejects wrong urls', () => {
    const reader = new GitHubLocationSource();

    it.each([
      ['http://example.com/one_component.yaml'],
      ['http://github.com/one_component.yaml'],
      ['http://github.com/PROJECT/one_component.yaml'],
      ['http://github.com/PROJECT/REPO/one_component.yaml'],
      ['http://github.com/PROJECT/REPO/one_component.json'],
    ])(
      '%p',
      async (url: string) =>
        await expect(reader.read(url)).rejects.toThrow(/url/),
    );
  });
});

describe('Integration: GitHubLocationSource', () => {
  beforeAll(() => {
    (fetch as any).mockImplementation(jest.requireActual('node-fetch'));
  });

  it('fetches the fixture from backstage repo', async () => {
    const PERMANENT_LINK =
      'https://github.com/spotify/backstage/blob/ee84a874f8e37f87940cbe515a86c07a2db29541/plugins/catalog-backend/fixtures/one_component.yaml';
    const reader = new GitHubLocationSource();

    const result = await reader.read(PERMANENT_LINK);

    expect(result[0].type).toBe('data');
    expect((result[0] as any).data.metadata.name).toBe('component3');
  });
});
