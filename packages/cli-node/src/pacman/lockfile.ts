/*
 * Copyright 2024 The Backstage Authors
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
import crypto from 'node:crypto';

/**
 * An entry for a single difference between two {@link Lockfile}s.
 *
 * @public
 */
export type LockfileDiffEntry = {
  name: string;
  range: string;
};

/**
 * Represents the difference between two {@link Lockfile}s.
 *
 * @public
 */
export type LockfileDiff = {
  added: LockfileDiffEntry[];
  changed: LockfileDiffEntry[];
  removed: LockfileDiffEntry[];
};

/** @internal */
export type LockfileQueryEntry = {
  range: string;
  version: string;
  dataKey: string;
};

/** @internal */
export type LockfileData = {
  [entry: string]: {
    version: string;
    resolved?: string;
    integrity?: string /* old */;
    checksum?: string /* new */;
    dependencies?: { [name: string]: string };
    peerDependencies?: { [name: string]: string };
  };
};

export abstract class Lockfile {
  protected constructor(
    protected readonly packages: Map<string, LockfileQueryEntry[]>,
    protected readonly data: LockfileData,
  ) {}

  abstract get(name: string): LockfileQueryEntry[] | undefined;
  abstract keys(): IterableIterator<string>;
  abstract toString(): string;

  /**
   * Creates a simplified dependency graph from the lockfile data, where each
   * key is a package, and the value is a set of all packages that it depends on
   * across all versions.
   */
  createSimplifiedDependencyGraph(): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    for (const [name, entries] of this.packages) {
      const dependencies = new Set(
        entries.flatMap(e => {
          const data = this.data[e.dataKey];
          return [
            ...Object.keys(data?.dependencies ?? {}),
            ...Object.keys(data?.peerDependencies ?? {}),
          ];
        }),
      );
      graph.set(name, dependencies);
    }

    return graph;
  }

  /**
   * Diff with another lockfile, returning entries that have been
   * added, changed, and removed compared to the other lockfile.
   */
  diff(otherLockfile: Lockfile): LockfileDiff {
    const diff = {
      added: new Array<{ name: string; range: string }>(),
      changed: new Array<{ name: string; range: string }>(),
      removed: new Array<{ name: string; range: string }>(),
    };

    // Keeps track of packages that only exist in this lockfile
    const remainingOldNames = new Set(this.packages.keys());

    for (const [name, otherQueries] of otherLockfile.packages) {
      remainingOldNames.delete(name);

      const thisQueries = this.packages.get(name);
      // If the packages doesn't exist in this lockfile, add all entries
      if (!thisQueries) {
        diff.removed.push(...otherQueries.map(q => ({ name, range: q.range })));
        continue;
      }

      const remainingOldRanges = new Set(thisQueries.map(q => q.range));

      for (const otherQuery of otherQueries) {
        remainingOldRanges.delete(otherQuery.range);

        const thisQuery = thisQueries.find(q => q.range === otherQuery.range);
        if (!thisQuery) {
          diff.removed.push({ name, range: otherQuery.range });
          continue;
        }

        const otherPkg = otherLockfile.data[otherQuery.dataKey];
        const thisPkg = this.data[thisQuery.dataKey];
        if (otherPkg && thisPkg) {
          const thisCheck = thisPkg.integrity || thisPkg.checksum;
          const otherCheck = otherPkg.integrity || otherPkg.checksum;
          if (thisCheck !== otherCheck) {
            diff.changed.push({ name, range: otherQuery.range });
          }
        }
      }

      for (const thisRange of remainingOldRanges) {
        diff.added.push({ name, range: thisRange });
      }
    }

    for (const name of remainingOldNames) {
      const queries = this.packages.get(name) ?? [];
      diff.added.push(...queries.map(q => ({ name, range: q.range })));
    }

    return diff;
  }

  /**
   * Generates a sha1 hex hash of the dependency graph for a package.
   */
  getDependencyTreeHash(startName: string): string {
    if (!this.packages.has(startName)) {
      throw new Error(`Package '${startName}' not found in lockfile`);
    }

    const hash = crypto.createHash('sha1');

    const queue = [startName];
    const seen = new Set<string>();

    while (queue.length > 0) {
      const name = queue.pop()!;

      if (seen.has(name)) {
        continue;
      }
      seen.add(name);

      const entries = this.packages.get(name);
      if (!entries) {
        continue; // In case of missing optional peer dependencies
      }

      hash.update(`pkg:${name}`);
      hash.update('\0');

      // TODO(Rugvip): This uses the same simplified lookup as createSimplifiedDependencyGraph()
      //               we could match version queries to make the resulting tree a bit smaller.
      const deps = new Array<string>();
      for (const entry of entries) {
        // We're not being particular about stable ordering here. If the lockfile ordering changes, so will likely hash.
        hash.update(entry.version);

        const data = this.data[entry.dataKey];
        if (!data) {
          continue;
        }

        const checksum = data.checksum || data.integrity;
        if (checksum) {
          hash.update('#');
          hash.update(checksum);
        }

        hash.update(' ');

        deps.push(...Object.keys(data.dependencies ?? {}));
        deps.push(...Object.keys(data.peerDependencies ?? {}));
      }

      queue.push(...new Set(deps));
    }

    return hash.digest('hex');
  }
}
