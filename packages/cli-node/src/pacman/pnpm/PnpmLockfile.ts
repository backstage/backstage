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

import crypto from 'node:crypto';
import { posix as posixPath } from 'node:path';
import fs from 'fs-extra';
import { parse as parseYaml } from 'yaml';
import type { LockfileDiff } from '@backstage/cli-node';
import { Lockfile, LockfileEntry } from '../Lockfile';
import { ParseLockfileOptions } from '../PackageManager';

const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
] as const;

/**
 * A dependency of a resolved package or workspace package. The name is the one
 * that entries list the dependency under, and the node is what it resolves to.
 */
type PnpmDependency = {
  name: string;
  /** The specifier in the package.json, only for workspace packages */
  specifier?: string;
  node?: string;
  version: string;
};

/**
 * A resolved package or workspace package that entries point to. Packages are
 * keyed by their package ID, `name@version`, followed by the patch hash for a
 * patched package, and workspace packages by `importer:<dir>`.
 */
type PnpmNode = {
  version: string;
  integrity?: string;
  patchHash?: string;
  dependencies: PnpmDependency[];
};

type PnpmEntry = LockfileEntry & {
  node?: string;
};

/**
 * A pnpm `pnpm-lock.yaml` lockfile.
 *
 * @remarks
 *
 * Lockfile version 9 is supported, which pnpm 9 and later write. The file is
 * read with the libraries that pnpm itself uses, which also handle the
 * separate document that pnpm writes when `package.json` pins its version.
 *
 * The ranges of direct dependencies are their specifiers, while transitive
 * packages use their resolved version as the range. Dependencies on other
 * workspace packages have a `link:` version with the directory of the linked
 * package relative to the workspace root. Workspace packages themselves are
 * listed under their name with a `workspace:<dir>` range.
 *
 * Diffs and dependency tree hashes follow each package to the versions that
 * it resolves to, including the patch of a patched package, since pnpm can
 * resolve the same range to different versions for different workspace
 * packages.
 *
 * pnpm lists workspace packages by directory, so their names come from the
 * `readWorkspacePackageJsons` option, which must read from the same source as
 * the lockfile. Without it, workspace packages are listed under their
 * directory instead, and the lockfile can't be diffed.
 */
export class PnpmLockfile implements Lockfile {
  /** Loads a lockfile from a file path. */
  static async load(
    path: string,
    options?: ParseLockfileOptions,
  ): Promise<PnpmLockfile> {
    const content = await fs.readFile(path, 'utf8');
    return PnpmLockfile.parse(content, options);
  }

