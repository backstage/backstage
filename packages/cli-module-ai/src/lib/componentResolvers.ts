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

import { stringifyEntityRef, type Entity } from '@backstage/catalog-model';
import type {
  FilterPredicate,
  FilterPredicateExpression,
} from '@backstage/filter-predicates';
import { queryAllEntities, type CatalogReader } from './catalogClient';
import {
  getMainCheckoutRoot,
  getOriginUrl,
  getRepoPrefix,
  getRepoRoot,
  isManagedWithinSameRepo,
  parseCatalogFileFolder,
  parseFileLocationFolder,
  parseSourceLocationFolder,
  repoUrlFromRemote,
} from './gitRemote';

/** A way of finding the component that the current folder belongs to. */
export interface ComponentResolver {
  /** Used in the "nothing found" error, e.g. "a backstage.io/source-location". */
  description: string;
  /** The component, undefined to let the next resolver try, or throws if ambiguous. */
  resolve(options: {
    cwd: string;
    catalog: CatalogReader;
  }): Promise<Entity | undefined>;
}

const SOURCE_LOCATION = 'backstage.io/source-location';
const MANAGED_BY_LOCATION = 'backstage.io/managed-by-location';

interface ComponentCandidate {
  entity: Entity;
  /** The possible repo-relative folders of the component, as segment lists. */
  folders: string[][];
}

async function queryComponentsByLocation(options: {
  catalog: CatalogReader;
  repoUrl: string;
  fileRoots: string[];
  annotation: string;
  /** Whether the annotation points at the folder, or at a catalog file. */
  isFolder: boolean;
}): Promise<ComponentCandidate[]> {
  const { catalog, repoUrl, fileRoots, annotation, isFolder } = options;
  // A path type that cannot start with `$`, which marks predicate operators.
  const path: `metadata.${string}` = `metadata.annotations.${annotation}`;
  const urlMatch: FilterPredicateExpression = {};
  urlMatch[path] = { $hasPrefix: `url:${repoUrl}/` };
  const fileMatch: FilterPredicateExpression = {};
  fileMatch[path] = { $hasPrefix: 'file:' };
  const query: FilterPredicate = {
    $all: [
      { kind: 'Component' },
      fileRoots.length > 0 ? { $any: [urlMatch, fileMatch] } : urlMatch,
    ],
  };
  const entities = await queryAllEntities(catalog, { query });
  return entities.flatMap(entity => {
    const location = entity.metadata.annotations?.[annotation] ?? '';
    // A source location is declared by the entity itself, so it only counts
    // when the catalog read the entity from the same repository.
    if (
      isFolder &&
      !isManagedWithinSameRepo(
        location,
        entity.metadata.annotations?.[MANAGED_BY_LOCATION] ?? '',
        repoUrl,
        fileRoots,
      )
    ) {
      return [];
    }
    const fileFolder = parseFileLocationFolder(location, fileRoots, {
      isFolder,
    });
    const folders = fileFolder
      ? [fileFolder]
      : (isFolder ? parseSourceLocationFolder : parseCatalogFileFolder)(
          location,
          repoUrl,
        );
    return folders ? [{ entity, folders }] : [];
  });
}

const isAt = (candidate: ComponentCandidate, folder: string) =>
  candidate.folders.some(f => f.join('/') === folder);

const listRefs = (candidates: ComponentCandidate[]) =>
  candidates.map(c => stringifyEntityRef(c.entity)).join(', ');

/**
 * Matches components by a location annotation against the current folder in
 * the git remote repository, where the nearest folder wins. Without a git
 * remote there is nothing to match, and the resolver finds nothing.
 */
function locationResolver(options: {
  annotation: string;
  /** Whether the annotation points at the folder, or at a catalog file. */
  isFolder: boolean;
}): ComponentResolver {
  const { annotation, isFolder } = options;
  return {
    description: `a ${annotation}`,
    async resolve({ cwd, catalog }) {
      const remoteUrl = await getOriginUrl(cwd).catch(() => undefined);
      if (!remoteUrl) {
        return undefined;
      }
      const repoUrl = repoUrlFromRemote(remoteUrl);
      const folder = (await getRepoPrefix(cwd)).split('/').filter(Boolean);
      const fileRoots = [
        await getRepoRoot(cwd),
        await getMainCheckoutRoot(cwd),
      ].filter((root): root is string => Boolean(root));
      // The current folder first, then each ancestor up to the repo root.
      const ancestors = folder.map((_, i) =>
        folder.slice(0, folder.length - i).join('/'),
      );
      ancestors.push('');

      const candidates = await queryComponentsByLocation({
        catalog,
        repoUrl,
        fileRoots,
        annotation,
        isFolder,
      });
      for (const wanted of ancestors) {
        const matches = candidates.filter(c => isAt(c, wanted));
        if (matches.length === 1) {
          return matches[0].entity;
        }
        if (matches.length > 1) {
          throw new Error(
            `Multiple Components have a ${annotation} in ${repoUrl}${
              wanted ? `/${wanted}` : ''
            }: ${listRefs(matches)}. Use --entity to select one.`,
          );
        }
      }
      return undefined;
    },
  };
}

/**
 * The resolvers tried in order by default, where the first one that finds a
 * component wins:
 *
 * 1. Components whose `backstage.io/source-location` is the current folder or
 *    one of its ancestors in this repository, and whose
 *    `backstage.io/managed-by-location` is in the same repository.
 * 2. Components whose `backstage.io/managed-by-location` is a catalog file in
 *    this repository, where the folder of the catalog file that is the nearest
 *    ancestor of the current folder wins.
 *
 * Locations registered as `file:` inside the repository root or the main
 * checkout root are considered too.
 */
export const defaultComponentResolvers: ComponentResolver[] = [
  locationResolver({ annotation: SOURCE_LOCATION, isFolder: true }),
  locationResolver({ annotation: MANAGED_BY_LOCATION, isFolder: false }),
];
