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
import { CodeOwnersEntry } from 'codeowners-utils';
import { get, head, pipe, reverse } from 'lodash/fp';

const USER_PATTERN = /^@.*/;
const GROUP_PATTERN = /^@.*\/.*/;
const EMAIL_PATTERN = /^.*@.*\..*$/;

export function resolveCodeOwner(
  contents: string,
  pattern?: string,
): string | undefined {
  const owners = codeowners.parse(contents);

  let filteredOwners = owners.filter((e: CodeOwnersEntry) =>
    pattern?.includes(e.pattern),
  );
  if (filteredOwners.length === 0) {
    filteredOwners = owners.filter((e: CodeOwnersEntry) => e.pattern === '*');
  }

  const result = pipe(
    reverse,
    head,
    get('owners'),
    head,
    normalizeCodeOwner,
  )(filteredOwners);

  return result;
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
