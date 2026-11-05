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

import {
  parseEntityRef,
  stringifyEntityRef,
  type Entity,
} from '@backstage/catalog-model';
import { isSkillAiResourceEntity } from '@backstage/catalog-model/alpha';
import type {
  FilterPredicate,
  FilterPredicateExpression,
} from '@backstage/filter-predicates';
import {
  createCatalogClient,
  getEntitiesInBatches,
  queryAllEntities,
  type CatalogReader,
} from './catalogClient';
import {
  getOriginUrl,
  getRepoPrefix,
  parseCatalogFileFolder,
  parseSourceLocationPath,
  repoUrlFromRemote,
} from './gitRemote';
import { fetchIdentity } from './identity';
import { resolveAuth } from './resolveAuth';
import {
  entityRefOf,
  relationTargets,
  selectSkills,
  type SelectionScope,
  type SkillDecision,
} from './selectSkills';

export interface ResolvedContext {
  user: string;
  ownershipRefs: string[];
  componentRef: string;
  owner?: string;
  system?: string;
  /** Group refs from the user's ownership claim. */
  groupRefs: string[];
  /** Ancestor groups of the user's groups and the component owner. */
  ancestorGroupRefs: string[];
}

const isKind = (ref: string, kind: string) =>
  parseEntityRef(ref).kind.toLocaleLowerCase('en-US') === kind;

const SOURCE_LOCATION = 'backstage.io/source-location';
const MANAGED_BY_LOCATION = 'backstage.io/managed-by-location';

interface ComponentCandidate {
  entity: Entity;
  /** The possible repo-relative folders of the component, as segment lists. */
  folders: string[][];
}

async function queryComponentsByLocation(options: {
  client: CatalogReader;
  token: string;
  repoUrl: string;
  annotation: string;
  parse: (location: string, repoUrl: string) => string[][] | undefined;
}): Promise<ComponentCandidate[]> {
  const { client, token, repoUrl, annotation, parse } = options;
  // A path type that cannot start with `$`, which marks predicate operators.
  const path: `metadata.${string}` = `metadata.annotations.${annotation}`;
  const hasLocationPrefix: FilterPredicateExpression = {};
  hasLocationPrefix[path] = { $hasPrefix: `url:${repoUrl}/` };
  const query: FilterPredicate = {
    $all: [{ kind: 'Component' }, hasLocationPrefix],
  };
  const entities = await queryAllEntities(client, { query }, token);
  return entities.flatMap(entity => {
    const folders = parse(
      entity.metadata.annotations?.[annotation] ?? '',
      repoUrl,
    );
    return folders ? [{ entity, folders }] : [];
  });
}

const isAt = (candidate: ComponentCandidate, folder: string) =>
  candidate.folders.some(f => f.join('/') === folder);

const listRefs = (candidates: ComponentCandidate[]) =>
  candidates.map(c => entityRefOf(c.entity)).join(', ');

/**
 * Finds the component to resolve against. With an explicit entity, that
 * entity is fetched. Otherwise the component is matched against the current
 * folder in the git remote repository:
 *
 * 1. Components whose `backstage.io/managed-by-location` is a catalog file in
 *    this repository. The catalog always sets this annotation itself, so it
 *    cannot be claimed by an entity from another location. The folder of the
 *    catalog file that is the nearest ancestor of the current folder wins.
 * 2. Only when that finds nothing, components whose self-declared
 *    `backstage.io/source-location` is the current folder or one of its
 *    ancestors. This covers components registered from another repository,
 *    such as a central catalog repository. Because any entity can declare
 *    this annotation, a match is only accepted when exactly one component
 *    declares it, and a warning is reported.
 */
