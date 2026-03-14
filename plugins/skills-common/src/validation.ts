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

import { InputError } from '@backstage/errors';

const NAME_REGEX = /^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$/;
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;
const MAP_ENTRY_REGEX = /^\s+([^:]+):\s*"?(.+?)"?\s*$/;
const TOP_LEVEL_ENTRY_REGEX = /^([a-z][a-z0-9-]*?):\s*(.*)$/;

/**
 * Validates a skill name per the Agent Skills specification.
 *
 * @public
 */
export function validateSkillName(name: string): void {
  if (!name || name.length === 0) {
    throw new InputError('Skill name is required');
  }
  if (name.length > 64) {
    throw new InputError('Skill name must be at most 64 characters');
  }
  if (name.startsWith('-') || name.endsWith('-')) {
    throw new InputError('Skill name must not start or end with a hyphen');
  }
  if (name.includes('--')) {
    throw new InputError('Skill name must not contain consecutive hyphens');
  }
  if (name.length === 1) {
    if (!/^[a-z0-9]$/.test(name)) {
      throw new InputError(
        'Skill name may only contain lowercase alphanumeric characters and hyphens',
      );
    }
  } else if (!NAME_REGEX.test(name)) {
    throw new InputError(
      'Skill name may only contain lowercase alphanumeric characters and hyphens',
    );
  }
}

/**
 * Parsed frontmatter from a SKILL.md file.
 *
 * @public
 */
export interface SkillFrontmatter {
  name: string;
  description: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  allowedTools?: string;
}

function readOptionalString(
  data: Record<string, unknown>,
  fieldName: 'license' | 'compatibility' | 'allowedTools',
): string | undefined {
  const value = data[fieldName];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new InputError(
      `SKILL.md frontmatter field '${fieldName}' must be a string when provided`,
    );
  }

  return value;
}

function readRequiredString(
  data: Record<string, unknown>,
  fieldName: 'name' | 'description',
): string {
  const value = data[fieldName];

  if (!value || typeof value !== 'string') {
    throw new InputError(
      `SKILL.md frontmatter must contain a ${fieldName} field`,
    );
  }

  return value;
}

function readMetadata(
  data: Record<string, unknown>,
): Record<string, string> | undefined {
  const value = data.metadata;

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new InputError(
      "SKILL.md frontmatter field 'metadata' must be a map of string values when provided",
    );
  }

  const metadataEntries = Object.entries(value);
  for (const [key, entryValue] of metadataEntries) {
    if (typeof entryValue !== 'string') {
      throw new InputError(
        `SKILL.md frontmatter metadata entry '${key}' must be a string`,
      );
    }
  }

  return Object.fromEntries(metadataEntries);
}

function normalizeFrontmatterKey(key: string): string {
  return key.replaceAll(/-([a-z])/g, (_, c) => c.toLocaleUpperCase('en-US'));
}

function parseFrontmatterData(
  frontmatterText: string,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const lines = frontmatterText.split('\n');
  let currentKey: string | undefined;
  let currentMap: Record<string, string> | undefined;

  const flushCurrentMap = () => {
    if (currentKey && currentMap) {
      data[currentKey] = currentMap;
      currentKey = undefined;
      currentMap = undefined;
    }
  };

  for (const line of lines) {
    const trimmed = line.trimEnd();

    if (currentKey && currentMap && /^\s{2,}\S/.test(line)) {
      const mapMatch = MAP_ENTRY_REGEX.exec(trimmed);
      if (mapMatch) {
        currentMap[mapMatch[1].trim()] = mapMatch[2].trim();
      }
      continue;
    }

    flushCurrentMap();

    const kvMatch = TOP_LEVEL_ENTRY_REGEX.exec(trimmed);
    if (!kvMatch) {
      continue;
    }

    const key = normalizeFrontmatterKey(kvMatch[1]);
    const value = kvMatch[2].trim();

    if (value === '') {
      currentKey = key;
      currentMap = {};
      continue;
    }

    data[key] = value.replace(/^"(.*)"$/, '$1');
  }

  flushCurrentMap();

  return data;
}

/**
 * Parses and validates YAML frontmatter from a SKILL.md file content.
 *
 * @public
 */
export function parseSkillFrontmatter(content: string): SkillFrontmatter {
  const match = FRONTMATTER_REGEX.exec(content);
  if (!match) {
    throw new InputError('SKILL.md must contain YAML frontmatter');
  }

  const frontmatterText = match[1];
  const data = parseFrontmatterData(frontmatterText);
  const name = readRequiredString(data, 'name');
  const description = readRequiredString(data, 'description');

  validateSkillName(name);

  if (description.length > 1024) {
    throw new InputError('Skill description must be at most 1024 characters');
  }

  if (
    data.compatibility &&
    typeof data.compatibility === 'string' &&
    data.compatibility.length > 500
  ) {
    throw new InputError('Skill compatibility must be at most 500 characters');
  }

  return {
    name,
    description,
    license: readOptionalString(data, 'license'),
    compatibility: readOptionalString(data, 'compatibility'),
    metadata: readMetadata(data),
    allowedTools: readOptionalString(data, 'allowedTools'),
  };
}
