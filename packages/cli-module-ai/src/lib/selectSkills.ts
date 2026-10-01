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
import { isSkillAiResourceEntity } from '@backstage/catalog-model/alpha';
import { parseSkillSource, type SkillSource } from './skillSource';

const SOURCE_LOCATION_ANNOTATION = 'backstage.io/source-location';

/** The component context that decides which skills apply. */
export interface SelectionScope {
  /** Normalized ref of the component's system, if any. */
  system?: string;
  /** Component owner, the user's ownership refs, and all ancestor groups. */
  owners: string[];
}

export interface SkillDecision {
  ref: string;
  name: string;
  status: 'selected' | 'skipped';
  via: 'scope' | 'dependency';
  reason: string;
  /** Only set when the skill is selected. */
  source?: SkillSource;
}

export interface SelectSkillsInput {
  /** Skills returned by the scope query. */
  candidates: Entity[];
  /** Entities fetched because a skill depends on them. */
  dependencies: Entity[];
  scope: SelectionScope;
  /** Target `skills` agent IDs. */
  agents: string[];
}

export function entityRefOf(entity: Entity): string {
  return stringifyEntityRef(entity);
}

export function relationTargets(entity: Entity, type: string): string[] {
  return (entity.relations ?? [])
    .filter(relation => relation.type === type)
    .map(relation => relation.targetRef.toLocaleLowerCase('en-US'));
}

function scopeReason(
  entity: Entity,
  scope: SelectionScope,
): string | undefined {
  const system = scope.system?.toLocaleLowerCase('en-US');
  if (system && relationTargets(entity, 'partOf').includes(system)) {
    return `part of ${system}`;
  }
  const owners = new Set(scope.owners.map(o => o.toLocaleLowerCase('en-US')));
  const owner = relationTargets(entity, 'ownedBy').find(o => owners.has(o));
  return owner ? `owned by ${owner}` : undefined;
}

/**
 * Applies the scope, agent and installable rules to skill entities and expands
 * `dependsOn` transitively. Pure: all catalog data is passed in.
 */
export function selectSkills(input: SelectSkillsInput): SkillDecision[] {
  const pool = new Map<string, Entity>();
  for (const entity of [...input.candidates, ...input.dependencies]) {
    pool.set(entityRefOf(entity), entity);
  }
  const decisions = new Map<string, SkillDecision>();
  const queue: Array<{ ref: string; parent: string }> = [];
  const enqueued = new Set<string>();

  const enqueueDependencies = (entity: Entity) => {
    const parent = entityRefOf(entity);
    for (const ref of relationTargets(entity, 'dependsOn')) {
      if (!enqueued.has(ref)) {
        enqueued.add(ref);
        queue.push({ ref, parent });
      }
    }
  };

  const evaluate = (
    entity: Entity,
    via: SkillDecision['via'],
    selectedReason: string,
  ): SkillDecision => {
    const ref = entityRefOf(entity);
    const name = entity.metadata.name;
    const skipped = (reason: string): SkillDecision => ({
      ref,
      name,
      status: 'skipped',
      via,
      reason,
    });

    const agents = isSkillAiResourceEntity(entity) ? entity.spec.agents : [];
    if (agents && agents.length > 0) {
      if (!agents.some(agent => input.agents.includes(agent))) {
        return skipped(
          `supports agents [${agents.join(', ')}], not [${input.agents.join(
            ', ',
          )}]`,
        );
      }
    }

    const parsed = parseSkillSource(
      entity.metadata.annotations?.[SOURCE_LOCATION_ANNOTATION],
    );
    if (!parsed.ok) {
      return skipped(`not installable: ${parsed.reason}`);
    }

    return {
      ref,
      name,
      status: 'selected',
      via,
      reason: selectedReason,
      source: parsed.source,
    };
  };

  for (const entity of input.candidates) {
    const ref = entityRefOf(entity);
    const reason = scopeReason(entity, input.scope);
    if (!reason) {
      decisions.set(ref, {
        ref,
        name: entity.metadata.name,
        status: 'skipped',
        via: 'scope',
        reason: 'outside the component scope',
      });
      continue;
    }
    const decision = evaluate(entity, 'scope', reason);
    decisions.set(ref, decision);
    if (decision.status === 'selected') {
      enqueueDependencies(entity);
    }
  }

  while (queue.length > 0) {
    const { ref, parent } = queue.shift()!;
    if (decisions.get(ref)?.status === 'selected') {
      continue;
    }
    const entity = pool.get(ref);
    if (!entity) {
      decisions.set(ref, {
        ref,
        name: ref,
        status: 'skipped',
        via: 'dependency',
        reason: `dependency of ${parent} not found in the catalog`,
      });
      continue;
    }
    if (!isSkillAiResourceEntity(entity)) {
      decisions.set(ref, {
        ref,
        name: entity.metadata.name,
        status: 'skipped',
        via: 'dependency',
        reason: `dependency of ${parent} is not a skill`,
      });
      continue;
    }
    const decision = evaluate(entity, 'dependency', `dependency of ${parent}`);
    decisions.set(ref, decision);
    if (decision.status === 'selected') {
      enqueueDependencies(entity);
    }
  }

  return [...decisions.values()].sort((a, b) => a.ref.localeCompare(b.ref));
}
