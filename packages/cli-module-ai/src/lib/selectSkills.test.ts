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

import type { Entity } from '@backstage/catalog-model';
import { selectSkills } from './selectSkills';

function skill(
  name: string,
  opts: {
    owner?: string;
    system?: string;
    agents?: string[];
    dependsOn?: string[];
    source?: string | null;
    type?: string;
  } = {},
): Entity {
  const relations: Entity['relations'] = [];
  if (opts.owner) relations.push({ type: 'ownedBy', targetRef: opts.owner });
  if (opts.system) relations.push({ type: 'partOf', targetRef: opts.system });
  for (const dep of opts.dependsOn ?? []) {
    relations.push({ type: 'dependsOn', targetRef: dep });
  }
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'AiResource',
    metadata: {
      name,
      namespace: 'default',
      annotations:
        opts.source === null
          ? {}
          : {
              'backstage.io/source-location':
                opts.source ??
                `url:https://github.com/acme/skills/tree/main/skills/${name}`,
            },
    },
    spec: {
      type: opts.type ?? 'skill',
      lifecycle: 'production',
      owner: 'group:default/x',
      ...(opts.agents ? { agents: opts.agents } : {}),
    },
    relations,
  };
}

const ref = (name: string) => `airesource:default/${name}`;
const scope = {
  system: 'system:default/payments',
  owners: [
    'group:default/team-a',
    'user:default/jane',
    'group:default/platform',
  ],
};
const byRef = (decisions: ReturnType<typeof selectSkills>) =>
  Object.fromEntries(decisions.map(d => [d.ref, d]));

describe('selectSkills', () => {
  it('selects by system, owner, user and ancestor group, and skips everything else', () => {
    const result = selectSkills({
      candidates: [
        skill('sys-skill', { system: 'system:default/payments' }),
        skill('owner-skill', { owner: 'group:default/team-a' }),
        skill('user-skill', { owner: 'user:default/jane' }),
        skill('ancestor-skill', { owner: 'group:default/platform' }),
        skill('other-skill', {
          owner: 'group:default/other',
          system: 'system:default/billing',
        }),
      ],
      dependencies: [],
      scope,
      agents: ['claude-code'],
    });
    expect(result.map(d => [d.ref, d.status])).toEqual([
      [ref('ancestor-skill'), 'selected'],
      [ref('other-skill'), 'skipped'],
      [ref('owner-skill'), 'selected'],
      [ref('sys-skill'), 'selected'],
      [ref('user-skill'), 'selected'],
    ]);
    const d = byRef(result);
    expect(d[ref('sys-skill')].reason).toBe('part of system:default/payments');
    expect(d[ref('owner-skill')].reason).toBe('owned by group:default/team-a');
    expect(d[ref('other-skill')].reason).toMatch(/outside the component scope/);
    expect(d[ref('sys-skill')].source?.installUrl).toBe(
      'https://github.com/acme/skills/tree/main/skills/sys-skill',
    );
  });

  it('filters by agent: absent or empty agents match everything', () => {
    const owner = 'group:default/team-a';
    const result = byRef(
      selectSkills({
        candidates: [
          skill('any', { owner }),
          skill('empty', { owner, agents: [] }),
          skill('cc', { owner, agents: ['claude-code', 'codex'] }),
          skill('cursor-only', { owner, agents: ['cursor'] }),
        ],
        dependencies: [],
        scope,
        agents: ['claude-code'],
      }),
    );
    expect(result[ref('any')].status).toBe('selected');
    expect(result[ref('empty')].status).toBe('selected');
    expect(result[ref('cc')].status).toBe('selected');
    expect(result[ref('cursor-only')].status).toBe('skipped');
    expect(result[ref('cursor-only')].reason).toMatch(/cursor.*claude-code/);
  });

  it('expands dependencies transitively, tolerates cycles, and reports bad dependencies', () => {
    const owner = 'group:default/team-a';
    const outside = 'group:default/other';
    const result = byRef(
      selectSkills({
        candidates: [
          skill('a', { owner, dependsOn: [ref('b')] }),
          // Also a query candidate, but outside scope: reached as a dependency of a.
          skill('b', { owner: outside, dependsOn: [ref('c')] }),
          skill('d', { owner, dependsOn: [ref('ghost'), ref('rule-r')] }),
          skill('f', { owner, dependsOn: [ref('g')] }),
        ],
        dependencies: [
          skill('c', { owner: outside, dependsOn: [ref('a')] }),
          skill('rule-r', { owner: outside, type: 'rule' }),
          skill('g', { owner: outside, agents: ['cursor'] }),
        ],
        scope,
        agents: ['claude-code'],
      }),
    );
    expect(result[ref('a')]).toMatchObject({
      status: 'selected',
      via: 'scope',
    });
    expect(result[ref('b')]).toMatchObject({
      status: 'selected',
      via: 'dependency',
      reason: `dependency of ${ref('a')}`,
    });
    expect(result[ref('c')]).toMatchObject({
      status: 'selected',
      via: 'dependency',
    });
    expect(result[ref('ghost')]).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/not found/),
    });
    expect(result[ref('rule-r')]).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/not a skill/),
    });
    expect(result[ref('g')]).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/cursor/),
    });
    expect(Object.keys(result)).toHaveLength(8);
  });

  it('skips skills without an installable source and installs a skill whose directory name differs from its entity name', () => {
    const owner = 'group:default/team-a';
    const result = byRef(
      selectSkills({
        candidates: [
          skill('no-source', { owner, source: null }),
          skill('repo-root', {
            owner,
            source: 'url:https://github.com/acme/skills',
          }),
          skill('bad-ref', {
            owner,
            source: 'url:https://github.com/acme/skills/tree/feature%2Fx/s',
          }),
          skill('my-skill', {
            owner,
            source: 'url:https://github.com/acme/skills/tree/main/x/other-dir',
          }),
        ],
        dependencies: [],
        scope,
        agents: ['claude-code'],
      }),
    );
    expect(result[ref('no-source')]).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/source-location/),
    });
    expect(result[ref('repo-root')]).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/tree URL/),
    });
    expect(result[ref('bad-ref')]).toMatchObject({
      status: 'skipped',
      reason: expect.stringMatching(/contains "\/"/),
    });
    // skills names the installed skill from SKILL.md, so the directory name is irrelevant.
    expect(result[ref('my-skill')]).toMatchObject({
      status: 'selected',
      source: {
        installUrl: 'https://github.com/acme/skills/tree/main/x/other-dir',
      },
    });
  });
});
