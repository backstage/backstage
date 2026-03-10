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

import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { DatabaseService } from '@backstage/backend-plugin-api';
import { DatabaseSkillsStore } from '../database';

const databases = TestDatabases.create();

async function createDatabase(
  databaseId: TestDatabaseId,
): Promise<DatabaseService> {
  const knex = await databases.init(databaseId);
  return mockServices.database({ knex, migrations: { skip: false } });
}

const validSkillMd = [
  '---',
  'name: test-skill',
  'description: A test skill for testing purposes.',
  '---',
  '',
  '# Test Skill',
  '',
  'Instructions here.',
].join('\n');

const validSkillMdWithAllFields = [
  '---',
  'name: full-skill',
  'description: A fully specified skill.',
  'license: Apache-2.0',
  'compatibility: Requires node.js',
  'allowed-tools: Bash(git:*) Read',
  'metadata:',
  '  author: backstage',
  '  version: "1.0"',
  '---',
  '',
  '# Full Skill',
].join('\n');

const externalSkillMd = [
  '---',
  'name: external-skill',
  'description: A skill registered by an external service.',
  '---',
  '',
  '# External Skill',
].join('\n');

describe.each(databases.eachSupportedId())('router (%s)', databaseId => {
  let app: express.Express;
  let database: DatabaseService;

  beforeAll(async () => {
    database = await createDatabase(databaseId);
    const store = await DatabaseSkillsStore.create({
      database,
    });

    const router = await createRouter({
      logger: mockServices.logger.mock(),
      httpAuth: mockServices.httpAuth({
        defaultCredentials: mockCredentials.service('plugin:test-service'),
      }),
      store,
    });

    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  describe('PUT /skills', () => {
    it('registers a skill with a SKILL.md file', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [{ files: [{ path: 'SKILL.md', content: validSkillMd }] }],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills).toHaveLength(1);
      expect(response.body.skills[0]).toMatchObject({
        name: 'test-skill',
        description: 'A test skill for testing purposes.',
        source: 'plugin:test-service',
      });
      expect(response.body.skills[0].createdAt).toBeDefined();
      expect(response.body.skills[0].updatedAt).toBeDefined();
    });

    it('registers a skill with all frontmatter fields', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [{ path: 'SKILL.md', content: validSkillMdWithAllFields }],
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills).toHaveLength(1);
      expect(response.body.skills[0]).toMatchObject({
        name: 'full-skill',
        description: 'A fully specified skill.',
        license: 'Apache-2.0',
        compatibility: 'Requires node.js',
        allowedTools: 'Bash(git:*) Read',
        metadata: { author: 'backstage', version: '1.0' },
        source: 'plugin:test-service',
      });
    });

    it('registers multiple skills in a single request', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            { files: [{ path: 'SKILL.md', content: validSkillMd }] },
            {
              files: [{ path: 'SKILL.md', content: validSkillMdWithAllFields }],
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills).toHaveLength(2);
      const names = response.body.skills.map((s: { name: string }) => s.name);
      expect(names).toContain('test-skill');
      expect(names).toContain('full-skill');
    });

    it('replaces all previous skills for the plugin', async () => {
      // Register initial skills
      await request(app)
        .put('/skills')
        .send({
          skills: [
            { files: [{ path: 'SKILL.md', content: validSkillMd }] },
            {
              files: [{ path: 'SKILL.md', content: validSkillMdWithAllFields }],
            },
          ],
        });

      // Register replacement — only one skill
      const replacementMd = [
        '---',
        'name: replacement-skill',
        'description: This replaces everything.',
        '---',
        'Body',
      ].join('\n');

      const response = await request(app)
        .put('/skills')
        .send({
          skills: [{ files: [{ path: 'SKILL.md', content: replacementMd }] }],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills).toHaveLength(1);
      expect(response.body.skills[0].name).toBe('replacement-skill');

      // Verify old skills are gone for this source
      const listResponse = await request(app)
        .get('/skills')
        .query({ source: 'plugin:test-service' });
      expect(listResponse.body.skills).toHaveLength(1);
      expect(listResponse.body.skills[0].name).toBe('replacement-skill');
    });

    it('registers a skill with additional files including subpaths', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                { path: 'scripts/run.py', content: 'print("hello")' },
                { path: 'prompts/test-prompt.md', content: '# Test prompt' },
              ],
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills).toHaveLength(1);
    });

    it('stores the caller subject as the source', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [{ files: [{ path: 'SKILL.md', content: validSkillMd }] }],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills[0].source).toBe('plugin:test-service');
    });

    it('rejects request without skills', async () => {
      const response = await request(app).put('/skills').send({});
      expect(response.status).toBe(400);
    });

    it('rejects skill without files', async () => {
      const response = await request(app)
        .put('/skills')
        .send({ skills: [{}] });
      expect(response.status).toBe(400);
    });

    it('rejects skill without SKILL.md', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [{ files: [{ path: 'README.md', content: '# Readme' }] }],
        });
      expect(response.status).toBe(400);
    });

    it('rejects invalid skill name', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                {
                  path: 'SKILL.md',
                  content:
                    '---\nname: INVALID\ndescription: Bad skill.\n---\nBody',
                },
              ],
            },
          ],
        });
      expect(response.status).toBe(400);
    });

    it('rejects path traversal in file paths', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                { path: '../etc/passwd', content: 'bad' },
              ],
            },
          ],
        });
      expect(response.status).toBe(400);
    });

    it('rejects absolute file paths', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                { path: '/etc/passwd', content: 'bad' },
              ],
            },
          ],
        });
      expect(response.status).toBe(400);
    });

    it('allows external service credentials', async () => {
      const externalApp = express();
      const store = await DatabaseSkillsStore.create({ database });
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        httpAuth: mockServices.httpAuth({
          defaultCredentials: mockCredentials.service('external:test-service'),
        }),
        store,
      });

      externalApp.use(router);
      externalApp.use(mockErrorHandler());

      const response = await request(externalApp)
        .put('/skills')
        .send({
          skills: [{ files: [{ path: 'SKILL.md', content: externalSkillMd }] }],
        });

      expect(response.status).toBe(200);
      expect(response.body.skills[0].name).toBe('external-skill');
      expect(response.body.skills[0].source).toBe('external:test-service');
    });

    it('allows dots inside normal file names', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                { path: 'docs/v1.2/guide.md', content: '# Guide' },
              ],
            },
          ],
        });

      expect(response.status).toBe(200);
    });

    it('normalizes backslashes in file paths', async () => {
      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                {
                  path: String.raw`scripts\run.py`,
                  content: 'print("hello")',
                },
              ],
            },
          ],
        });

      expect(response.status).toBe(200);

      const filesResponse = await request(app).get('/skills/test-skill/files');
      expect(filesResponse.status).toBe(200);
      expect(
        filesResponse.body.some(
          (file: { path: string }) => file.path === 'scripts/run.py',
        ),
      ).toBe(true);

      const downloadResponse = await request(app).get(
        '/.well-known/skills/test-skill/scripts/run.py',
      );
      expect(downloadResponse.status).toBe(200);
      expect(downloadResponse.text).toBe('print("hello")');
    });

    it('rejects file paths longer than the database limit', async () => {
      const longPath = `${'a'.repeat(513)}.md`;

      const response = await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                { path: longPath, content: '# Too long' },
              ],
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain(
        'file paths must be 512 characters or fewer',
      );
    });
  });

  describe('GET /skills', () => {
    it('lists skills', async () => {
      const response = await request(app).get('/skills');
      expect(response.status).toBe(200);
      expect(response.body.skills).toBeDefined();
      expect(response.body.totalCount).toBeGreaterThan(0);
    });

    it('supports search parameter', async () => {
      const response = await request(app)
        .get('/skills')
        .query({ search: 'test-skill' });
      expect(response.status).toBe(200);
      expect(
        response.body.skills.some(
          (s: { name: string }) => s.name === 'test-skill',
        ),
      ).toBe(true);
    });

    it('supports pagination', async () => {
      const response = await request(app)
        .get('/skills')
        .query({ offset: 0, limit: 1 });
      expect(response.status).toBe(200);
      expect(response.body.skills.length).toBeLessThanOrEqual(1);
    });

    it('falls back to default pagination for non-numeric values', async () => {
      const response = await request(app)
        .get('/skills')
        .query({ offset: 'abc', limit: 'def' });

      expect(response.status).toBe(200);
      expect(response.body.skills).toBeDefined();
      expect(response.body.totalCount).toBeGreaterThan(0);
    });

    it('supports source filter', async () => {
      const response = await request(app)
        .get('/skills')
        .query({ source: 'plugin:test-service' });
      expect(response.status).toBe(200);
      for (const skill of response.body.skills) {
        expect(skill.source).toBe('plugin:test-service');
      }
    });
  });

  describe('GET /skills/:name', () => {
    it('gets a skill by name', async () => {
      const response = await request(app).get('/skills/test-skill');
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-skill');
    });

    it('returns 404 for unknown skill', async () => {
      const response = await request(app).get('/skills/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /skills/:name/files', () => {
    it('gets files for a skill', async () => {
      // Ensure skill exists
      await request(app)
        .put('/skills')
        .send({
          skills: [{ files: [{ path: 'SKILL.md', content: validSkillMd }] }],
        });

      const response = await request(app).get('/skills/test-skill/files');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(
        response.body.some((f: { path: string }) => f.path === 'SKILL.md'),
      ).toBe(true);
    });

    it('returns 404 for unknown skill', async () => {
      const response = await request(app).get('/skills/nonexistent/files');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /.well-known/skills/index.json', () => {
    it('returns well-known index', async () => {
      const response = await request(app).get('/.well-known/skills/index.json');
      expect(response.status).toBe(200);
      expect(response.body.skills).toBeDefined();
      expect(Array.isArray(response.body.skills)).toBe(true);

      for (const entry of response.body.skills) {
        expect(entry.name).toBeDefined();
        expect(entry.description).toBeDefined();
        expect(entry.files).toBeDefined();
        expect(entry.files).toContain('SKILL.md');
      }
    });
  });

  describe('GET /.well-known/skills/:name/:path(*)', () => {
    it('serves a skill file', async () => {
      const response = await request(app).get(
        '/.well-known/skills/test-skill/SKILL.md',
      );
      expect(response.status).toBe(200);
      expect(response.text).toContain('name: test-skill');
    });

    it('serves a subpath file', async () => {
      // Ensure the skill with subpath files exists
      await request(app)
        .put('/skills')
        .send({
          skills: [
            {
              files: [
                { path: 'SKILL.md', content: validSkillMd },
                { path: 'scripts/run.py', content: 'print("hello")' },
              ],
            },
          ],
        });

      const response = await request(app).get(
        '/.well-known/skills/test-skill/scripts/run.py',
      );
      expect(response.status).toBe(200);
      expect(response.text).toBe('print("hello")');
    });

    it('returns 404 for unknown file', async () => {
      const response = await request(app).get(
        '/.well-known/skills/test-skill/nonexistent.md',
      );
      expect(response.status).toBe(404);
    });
  });
});
