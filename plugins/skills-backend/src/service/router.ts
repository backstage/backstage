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
import Router from 'express-promise-router';
import path from 'node:path';
import { SkillsStore } from '../database';
import { InputError, NotFoundError } from '@backstage/errors';
import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import {
  parseSkillFrontmatter,
  SkillFile,
  Skill,
} from '@backstage/plugin-skills-common';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  httpAuth: HttpAuthService;
  store: SkillsStore;
}

interface WellKnownRouterOptions {
  store: SkillsStore;
}

interface ApiRouterOptions extends RouterOptions {}

function parseBoundedInteger(
  value: unknown,
  defaultValue: number,
  bounds: { min: number; max?: number },
): number {
  if (typeof value !== 'string') {
    return defaultValue;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isFinite(parsedValue)) {
    return defaultValue;
  }

  const clampedValue = Math.max(bounds.min, parsedValue);
  return bounds.max === undefined
    ? clampedValue
    : Math.min(bounds.max, clampedValue);
}

function toSkillResponse(row: {
  name: string;
  description: string;
  license: string | null;
  compatibility: string | null;
  metadata: string | null;
  allowed_tools: string | null;
  source: string;
  created_at: Date;
  updated_at: Date;
}): Skill {
  return {
    name: row.name,
    description: row.description,
    license: row.license ?? undefined,
    compatibility: row.compatibility ?? undefined,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    allowedTools: row.allowed_tools ?? undefined,
    source: row.source,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function normalizeSkillFilePath(filePath: string, index: number): string {
  const normalizedInput = filePath.replaceAll('\\', '/');

  if (normalizedInput.length > 512) {
    throw new InputError(
      `Skill at index ${index}: file paths must be 512 characters or fewer`,
    );
  }

  if (
    path.posix.isAbsolute(normalizedInput) ||
    /^[a-zA-Z]:\//.test(normalizedInput)
  ) {
    throw new InputError(
      `Skill at index ${index}: file paths must be relative`,
    );
  }

  const normalizedPath = path.posix.normalize(normalizedInput);
  if (
    normalizedPath === '..' ||
    normalizedPath.startsWith('../') ||
    normalizedPath.includes('/../')
  ) {
    throw new InputError(
      `Skill at index ${index}: file paths must not contain path traversal`,
    );
  }

  return normalizedPath;
}

/** @internal */
export async function createWellKnownRouter(
  options: WellKnownRouterOptions,
): Promise<express.Router> {
  const { store } = options;
  const router = Router();

  // GET /index.json
  router.get('/index.json', async (_req, res) => {
    const skills = await store.getAllSkillsForIndex();
    res.json({ skills });
  });

  // GET /:name/:path(*)
  router.get('/:name/:path(*)', async (req, res) => {
    const { name } = req.params;
    const filePath = req.params.path || req.params[0];

    const file = await store.getSkillFile(name, filePath);
    if (!file) {
      throw new NotFoundError(
        `File '${filePath}' not found for skill '${name}'`,
      );
    }

    res.type('text/plain; charset=utf-8').send(file.content);
  });

  return router;
}

/** @internal */
export async function createApiRouter(
  options: ApiRouterOptions,
): Promise<express.Router> {
  const { logger, store, httpAuth } = options;
  const router = Router();
  router.use(express.json({ limit: '1mb' }));

  // ── API endpoints (authenticated) ────────────────────────────────────

  // GET /skills - List skills
  router.get('/skills', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user', 'service'] });

    const { search, source, offset, limit, orderBy, order } = req.query;

    const validOrderBy = ['name', 'createdAt', 'updatedAt'];
    const orderByValue =
      typeof orderBy === 'string' && validOrderBy.includes(orderBy)
        ? orderBy
        : 'name';

    const validOrder = ['asc', 'desc'];
    const orderValue =
      typeof order === 'string' && validOrder.includes(order) ? order : 'asc';

    // Map camelCase to snake_case for database columns
    let dbOrderBy: 'name' | 'created_at' | 'updated_at' = 'name';
    if (orderByValue === 'createdAt') {
      dbOrderBy = 'created_at';
    } else if (orderByValue === 'updatedAt') {
      dbOrderBy = 'updated_at';
    }

    const offsetValue = parseBoundedInteger(offset, 0, { min: 0 });
    const limitValue = parseBoundedInteger(limit, 20, { min: 1, max: 100 });

    const result = await store.listSkills({
      search: typeof search === 'string' ? search : undefined,
      source: typeof source === 'string' ? source : undefined,
      offset: offsetValue,
      limit: limitValue,
      orderBy: dbOrderBy,
      order: orderValue as 'asc' | 'desc',
    });

    res.json({
      skills: result.skills.map(toSkillResponse),
      totalCount: result.totalCount,
    });
  });

  // GET /skills/:name - Get a skill by name
  router.get('/skills/:name', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user', 'service'] });

    const skill = await store.getSkill(req.params.name);
    if (!skill) {
      throw new NotFoundError(`Skill '${req.params.name}' not found`);
    }
    res.json(toSkillResponse(skill));
  });

  // GET /skills/:name/files - Get all files for a skill
  router.get('/skills/:name/files', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user', 'service'] });

    const skill = await store.getSkill(req.params.name);
    if (!skill) {
      throw new NotFoundError(`Skill '${req.params.name}' not found`);
    }

    const files = await store.getSkillFiles(req.params.name);
    res.json(
      files.map(f => ({
        path: f.path,
        content: f.content,
      })),
    );
  });

  // PUT /skills - Register skills for the calling plugin (batch replace)
  router.put('/skills', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['service'],
    });

    const principal = credentials.principal as { subject: string };
    const source = principal.subject;

    const { skills } = req.body as {
      skills?: Array<{ files?: SkillFile[] }>;
    };

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      throw new InputError('At least one skill is required');
    }

    const entries = skills.map((skillInput, index) => {
      const { files } = skillInput;
      if (!files || !Array.isArray(files) || files.length === 0) {
        throw new InputError(
          `Skill at index ${index}: at least one file is required`,
        );
      }

      const normalizedFiles = files.map(file => {
        if (!file.path || typeof file.path !== 'string') {
          throw new InputError(
            `Skill at index ${index}: each file must have a path`,
          );
        }
        if (typeof file.content !== 'string') {
          throw new InputError(
            `Skill at index ${index}: each file must have string content`,
          );
        }

        return {
          path: normalizeSkillFilePath(file.path, index),
          content: file.content,
        };
      });

      const skillMd = normalizedFiles.find(
        file => file.path.toLowerCase() === 'skill.md',
      );
      if (!skillMd) {
        throw new InputError(
          `Skill at index ${index}: SKILL.md file is required`,
        );
      }

      const frontmatter = parseSkillFrontmatter(skillMd.content);

      return {
        skill: {
          name: frontmatter.name,
          description: frontmatter.description,
          license: frontmatter.license ?? null,
          compatibility: frontmatter.compatibility ?? null,
          metadata: frontmatter.metadata
            ? JSON.stringify(frontmatter.metadata)
            : null,
          allowed_tools: frontmatter.allowedTools ?? null,
          source,
        },
        files: files.map(f => ({
          skill_name: frontmatter.name,
          path: normalizeSkillFilePath(f.path, index),
          content: f.content,
        })),
      };
    });

    const result = await store.replaceSkillsForSource(source, entries);

    logger.info(`Registered ${result.length} skill(s) for source '${source}'`);
    res.json({ skills: result.map(toSkillResponse) });
  });

  return router;
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();

  router.use('/.well-known/skills', await createWellKnownRouter(options));
  router.use(await createApiRouter(options));

  return router;
}
