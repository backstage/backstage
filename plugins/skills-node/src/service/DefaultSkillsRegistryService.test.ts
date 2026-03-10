/*
 * Copyright 2026 The Backstage Authors
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

import { DefaultSkillsRegistryService } from './DefaultSkillsRegistryService';
import type { AuthService } from '@backstage/backend-plugin-api';

jest.mock('node:fs/promises', () => ({
  readFile: jest.fn(),
}));

import { readFile } from 'node:fs/promises';

const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

describe('DefaultSkillsRegistryService', () => {
  const mockFetch = jest.fn();
  const originalFetch = globalThis.fetch;

  const discovery = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007/api/skills'),
    getExternalBaseUrl: jest.fn(),
  };

  const auth = {
    getOwnServiceCredentials: jest
      .fn()
      .mockResolvedValue({ principal: { subject: 'plugin:test' } }),
    getPluginRequestToken: jest.fn().mockResolvedValue({ token: 'mock-token' }),
    authenticate: jest.fn(),
    getNoneCredentials: jest.fn(),
    getLimitedUserToken: jest.fn(),
    isPrincipal: jest.fn() as unknown as AuthService['isPrincipal'],
    listPublicServiceKeys: jest.fn(),
  };

  const urlReader = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    child: jest.fn(),
  };

  let service: DefaultSkillsRegistryService;

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = mockFetch;
    service = DefaultSkillsRegistryService.create({
      auth,
      discovery,
      logger,
      urlReader,
    });
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it('registers skills from local file paths', async () => {
    const skills = [
      {
        name: 'test-skill',
        description: 'A test skill',
        source: 'plugin:test',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills }),
    });
    mockReadFile.mockResolvedValue(
      '---\nname: test-skill\ndescription: A test skill\n---\nBody',
    );

    const result = await service.registerSkills([
      { skill: '/path/to/SKILL.md' },
    ]);

    expect(result).toEqual(skills);
    expect(mockReadFile).toHaveBeenCalledWith('/path/to/SKILL.md', 'utf-8');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7007/api/skills/skills',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('registers skills from URLs using the URL reader', async () => {
    const skills = [
      {
        name: 'url-skill',
        description: 'A URL skill',
        source: 'plugin:test',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills }),
    });
    urlReader.readUrl.mockResolvedValue({
      buffer: () =>
        Promise.resolve(
          Buffer.from(
            '---\nname: url-skill\ndescription: A URL skill\n---\nBody',
          ),
        ),
    });

    const result = await service.registerSkills([
      { skill: 'https://github.com/org/repo/blob/main/SKILL.md' },
    ]);

    expect(result).toEqual(skills);
    expect(urlReader.readUrl).toHaveBeenCalledWith(
      'https://github.com/org/repo/blob/main/SKILL.md',
    );
  });

  it('preserves additional file subpaths relative to the skill root', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    mockReadFile
      .mockResolvedValueOnce(
        '---\nname: multi-file\ndescription: Has extra files\n---\nBody',
      )
      .mockResolvedValueOnce('print("helper")');

    await service.registerSkills([
      {
        skill: '/path/to/skills/SKILL.md',
        additionalFiles: ['/path/to/skills/scripts/helper.py'],
      },
    ]);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.skills).toHaveLength(1);
    expect(body.skills[0].files).toHaveLength(2);
    expect(body.skills[0].files[0].path).toBe('SKILL.md');
    expect(body.skills[0].files[1].path).toBe('scripts/helper.py');
    expect(body.skills[0].files[1].content).toBe('print("helper")');
  });

  it('preserves URL additional file subpaths relative to the skill root', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    urlReader.readUrl
      .mockResolvedValueOnce({
        buffer: () =>
          Promise.resolve(
            Buffer.from(
              '---\nname: remote-skill\ndescription: Remote\n---\nBody',
            ),
          ),
      })
      .mockResolvedValueOnce({
        buffer: () => Promise.resolve(Buffer.from('echo remote')),
      });

    await service.registerSkills([
      {
        skill: 'https://github.com/org/repo/blob/main/skills/remote/SKILL.md',
        additionalFiles: [
          'https://github.com/org/repo/blob/main/skills/remote/scripts/run.sh',
        ],
      },
    ]);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.skills[0].files[1].path).toBe('scripts/run.sh');
  });

  it('skips additional files outside the skill directory and logs a warning', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    mockReadFile
      .mockResolvedValueOnce(
        '---\nname: multi-file\ndescription: Has extra files\n---\nBody',
      )
      .mockResolvedValueOnce('print("helper")');

    await service.registerSkills([
      {
        skill: '/path/to/skills/SKILL.md',
        additionalFiles: ['/path/to/other/helper.py'],
      },
    ]);

    expect(logger.warn).toHaveBeenCalledWith(
      "Skipping additional file '/path/to/other/helper.py' for skill '/path/to/skills/SKILL.md' because it could not be processed: Additional file '/path/to/other/helper.py' must be located under the skill directory",
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.skills[0].files).toEqual([
      {
        path: 'SKILL.md',
        content:
          '---\nname: multi-file\ndescription: Has extra files\n---\nBody',
      },
    ]);
  });

  it('skips a missing skill and logs a warning', async () => {
    const error = Object.assign(
      new Error('ENOENT: no such file or directory'),
      {
        code: 'ENOENT',
      },
    );
    mockReadFile.mockRejectedValue(error);

    const result = await service.registerSkills([
      { skill: '/missing/SKILL.md' },
    ]);

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      "Skipping skill '/missing/SKILL.md' because it could not be processed: ENOENT: no such file or directory",
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('skips a skill on any read error and logs the original error', async () => {
    mockReadFile.mockRejectedValue(new Error('permission denied'));

    const result = await service.registerSkills([
      { skill: '/broken/SKILL.md' },
    ]);

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      "Skipping skill '/broken/SKILL.md' because it could not be processed: permission denied",
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('skips a missing additional file and logs a warning', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    mockReadFile
      .mockResolvedValueOnce(
        '---\nname: multi-file\ndescription: Has extra files\n---\nBody',
      )
      .mockRejectedValueOnce(
        Object.assign(new Error('ENOENT: no such file or directory'), {
          code: 'ENOENT',
        }),
      );

    await service.registerSkills([
      {
        skill: '/path/to/skills/SKILL.md',
        additionalFiles: ['/path/to/skills/scripts/missing.py'],
      },
    ]);

    expect(logger.warn).toHaveBeenCalledWith(
      "Skipping additional file '/path/to/skills/scripts/missing.py' for skill '/path/to/skills/SKILL.md' because it could not be processed: ENOENT: no such file or directory",
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.skills).toHaveLength(1);
    expect(body.skills[0].files).toEqual([
      {
        path: 'SKILL.md',
        content:
          '---\nname: multi-file\ndescription: Has extra files\n---\nBody',
      },
    ]);
  });

  it('skips a missing URL-based skill and logs a warning', async () => {
    urlReader.readUrl.mockRejectedValue({
      name: 'NotFoundError',
      statusCode: 404,
    });

    const result = await service.registerSkills([
      { skill: 'https://github.com/org/repo/blob/main/SKILL.md' },
    ]);

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      'Skipping skill \'https://github.com/org/repo/blob/main/SKILL.md\' because it could not be processed: {"name":"NotFoundError","statusCode":404}',
    );
  });

  it('registers multiple skills in one batch', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    mockReadFile
      .mockResolvedValueOnce(
        '---\nname: skill-a\ndescription: First\n---\nBody A',
      )
      .mockResolvedValueOnce(
        '---\nname: skill-b\ndescription: Second\n---\nBody B',
      );

    await service.registerSkills([
      { skill: '/path/to/a/SKILL.md' },
      { skill: '/path/to/b/SKILL.md' },
    ]);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.skills).toHaveLength(2);
  });

  it('throws when the backend responds with an error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });
    mockReadFile.mockResolvedValue(
      '---\nname: bad\ndescription: Bad\n---\nBody',
    );

    await expect(
      service.registerSkills([{ skill: '/path/to/SKILL.md' }]),
    ).rejects.toThrow();
  });

  it('adds authorization header from auth service', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    mockReadFile.mockResolvedValue(
      '---\nname: auth-test\ndescription: Auth test\n---\nBody',
    );

    await service.registerSkills([{ skill: '/path/to/SKILL.md' }]);

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.get('Authorization')).toBe('Bearer mock-token');
  });

  it('requests a plugin token once per registration batch', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ skills: [] }),
    });
    mockReadFile
      .mockResolvedValueOnce(
        '---\nname: skill-a\ndescription: First\n---\nBody A',
      )
      .mockResolvedValueOnce(
        '---\nname: skill-b\ndescription: Second\n---\nBody B',
      );

    await service.registerSkills([
      { skill: '/path/to/a/SKILL.md' },
      { skill: '/path/to/b/SKILL.md' },
    ]);

    expect(auth.getOwnServiceCredentials).toHaveBeenCalledTimes(1);
    expect(auth.getPluginRequestToken).toHaveBeenCalledTimes(1);
  });
});
