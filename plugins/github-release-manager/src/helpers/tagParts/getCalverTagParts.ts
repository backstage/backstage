/*
 * Copyright 2021 Spotify AB
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

import { GitHubReleaseManagerError } from '../../errors/GitHubReleaseManagerError';

export type CalverTagParts = {
  prefix: string;
  calver: string;
  patch: number;
};

export function getCalverTagParts(tag: string) {
  const result = tag.match(
    /(rc|version)-([0-9]{4}\.[0-9]{2}\.[0-9]{2})_([0-9]+)/,
  );

  if (result === null || result.length < 4) {
    throw new GitHubReleaseManagerError('Invalid calver tag');
  }

  const tagParts: CalverTagParts = {
    prefix: result[1],
    calver: result[2],
    patch: parseInt(result[3], 10),
  };

  return tagParts;
}