  /** Parses lockfile contents. */
  static async parse(
    content: string,
    options?: ParseLockfileOptions,
  ): Promise<PnpmLockfile> {
    // These libraries are only published as ES modules
    const { convertToLockfileObject, extractMainDocument } = await import(
      '@pnpm/lockfile.fs'
    );
    const {
      parse: parseDepPath,
      refToRelative,
      getPkgIdWithPatchHash,
    } = await import('@pnpm/deps.path');

    let lockfileFile;
    try {
      lockfileFile = parseYaml(
        extractMainDocument(content.replace(/^\uFEFF/, '')),
      );
    } catch (error) {
      throw new Error(`Failed pnpm-lock.yaml parse, ${error}`);
    }
    if (!lockfileFile || typeof lockfileFile !== 'object') {
      throw new Error('Failed pnpm-lock.yaml parse, the lockfile is empty');
    }
    const lockfileVersion = String(lockfileFile.lockfileVersion);
    if (!/^9(\.|$)/.test(lockfileVersion)) {
      throw new Error(
        `Unsupported pnpm-lock.yaml version '${lockfileVersion}', only version 9 lockfiles are supported`,
      );
    }
    const lockfile = convertToLockfileObject(lockfileFile);

    const nodes = new Map<string, PnpmNode>();
    const entries = new Map<string, PnpmEntry[]>();

    const addEntry = (name: string, entry: PnpmEntry) => {
      let nameEntries = entries.get(name);
      if (!nameEntries) {
        nameEntries = [];
        entries.set(name, nameEntries);
      }
      const exists = nameEntries.some(
        e =>
          e.range === entry.range &&
          e.version === entry.version &&
          e.node === entry.node,
      );
      if (!exists) {
        nameEntries.push(entry);
      }
    };

    // Resolves a dependency reference, such as `1.0.0(peer@2.0.0)`,
    // `alias@1.0.0`, or `link:../dir`, to the node that it points to.
    const resolveReference = (
      importerDir: string,
      name: string,
      reference: string,
    ): { version: string; node?: string } => {
      // Links are relative to the importer, but are normalized to be relative
      // to the workspace root, so that links to the same package from
      // importers at different depths are the same version
      if (reference.startsWith('link:')) {
        const linkPath = reference.slice('link:'.length);
        const linkedDir = posixPath.isAbsolute(linkPath)
          ? posixPath.normalize(linkPath)
          : posixPath.normalize(posixPath.join(importerDir, linkPath));
        return {
          version: `link:${linkedDir}`,
          node:
            linkedDir in lockfile.importers
              ? `importer:${linkedDir}`
              : undefined,
        };
      }
      const depPath = refToRelative(reference, name);
      if (!depPath) {
        return { version: reference };
      }
      // A patched package is a separate node, so that its patch is part of
      // the comparisons and hashes
      const packageId = getPkgIdWithPatchHash(depPath);
      return {
        version: nodes.get(packageId)?.version ?? reference,
        node: packageId,
      };
    };

    const addDependency = (node: PnpmNode, dependency: PnpmDependency) => {
      const exists = node.dependencies.some(
        d =>
          d.name === dependency.name &&
          d.specifier === dependency.specifier &&
          d.node === dependency.node &&
          d.version === dependency.version,
      );
      if (!exists) {
        node.dependencies.push(dependency);
      }
    };

    // Packages, where variants of a package with different peer dependencies
    // are merged into a single node
    const packageNames = new Map<string, string>();
    const packageDependencies = new Array<
      [node: PnpmNode, dependencies: Record<string, string>]
    >();
    for (const [depPath, pkg] of Object.entries(lockfile.packages ?? {})) {
      const packageId = getPkgIdWithPatchHash(
        depPath as Parameters<typeof getPkgIdWithPatchHash>[0],
      );
      const parsed = parseDepPath(packageId);
      if (!parsed.name) {
        throw new Error(`Failed to parse pnpm-lock.yaml package '${depPath}'`);
      }
      packageNames.set(packageId, parsed.name);

      let node = nodes.get(packageId);
      if (!node) {
        const resolution = pkg.resolution as { integrity?: string } | undefined;
        node = {
          version: parsed.version ?? parsed.nonSemverVersion ?? packageId,
          integrity: resolution?.integrity,
          patchHash: parsed.patchHash,
          dependencies: [],
        };
        nodes.set(packageId, node);
      }
      // Resolved peer dependencies are part of these
      packageDependencies.push(
        [node, pkg.dependencies ?? {}],
        [node, pkg.optionalDependencies ?? {}],
      );
    }

    // The dependencies of packages, once all packages are known. Aliased
    // dependencies are listed under the name of the real package, which the
    // entries of transitive packages use.
    for (const [node, dependencies] of packageDependencies) {
      for (const [name, reference] of Object.entries(dependencies)) {
        const { version, node: depNode } = resolveReference(
          '.',
          name,
          reference,
        );
        addDependency(node, {
          name: (depNode && packageNames.get(depNode)) ?? name,
          node: depNode,
          version,
        });
      }
    }

    // Workspace packages and their direct dependencies
    let hasUnnamedWorkspacePackages = false;
    const importers = Object.entries(lockfile.importers);
    const packageJsons =
      (await options?.readWorkspacePackageJsons?.(
        importers.map(([dir]) => dir),
      )) ?? [];
    for (const [index, [dir, importer]] of importers.entries()) {
      const nodeKey = `importer:${dir}`;
      const node: PnpmNode = {
        version: `link:${dir}`,
        dependencies: [],
      };
      nodes.set(nodeKey, node);

      for (const field of DEPENDENCY_FIELDS) {
        for (const [name, reference] of Object.entries(importer[field] ?? {})) {
          const specifier = importer.specifiers[name] ?? reference;
          const { version, node: depNode } = resolveReference(
            dir,
            name,
            reference,
          );
          addDependency(node, { name, specifier, node: depNode, version });
          addEntry(name, {
            range: specifier.replace(/^npm:/, ''),
            version,
            node: depNode,
          });
        }
      }

      const packageJson = packageJsons[index];
      if (!packageJson) {
        // Without a name the package is listed under its directory, which
        // nothing else refers to it by
        hasUnnamedWorkspacePackages = true;
        addEntry(dir, {
          range: `workspace:${dir}`,
          version: node.version,
          node: nodeKey,
        });
      } else if (packageJson.name) {
        addEntry(packageJson.name, {
          range: `workspace:${dir}`,
          version: node.version,
          node: nodeKey,
        });
      }
    }

    // Transitive packages, using the resolved version as the range
    for (const [packageId, name] of packageNames) {
      const isDirect = entries.get(name)?.some(e => e.node === packageId);
      if (!isDirect) {
        const { version } = nodes.get(packageId)!;
        addEntry(name, { range: version, version, node: packageId });
      }
    }

    for (const nameEntries of entries.values()) {
      nameEntries.sort(
        (a, b) =>
          compareStrings(a.range, b.range) ||
          compareStrings(a.version, b.version),
      );
    }

    return new PnpmLockfile(entries, nodes, hasUnnamedWorkspacePackages);
  }