export async function findComponent(options: {
  client: CatalogReader;
  token: string;
  entity?: string;
  remoteUrl?: string;
  /** The current folder relative to the repository root, empty at the root. */
  repoPrefix?: string;
  /** Reports a warning, defaults to writing a line to standard error. */
  warn?: (message: string) => void;
}): Promise<Entity> {
  const { client, token } = options;
  const warn =
    options.warn ?? ((message: string) => process.stderr.write(`${message}\n`));
  if (options.entity) {
    const refString = stringifyEntityRef(
      parseEntityRef(options.entity, {
        defaultKind: 'Component',
        defaultNamespace: 'default',
      }),
    );
    const entity = await client.getEntityByRef(refString, { token });
    if (!entity) {
      throw new Error(`Entity ${refString} was not found in the catalog`);
    }
    return entity;
  }
  if (!options.remoteUrl) {
    throw new Error('Either an entity or a git remote URL is required');
  }
  const repoUrl = repoUrlFromRemote(options.remoteUrl);
  const folder = (options.repoPrefix ?? '').split('/').filter(Boolean);
  const location =
    folder.length > 0 ? `${repoUrl}/${folder.join('/')}` : repoUrl;
  // The current folder first, then each ancestor up to the repo root.
  const ancestors = folder.map((_, i) =>
    folder.slice(0, folder.length - i).join('/'),
  );
  ancestors.push('');

  const registered = await queryComponentsByLocation({
    client,
    token,
    repoUrl,
    annotation: MANAGED_BY_LOCATION,
    parse: parseCatalogFileFolder,
  });
  for (const wanted of ancestors) {
    const matches = registered.filter(c => isAt(c, wanted));
    if (matches.length === 1) {
      return matches[0].entity;
    }
    if (matches.length > 1) {
      throw new Error(
        `Multiple Components are registered from a catalog file in ${repoUrl}${
          wanted ? `/${wanted}` : ''
        }: ${listRefs(matches)}. Use --entity to select one.`,
      );
    }
  }

  const declared = (
    await queryComponentsByLocation({
      client,
      token,
      repoUrl,
      annotation: SOURCE_LOCATION,
      parse: parseSourceLocationPath,
    })
  ).filter(c => ancestors.some(wanted => isAt(c, wanted)));
  if (declared.length === 1) {
    const ref = entityRefOf(declared[0].entity);
    warn(
      `Warning: no Component is registered from a catalog file at or above ${location}, so ${ref} was matched by its self-declared ${SOURCE_LOCATION} annotation. Use --entity to select the component explicitly.`,
    );
    return declared[0].entity;
  }
  if (declared.length > 1) {
    throw new Error(
      `No Component is registered from a catalog file at or above ${location}, and multiple Components declare a ${SOURCE_LOCATION} at or above it: ${listRefs(
        declared,
      )}. Use --entity to select one.`,
    );
  }
  throw new Error(
    `No Component registered from a catalog file or with a ${SOURCE_LOCATION} at or above ${location} was found in the catalog. Use --entity to select the component.`,
  );
}

export function readOwnerAndSystem(component: Entity): {
  owner?: string;
  system?: string;
} {
  return {
    owner: relationTargets(component, 'ownedBy')[0],
    system: relationTargets(component, 'partOf').find(ref =>
      isKind(ref, 'system'),
    ),
  };
}

export async function collectAncestorGroups(
  client: CatalogReader,
  token: string,
  startRefs: string[],
): Promise<string[]> {
  const visited = new Set(startRefs.map(r => r.toLocaleLowerCase('en-US')));
  const ancestors: string[] = [];
  let frontier = [...visited].filter(ref => isKind(ref, 'group'));
  while (frontier.length > 0) {
    const entities = await getEntitiesInBatches(client, token, frontier, [
      'kind',
      'metadata.name',
      'metadata.namespace',
      'relations',
    ]);
    const next: string[] = [];
    for (const entity of entities) {
      if (!entity) continue;
      for (const parent of relationTargets(entity, 'childOf')) {
        if (!visited.has(parent)) {
          visited.add(parent);
          ancestors.push(parent);
          next.push(parent);
        }
      }
    }
    frontier = next.filter(ref => isKind(ref, 'group'));
  }
  return ancestors;
}

