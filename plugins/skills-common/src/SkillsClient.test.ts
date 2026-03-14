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

import { SkillsClient } from './SkillsClient';

describe('SkillsClient', () => {
  const mockFetch = jest.fn();
  const discoveryApi = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007/api/skills'),
  };
  const fetchApi = { fetch: mockFetch };

  let client: SkillsClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new SkillsClient({ discoveryApi, fetchApi });
  });

  describe('listSkills', () => {
    it('lists skills without parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ skills: [], totalCount: 0 }),
      });

      const result = await client.listSkills();
      expect(result).toEqual({ skills: [], totalCount: 0 });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/api/skills/skills',
      );
    });

    it('adds an authorization header when a token is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ skills: [], totalCount: 0 }),
      });

      await client.listSkills(undefined, { token: 'test-token' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/api/skills/skills',
        expect.objectContaining({
          headers: expect.any(Headers),
        }),
      );
      expect(mockFetch.mock.calls[0][1].headers.get('Authorization')).toBe(
        'Bearer test-token',
      );
    });

    it('passes search and pagination parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ skills: [], totalCount: 0 }),
      });

      await client.listSkills({
        search: 'test',
        source: 'plugin:my-plugin',
        offset: 10,
        limit: 5,
        orderBy: 'name',
        order: 'asc',
      });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('search=test');
      expect(url).toContain('source=plugin%3Amy-plugin');
      expect(url).toContain('offset=10');
      expect(url).toContain('limit=5');
      expect(url).toContain('orderBy=name');
      expect(url).toContain('order=asc');
    });
  });

  describe('getSkill', () => {
    it('fetches a skill by name', async () => {
      const skill = { name: 'test-skill', description: 'A test skill' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(skill),
      });

      const result = await client.getSkill('test-skill');
      expect(result).toEqual(skill);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/api/skills/skills/test-skill',
      );
    });

    it('passes request options to getSkill', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ name: 'test-skill', description: 'A test skill' }),
      });

      await client.getSkill('test-skill', { token: 'test-token' });

      expect(mockFetch.mock.calls[0][1].headers.get('Authorization')).toBe(
        'Bearer test-token',
      );
    });
  });

  describe('getSkillFiles', () => {
    it('fetches files for a skill', async () => {
      const files = [{ path: 'SKILL.md', content: '# Test' }];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(files),
      });

      const result = await client.getSkillFiles('test-skill');
      expect(result).toEqual(files);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/api/skills/skills/test-skill/files',
      );
    });

    it('passes request options to getSkillFiles', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{ path: 'SKILL.md', content: '# Test' }]),
      });

      await client.getSkillFiles('test-skill', { token: 'test-token' });

      expect(mockFetch.mock.calls[0][1].headers.get('Authorization')).toBe(
        'Bearer test-token',
      );
    });
  });

  describe('registerSkills', () => {
    it('registers skills in batch', async () => {
      const skills = [
        {
          name: 'test-skill',
          description: 'A test skill',
          source: 'plugin:my-plugin',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
        },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ skills }),
      });

      const result = await client.registerSkills({
        skills: [
          {
            files: [
              {
                path: 'SKILL.md',
                content:
                  '---\nname: test-skill\ndescription: A test skill\n---\nBody',
              },
            ],
          },
        ],
      });
      expect(result).toEqual(skills);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7007/api/skills/skills',
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('passes request options to registerSkills', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ skills: [] }),
      });

      await client.registerSkills({ skills: [] }, { token: 'test-token' });

      expect(mockFetch.mock.calls[0][1].headers.get('Authorization')).toBe(
        'Bearer test-token',
      );
    });
  });
});
