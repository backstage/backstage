/*
 * Copyright 2022 The Backstage Authors
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
import { parseSyml } from '@yarnpkg/parsers';

const ENTRY_PATTERN = /^((?:@[^/]+\/)?[^@/]+)@(.+)$/;

type LockfileData = {
  [entry: string]: {
    version: string;
    resolved?: string;
    integrity?: string;
    dependencies?: { [name: string]: string };
  };
};

type LockfileQueryEntry = {
  range: string;
  version: string;
};

function parseLockfile(lockfileContents: string) {
  try {
    return {
      object: parseSyml(lockfileContents),
      type: 'success',
    };
  } catch (err) {
    return {
      object: null,
      type: err,
    };
  }
}

// these are special top level yarn keys.
// https://github.com/yarnpkg/berry/blob/9bd61fbffb83d0b8166a9cc26bec3a58743aa453/packages/yarnpkg-parsers/sources/syml.ts#L9
const SPECIAL_OBJECT_KEYS = [
  `__metadata`,
  `version`,
  `resolution`,
  `dependencies`,
  `peerDependencies`,
  `dependenciesMeta`,
  `peerDependenciesMeta`,
  `binaries`,
];

export class Lockfile {
  static async load(path: string) {
    const lockfileContents = await fs.readFile(path, 'utf8');
    const lockfile = parseLockfile(lockfileContents);
    if (lockfile.type !== 'success') {
      throw new Error(`Failed yarn.lock parse with ${lockfile.type}`);
    }

    const data = lockfile.object as LockfileData;
    const packages = new Map<string, LockfileQueryEntry[]>();

    for (const [key, value] of Object.entries(data)) {
      if (SPECIAL_OBJECT_KEYS.includes(key)) continue;

      const [, name, range] = ENTRY_PATTERN.exec(key) ?? [];
      if (!name) {
        throw new Error(`Failed to parse yarn.lock entry '${key}'`);
      }

      let queries = packages.get(name);
      if (!queries) {
        queries = [];
        packages.set(name, queries);
      }
      queries.push({ range, version: value.version });
    }

    return new Lockfile(packages);
  }

  private constructor(
    private readonly packages: Map<string, LockfileQueryEntry[]>,
  ) {}

  /** Get the entries for a single package in the lockfile */
  get(name: string): LockfileQueryEntry[] | undefined {
    return this.packages.get(name);
  }

  /** Returns the name of all packages available in the lockfile */
  keys(): IterableIterator<string> {
    return this.packages.keys();
  }
}