export function buildSkillQuery(
  scope: SelectionScope,
): FilterPredicate | undefined {
  const matchers: FilterPredicate[] = [];
  if (scope.system) {
    matchers.push({
      relations: { $contains: { type: 'partOf', targetRef: scope.system } },
    });
  }
  // The catalog rejects an empty "$in" array, so only add owners when present.
  if (scope.owners.length > 0) {
    matchers.push({
      relations: {
        $contains: { type: 'ownedBy', targetRef: { $in: scope.owners } },
      },
    });
  }
  if (matchers.length === 0) {
    return undefined;
  }
  return {
    $all: [
      { kind: 'AiResource' },
      { 'spec.type': 'skill' },
      { $any: matchers },
    ],
  };
}

export async function fetchDependencies(
  client: CatalogReader,
  token: string,
  candidates: Entity[],
): Promise<Entity[]> {
  const known = new Set(candidates.map(entityRefOf));
  const fetched: Entity[] = [];
  const initial = new Set<string>();
  for (const candidate of candidates) {
    if (!isSkillAiResourceEntity(candidate)) continue;
    for (const ref of relationTargets(candidate, 'dependsOn')) {
      if (!known.has(ref)) initial.add(ref);
    }
  }
  let pending = [...initial];
  pending.forEach(ref => known.add(ref));
  while (pending.length > 0) {
    const items = await getEntitiesInBatches(client, token, pending);
    const next: string[] = [];
    for (const item of items) {
      if (!item) continue;
      fetched.push(item);
      if (!isSkillAiResourceEntity(item)) continue;
      for (const ref of relationTargets(item, 'dependsOn')) {
        if (!known.has(ref)) {
          known.add(ref);
          next.push(ref);
        }
      }
    }
    pending = next;
  }
  return fetched;
}

export interface ResolveSelectionOptions {
  entity?: string;
  instance?: string;
  agents: string[];
  allowFileSources?: boolean;
}

export interface ResolveSelectionResult {
  context: ResolvedContext;
  agents: string[];
  decisions: SkillDecision[];
}

/** The shared flow behind `ai resolve` and `ai skills sync`. */
export async function resolveSelection(
  options: ResolveSelectionOptions,
): Promise<ResolveSelectionResult> {
  const { baseUrl, accessToken } = await resolveAuth(options.instance);
  const client = createCatalogClient(baseUrl);
  const identity = await fetchIdentity(baseUrl, accessToken);

  const remoteUrl = options.entity ? undefined : await getOriginUrl();
  const repoPrefix = options.entity ? undefined : await getRepoPrefix();
  const component = await findComponent({
    client,
    token: accessToken,
    entity: options.entity,
    remoteUrl,
    repoPrefix,
  });
  const { owner, system } = readOwnerAndSystem(component);

  const ownershipRefs = identity.ent.map(r => r.toLocaleLowerCase('en-US'));
  const groupRefs = ownershipRefs.filter(ref => isKind(ref, 'group'));
  const ancestorGroupRefs = await collectAncestorGroups(client, accessToken, [
    ...groupRefs,
    ...(owner ? [owner] : []),
  ]);

  const owners = [
    ...new Set([
      ...(owner ? [owner] : []),
      ...ownershipRefs,
      ...ancestorGroupRefs,
    ]),
  ];
  const scope: SelectionScope = { system, owners };

  const query = buildSkillQuery(scope);
  const candidates = query
    ? await queryAllEntities(client, { query }, accessToken)
    : [];
  const dependencies = await fetchDependencies(client, accessToken, candidates);

  const decisions = selectSkills({
    candidates,
    dependencies,
    scope,
    agents: options.agents,
    allowFileSources: options.allowFileSources,
  });

  return {
    context: {
      user: identity.sub,
      ownershipRefs,
      componentRef: entityRefOf(component),
      owner,
      system,
      groupRefs,
      ancestorGroupRefs,
    },
    agents: options.agents,
    decisions,
  };
}