  private constructor(
    private readonly entries: Map<string, PnpmEntry[]>,
    private readonly nodes: Map<string, PnpmNode>,
    private readonly hasUnnamedWorkspacePackages: boolean,
  ) {}

  /** {@inheritDoc Lockfile.get} */
  get(name: string): LockfileEntry[] | undefined {
    return this.entries
      .get(name)
      ?.map(({ range, version }) => ({ range, version }));
  }

  /** {@inheritDoc Lockfile.keys} */
  keys(): IterableIterator<string> {
    return this.entries.keys();
  }

  /** {@inheritDoc Lockfile.createSimplifiedDependencyGraph} */
  createSimplifiedDependencyGraph(): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    for (const [name, entries] of this.entries) {
      const dependencies = new Set(
        entries.flatMap(
          e => this.getNode(e)?.dependencies.map(d => d.name) ?? [],
        ),
      );
      graph.set(name, dependencies);
    }

    return graph;
  }

  /**
   * Diff with another lockfile, returning entries that have been added,
   * changed, and removed compared to the other lockfile.
   *
   * @remarks
   *
   * Both lockfiles must be pnpm lockfiles with named workspace packages, since
   * changes can otherwise not be attributed to the right packages.
   */
  diff(otherLockfile: Lockfile): LockfileDiff {
    if (!(otherLockfile instanceof PnpmLockfile)) {
      throw new Error(
        'A pnpm-lock.yaml file can only be diffed with another one',
      );
    }
    if (
      this.hasUnnamedWorkspacePackages ||
      otherLockfile.hasUnnamedWorkspacePackages
    ) {
      throw new Error(
        'The workspace packages in pnpm-lock.yaml could not be named, so the changes cannot be attributed to them',
      );
    }

    const diff = {
      added: new Array<{ name: string; range: string }>(),
      changed: new Array<{ name: string; range: string }>(),
      removed: new Array<{ name: string; range: string }>(),
    };

    // Keeps track of packages that only exist in this lockfile
    const remainingOldNames = new Set(this.entries.keys());

    for (const [name, otherEntries] of otherLockfile.entries) {
      remainingOldNames.delete(name);

      // A range can resolve to several versions, one per workspace package
      const thisRanges = this.groupByRange(this.entries.get(name) ?? []);
      const otherRanges = otherLockfile.groupByRange(otherEntries);

      for (const [range, otherRangeEntries] of otherRanges) {
        const thisRangeEntries = thisRanges.get(range);
        thisRanges.delete(range);
        if (!thisRangeEntries) {
          diff.removed.push({ name, range });
        } else if (
          !isSameSet(
            thisRangeEntries.map(e => this.getFingerprint(e)),
            otherRangeEntries.map(e => otherLockfile.getFingerprint(e)),
          ) ||
          this.hasChangedResolutions(thisRangeEntries, otherLockfile)
        ) {
          diff.changed.push({ name, range });
        }
      }

      for (const thisRange of thisRanges.keys()) {
        diff.added.push({ name, range: thisRange });
      }
    }

    for (const name of remainingOldNames) {
      const entries = this.entries.get(name) ?? [];
      diff.added.push(...entries.map(e => ({ name, range: e.range })));
    }

    return diff;
  }

  /** {@inheritDoc Lockfile.getDependencyTreeHash} */
  getDependencyTreeHash(startName: string): string {
    const startEntries = this.entries.get(startName);
    if (!startEntries) {
      throw new Error(`Package '${startName}' not found in lockfile`);
    }

    // The dependencies are followed to the exact nodes that they resolve to,
    // so that the hash only covers the versions that the package uses
    const seen = new Set<string>();
    const queue = startEntries.flatMap(e => (e.node ? [e.node] : []));
    while (queue.length > 0) {
      const key = queue.pop()!;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      for (const dependency of this.nodes.get(key)?.dependencies ?? []) {
        if (dependency.node) {
          queue.push(dependency.node);
        }
      }
    }

    // Nodes are hashed in a stable order, independent of the lockfile order
    const hash = crypto.createHash('sha1');
    hash.update(`pkg:${startName}`);
    hash.update('\0');
    // The nodes cover the other entries, so that a new dependent of a
    // workspace package with another range doesn't change its hash
    for (const entry of startEntries) {
      if (!entry.node) {
        hash.update(`${entry.version}\0`);
      }
    }
    for (const key of [...seen].sort(compareStrings)) {
      const node = this.nodes.get(key);
      hash.update(`node:${key}\0`);
      if (!node) {
        // In case of missing optional dependencies
        continue;
      }
      hash.update(`${node.version}#${node.integrity ?? ''}#`);
      hash.update(`${node.patchHash ?? ''}\0`);
      const dependencies = node.dependencies
        .map(d => `${d.name}=${d.node ?? d.version}`)
        .sort(compareStrings);
      hash.update(`${dependencies.join(' ')}\0`);
    }

    return hash.digest('hex');
  }

  private getNode(entry: PnpmEntry): PnpmNode | undefined {
    return entry.node ? this.nodes.get(entry.node) : undefined;
  }

  /**
   * Returns what an entry resolves to, which is the integrity of the package
   * if known, and the version otherwise, together with any patch hash.
   */
  private getFingerprint(entry: PnpmEntry): string {
    const node = this.getNode(entry);
    return `${node?.integrity ?? entry.version}${node?.patchHash ?? ''}`;
  }

  private groupByRange(entries: PnpmEntry[]): Map<string, PnpmEntry[]> {
    const ranges = new Map<string, PnpmEntry[]>();
    for (const entry of entries) {
      ranges.set(entry.range, [...(ranges.get(entry.range) ?? []), entry]);
    }
    return ranges;
  }

  /**
   * Returns true if a workspace package resolves an unchanged dependency
   * specifier differently in the other lockfile. Changed specifiers are not
   * compared, since they come with a change to the package.json of the
   * workspace package.
   */
  private hasChangedResolutions(
    entries: PnpmEntry[],
    otherLockfile: PnpmLockfile,
  ): boolean {
    for (const entry of entries) {
      const node = this.getNode(entry);
      const otherNode = otherLockfile.getNode(entry);
      if (!node || !otherNode || !entry.node?.startsWith('importer:')) {
        continue;
      }
      for (const dependency of node.dependencies) {
        const otherDependency = otherNode.dependencies.find(
          d =>
            d.name === dependency.name && d.specifier === dependency.specifier,
        );
        if (
          otherDependency &&
          this.getDependencyFingerprint(dependency) !==
            otherLockfile.getDependencyFingerprint(otherDependency)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private getDependencyFingerprint(dependency: PnpmDependency): string {
    const node = dependency.node ? this.nodes.get(dependency.node) : undefined;
    return `${node?.integrity ?? dependency.version}${node?.patchHash ?? ''}`;
  }
}

function isSameSet(a: string[], b: string[]): boolean {
  const setA = new Set(a);
  const setB = new Set(b);
  return setA.size === setB.size && [...setA].every(value => setB.has(value));
}

function compareStrings(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  return a > b ? 1 : 0;
}
