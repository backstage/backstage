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

import * as codeowners from 'codeowners-utils';
import parseGitUrl from 'git-url-parse';

const USER_PATTERN = /^@.*/;
const GROUP_PATTERN = /^@.*\/.*/;
const EMAIL_PATTERN = /^.*@.*\..*$/;

export function resolveCodeOwner(
  contents: string,
  catalogInfoFileUrl: string,
): string | undefined {
  const codeOwnerEntries = codeowners.parse(contents);

  const { filepath } = parseGitUrl(catalogInfoFileUrl);
  const match = codeowners.matchFile(filepath, codeOwnerEntries);

  return match ? normalizeCodeOwner(match.owners[0]) : undefined;
}

export function normalizeCodeOwner(owner: string) {
  if (owner.match(GROUP_PATTERN)) {
    return owner.split('/')[1];
  } else if (owner.match(USER_PATTERN)) {
    return `User:${owner.substring(1)}`;
  } else if (owner.match(EMAIL_PATTERN)) {
    return owner.split('@')[0];
  }

  return owner;
}
