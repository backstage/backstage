/*
 * Copyright 2023 The Backstage Authors
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
import {
  CodeOwnersEntry,
  CODEOWNERS_PATHS,
  matchFile as matchCodeowner,
  parse as parseCodeowners,
} from 'codeowners-utils';
import { relative as relativePath, resolve as resolvePath } from 'path';
import { readFile } from './utils';

export async function loadCodeowners(): Promise<CodeOwnersEntry[]> {
  const maybeFiles = await Promise.allSettled(
    CODEOWNERS_PATHS.map(async path =>
      readFile(resolvePath('.', path), { encoding: 'utf-8' }),
    ),
  );
  const file = maybeFiles.find(
    maybeFile => maybeFile.status === 'fulfilled',
  ) as PromiseFulfilledResult<string> | undefined;

  if (!file) {
    throw new Error(
      'This utility expects a CODEOWNERS file, but no such file was found.',
    );
  }

  return parseCodeowners(file.value);
}

export function getPossibleCodeowners(
  codeowners: CodeOwnersEntry[],
  relPath: string,
): string[] {
  const codeownerMaybe = matchCodeowner(relPath, codeowners);
  return codeownerMaybe
    ? codeownerMaybe.owners.map(
        owner => (owner.match(/(?:\@[^\/]+\/)?([^\@\/]*)$/) || [])[1],
      )
    : [];
}

export function getOwnerFromCodeowners(
  codeowners: CodeOwnersEntry[],
  absPath: string,
): string {
  const relPath = relativePath('.', absPath);
  const possibleOwners = getPossibleCodeowners(codeowners, relPath);
  const owner = possibleOwners[0];

  if (!owner) {
    throw new Error(`${relPath} isn't owned by anyone in CODEOWNERS`);
  }

  return owner;
}
