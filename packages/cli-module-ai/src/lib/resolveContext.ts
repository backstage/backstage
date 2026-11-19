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
import type { FilterPredicate } from '@backstage/filter-predicates';
import {
  createCatalogClient,
  getEntitiesInBatches,
  queryAllEntities,
  type CatalogReader,
} from './catalogClient';
import {
  defaultComponentResolvers,
  type ComponentResolver,
} from './componentResolvers';
import { fetchIdentity } from './identity';
import { resolveAuth } from './resolveAuth';
import {
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

/** Group hierarchy levels followed before the ancestor lookup stops. */
export const MAX_GROUP_DEPTH = 20;

const isKind = (ref: string, kind: string) =>
  parseEntityRef(ref).kind.toLocaleLowerCase('en-US') === kind;

/**
 * Finds the component to resolve against. With an explicit entity, that
 * entity is fetched. Otherwise the resolvers are tried in order, and the first
 * one that finds a component wins. By default these look at the current folder
 * in the git remote repository, see {@link defaultComponentResolvers}. If
 * several components match, the lookup fails and asks for an explicit entity.
 */
export async function findComponent(options: {
  client: CatalogReader;
  entity?: string;
  resolvers?: ComponentResolver[];
}): Promise<Entity> {
  const { client } = options;
  if (options.entity) {
    const refString = stringifyEntityRef(
      parseEntityRef(options.entity, {
        defaultKind: 'Component',
        defaultNamespace: 'default',
      }),
    );
    const entity = await client.getEntityByRef(refString);
    if (!entity) {
      throw new Error(`Entity ${refString} was not found in the catalog`);
    }
    return entity;
  }
  const resolvers = options.resolvers ?? defaultComponentResolvers;
  for (const resolver of resolvers) {
    const entity = await resolver.resolve({
      cwd: process.cwd(),
      catalog: client,
    });
    if (entity) {
      return entity;
    }
  }
  throw new Error(
    `No Component found: looked for ${resolvers
      .map(r => r.description)
      .join(' or ')}. Use --entity to select the component.`,
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
  startRefs: string[],
): Promise<string[]> {
  const visited = new Set(startRefs.map(r => r.toLocaleLowerCase('en-US')));
  const ancestors: string[] = [];
  let frontier = [...visited].filter(ref => isKind(ref, 'group'));
  for (let depth = 0; depth < MAX_GROUP_DEPTH && frontier.length > 0; depth++) {
    const entities = await getEntitiesInBatches(client, frontier, [
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
  candidates: Entity[],
): Promise<Entity[]> {
  const known = new Set(candidates.map(stringifyEntityRef));
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
    const items = await getEntitiesInBatches(client, pending);
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
  const client = createCatalogClient(baseUrl, accessToken);
  const identity = await fetchIdentity(baseUrl, accessToken);

  const component = await findComponent({
    client,
    entity: options.entity,
  });
  const { owner, system } = readOwnerAndSystem(component);

  const ownershipRefs = identity.ent.map(r => r.toLocaleLowerCase('en-US'));
  const groupRefs = ownershipRefs.filter(ref => isKind(ref, 'group'));
  const ancestorGroupRefs = await collectAncestorGroups(client, [
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
  const candidates = query ? await queryAllEntities(client, { query }) : [];
  const dependencies = await fetchDependencies(client, candidates);

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
      componentRef: stringifyEntityRef(component),
      owner,
      system,
      groupRefs,
      ancestorGroupRefs,
    },
    agents: options.agents,
    decisions,
  };
}
