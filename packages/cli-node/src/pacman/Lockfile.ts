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

/**
 * An entry for a single package in a {@link Lockfile}.
 *
 * @public
 */
export type LockfileEntry = {
  range: string;
  version: string;
};

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

/**
 * Represents the lockfile for a package manager.
 *
 * @public
 */
export interface Lockfile {
  /** Get the entries for a single package in the lockfile */
  get(name: string): LockfileEntry[] | undefined;

  /** Returns the names of all packages available in the lockfile */
  keys(): IterableIterator<string>;

  /**
   * Creates a simplified dependency graph from the lockfile data, where each
   * key is a package, and the value is a set of all packages that it depends on
   * across all versions.
   */
  createSimplifiedDependencyGraph(): Map<string, Set<string>>;

  /**
   * Diff with another lockfile, returning entries that have been
   * added, changed, and removed compared to the other lockfile.
   */
  diff(otherLockfile: Lockfile): LockfileDiff;

  /**
   * Generates a sha1 hex hash of the dependency graph for a package.
   */
  getDependencyTreeHash(startName: string): string;
}
