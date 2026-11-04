/*
 * Copyright 2020 The Backstage Authors
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
import path from 'node:path';
import { targetPaths } from '@backstage/cli-common';

const TEAM_ID_RE = /^@[-\w]+\/[-\w]+$/;
const USER_ID_RE = /^@[-\w]+$/;
const EMAIL_RE = /^[^@]+@[-.\w]+\.[-\w]+$/i;

export async function getCodeownersFilePath(
  rootDir: string,
): Promise<string | undefined> {
  const possiblePaths = [
    path.join(rootDir, '.github', 'CODEOWNERS'),
    path.join(rootDir, '.gitlab', 'CODEOWNERS'),
    path.join(rootDir, 'docs', 'CODEOWNERS'),
    path.join(rootDir, 'CODEOWNERS'),
  ];

  for (const p of possiblePaths) {
    if (await fs.pathExists(p)) {
      return p;
    }
  }

  return undefined;
}

export function isValidSingleOwnerId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return TEAM_ID_RE.test(id) || USER_ID_RE.test(id) || EMAIL_RE.test(id);
}

export function parseOwnerIds(
  spaceSeparatedOwnerIds: string | undefined,
): string[] | undefined {
  if (!spaceSeparatedOwnerIds || typeof spaceSeparatedOwnerIds !== 'string') {
    return undefined;
  }

  const ids = spaceSeparatedOwnerIds.split(' ').filter(Boolean);
  if (!ids.every(isValidSingleOwnerId)) {
    return undefined;
  }

  return ids;
}

export async function addCodeownersEntry(
  ownedPath: string,
  ownerStr: string,
  codeownersFilePath?: string,
): Promise<boolean> {
  const ownerIds = parseOwnerIds(ownerStr);
  if (!ownerIds || ownerIds.length === 0) {
    return false;
  }

  let filePath = codeownersFilePath;
  if (!filePath) {
    filePath = await getCodeownersFilePath(targetPaths.rootDir);
    if (!filePath) {
      return false;
    }
  }

  const rootDir = targetPaths.rootDir;
  const relativePath = path.isAbsolute(ownedPath)
    ? path.relative(rootDir, ownedPath)
    : ownedPath;
  const normalizedPath = `/${relativePath
    .split(path.sep)
    .flatMap(part => part.split('/'))
    .filter(Boolean)
    .join('/')}/`;

  const content = await fs.readFile(filePath, 'utf8');
  const separator = content.length === 0 || content.endsWith('\n') ? '' : '\n';
  const newLine = [normalizedPath, ...ownerIds].join(' ');

  await fs.writeFile(filePath, `${content}${separator}${newLine}\n`, 'utf8');

  return true;
}
