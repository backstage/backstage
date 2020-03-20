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

import fs from 'fs-extra';

const TEAM_ID_RE = /^@[-\w]+\/[-\w]+$/;
const USER_ID_RE = /^@[-\w]+$/;
const EMAIL_RE = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function isValidSingleOwnerId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return TEAM_ID_RE.test(id) || USER_ID_RE.test(id) || EMAIL_RE.test(id);
}

export function parseOwnerIds(
  spaceSeparatedOwnerIds: string,
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

export function addCodeownersEntry(
  codeownersFilePath: string,
  ownedPath: string,
  ownerIds: string[],
): void {
  const allLines = fs.readFileSync(codeownersFilePath, 'utf8').split('\n');

  // Only keep comments from the top of the file
  const commentLines = [];
  for (const line of allLines) {
    if (line[0] !== '#') {
      break;
    }
    commentLines.push(line);
  }

  const oldDeclarationEntries = allLines
    .filter(line => line[0] !== '#')
    .map(line => line.split(/\s+/).filter(Boolean))
    .filter(items => items.length >= 2);

  const newDeclarationEntries = oldDeclarationEntries
    .filter(items => items[0] !== '*')
    .concat([[ownedPath, ...ownerIds]])
    .sort((l1, l2) => l1[0].localeCompare(l2[0]))
    .concat([['*', '@spotify/backstage-core']]);

  // Calculate longest path to be able to align entries nicely
  const longestOwnedPath = newDeclarationEntries.reduce(
    (length, entry) => Math.max(length, entry[0].length),
    0,
  );

  const newDeclarationLines = newDeclarationEntries.map(entry => {
    const entryPath = entry[0] + ' '.repeat(longestOwnedPath - entry[0].length);
    const entryOwners = entry.slice(1);
    return [entryPath, ...entryOwners].join(' ');
  });

  const newLines = [...commentLines, '', ...newDeclarationLines, ''];

  fs.writeFileSync(codeownersFilePath, newLines.join('\n'), 'utf8');
}
