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
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import type { SkillsStore } from '../database';
import { createApiRouter, createWellKnownRouter } from './router';

function createStore(): SkillsStore {
  return {
    getSkill: jest.fn().mockResolvedValue({
      name: 'test-skill',
      description: 'A test skill',
      license: null,
      compatibility: null,
      metadata: null,
      allowed_tools: null,
      source: 'plugin:test-service',
      created_at: new Date('2025-01-01T00:00:00.000Z'),
      updated_at: new Date('2025-01-02T00:00:00.000Z'),
    }),
    getSkillFiles: jest
      .fn()
      .mockResolvedValue([
        { skill_name: 'test-skill', path: 'SKILL.md', content: '# Test Skill' },
      ]),
    getSkillFile: jest.fn().mockResolvedValue({
      skill_name: 'test-skill',
      path: 'SKILL.md',
      content: '# Test Skill',
    }),
    listSkills: jest.fn().mockResolvedValue({
      skills: [
        {
          name: 'test-skill',
          description: 'A test skill',
          license: null,
          compatibility: null,
          metadata: null,
          allowed_tools: null,
          source: 'plugin:test-service',
          created_at: new Date('2025-01-01T00:00:00.000Z'),
          updated_at: new Date('2025-01-02T00:00:00.000Z'),
        },
      ],
      totalCount: 1,
    }),
    replaceSkillsForSource: jest.fn(),
    getAllSkillsForIndex: jest.fn().mockResolvedValue([
      {
        name: 'test-skill',
        description: 'A test skill',
        files: ['SKILL.md'],
      },
    ]),
  };
}

describe('skills router mounting', () => {
  it('serves well-known skill routes from the root path', async () => {
    const app = express();
    const store = createStore();

    app.use('/.well-known/skills', await createWellKnownRouter({ store }));
    app.use(
      await createApiRouter({
        logger: mockServices.logger.mock(),
        httpAuth: mockServices.httpAuth({
          defaultCredentials: mockCredentials.service('plugin:test-service'),
        }),
        store,
      }),
    );
    app.use(mockErrorHandler());

    const indexResponse = await request(app).get(
      '/.well-known/skills/index.json',
    );
    expect(indexResponse.status).toBe(200);
    expect(indexResponse.body.skills).toEqual([
      {
        name: 'test-skill',
        description: 'A test skill',
        files: ['SKILL.md'],
      },
    ]);

    const fileResponse = await request(app).get(
      '/.well-known/skills/test-skill/SKILL.md',
    );
    expect(fileResponse.status).toBe(200);
    expect(fileResponse.text).toBe('# Test Skill');

    const apiResponse = await request(app).get('/skills');
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.body.totalCount).toBe(1);
  });
});
