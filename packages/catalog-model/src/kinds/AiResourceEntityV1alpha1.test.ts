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

import type { Entity } from '../entity/Entity';
import { compileCatalogModel } from '../model/compileCatalogModel';
import { defaultCatalogEntityModel } from '../model/defaultCatalogEntityModel';
import {
  type AiResourceEntityV1alpha1Default,
  type SkillAiResourceEntityV1alpha1,
  type RuleAiResourceEntityV1alpha1,
  type PluginAiResourceEntityV1alpha1,
  type MarketplaceAiResourceEntityV1alpha1,
  aiResourceEntityModel,
  aiResourceEntityV1alpha1Validator as defaultValidator,
  skillAiResourceEntityV1alpha1Validator as skillValidator,
  ruleAiResourceEntityV1alpha1Validator as ruleValidator,
  pluginAiResourceEntityV1alpha1Validator as pluginValidator,
  marketplaceAiResourceEntityV1alpha1Validator as marketplaceValidator,
  isAiResourceEntity,
  isSkillAiResourceEntity,
  isRuleAiResourceEntity,
  isPluginAiResourceEntity,
  isMarketplaceAiResourceEntity,
  RELATION_HAS_SKILL,
  RELATION_SKILL_OF,
  RELATION_HAS_PLUGIN,
  RELATION_PLUGIN_OF,
} from './AiResourceEntityV1alpha1';

describe('AiResourceV1alpha1 default validator', () => {
  let entity: AiResourceEntityV1alpha1Default;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: {
        name: 'internal-design-system',
      },
      spec: {
        type: 'rule',
        lifecycle: 'production',
        owner: 'frontend-platform',
        system: 'ai-tooling',
      },
    };
  });

  it('accepts valid data', async () => {
    await expect(defaultValidator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(defaultValidator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(defaultValidator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(defaultValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects wrong lifecycle', async () => {
    (entity as any).spec.lifecycle = 7;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects empty lifecycle', async () => {
    (entity as any).spec.lifecycle = '';
    await expect(defaultValidator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong owner', async () => {
    (entity as any).spec.owner = 7;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(defaultValidator.check(entity)).rejects.toThrow(/owner/);
  });

  it('accepts missing system', async () => {
    delete (entity as any).spec.system;
    await expect(defaultValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong system', async () => {
    (entity as any).spec.system = 7;
    await expect(defaultValidator.check(entity)).rejects.toThrow(/system/);
  });

  it('rejects empty system', async () => {
    (entity as any).spec.system = '';
    await expect(defaultValidator.check(entity)).rejects.toThrow(/system/);
  });
});

describe('AiResourceV1alpha1 skill validator', () => {
  let entity: SkillAiResourceEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: {
        name: 'frontend-design',
      },
      spec: {
        type: 'skill',
        lifecycle: 'production',
        owner: 'ai-platform-team',
        system: 'ai-tooling',
        disciplines: ['web', 'backend'],
        categories: ['framework'],
        agents: ['claude-code'],
        dependsOn: ['airesource:default/base-coding-standards'],
      },
    };
  });

  it('accepts valid skill data with all fields', async () => {
    await expect(skillValidator.check(entity)).resolves.toBe(true);
  });

  it('accepts skill with only required fields', async () => {
    entity.spec = {
      type: 'skill',
      lifecycle: 'experimental',
      owner: 'team-a',
    };
    await expect(skillValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects non-skill type', async () => {
    (entity as any).spec.type = 'rule';
    await expect(skillValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(skillValidator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(skillValidator.check(entity)).rejects.toThrow(/owner/);
  });

  it('accepts missing optional fields', async () => {
    delete (entity as any).spec.system;
    delete (entity as any).spec.disciplines;
    delete (entity as any).spec.categories;
    delete (entity as any).spec.agents;
    delete (entity as any).spec.dependsOn;
    await expect(skillValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects disciplines with empty strings', async () => {
    (entity as any).spec.disciplines = [''];
    await expect(skillValidator.check(entity)).rejects.toThrow(/disciplines/);
  });

  it('rejects categories with wrong type', async () => {
    (entity as any).spec.categories = 'not-an-array';
    await expect(skillValidator.check(entity)).rejects.toThrow(/categories/);
  });

  it('rejects agents with wrong item type', async () => {
    (entity as any).spec.agents = [42];
    await expect(skillValidator.check(entity)).rejects.toThrow(/agents/);
  });

  it('rejects dependsOn with empty strings', async () => {
    (entity as any).spec.dependsOn = [''];
    await expect(skillValidator.check(entity)).rejects.toThrow(/dependsOn/);
  });

  it('accepts valid allowedTools', async () => {
    entity.spec = {
      type: 'skill',
      lifecycle: 'production',
      owner: 'team-a',
      allowedTools: 'Bash(git:*) Bash(jq:*) Read',
    };
    await expect(skillValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty allowedTools', async () => {
    (entity as any).spec.allowedTools = '';
    await expect(skillValidator.check(entity)).rejects.toThrow(/allowedTools/);
  });

  it('rejects allowedTools with wrong type', async () => {
    (entity as any).spec.allowedTools = ['Read', 'Write'];
    await expect(skillValidator.check(entity)).rejects.toThrow(/allowedTools/);
  });

  it('accepts valid license', async () => {
    entity.spec = {
      type: 'skill',
      lifecycle: 'production',
      owner: 'team-a',
      license: 'Apache-2.0',
    };
    await expect(skillValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty license', async () => {
    (entity as any).spec.license = '';
    await expect(skillValidator.check(entity)).rejects.toThrow(/license/);
  });

  it('rejects wrong license type', async () => {
    (entity as any).spec.license = 42;
    await expect(skillValidator.check(entity)).rejects.toThrow(/license/);
  });

  it('accepts valid compatibility', async () => {
    entity.spec = {
      type: 'skill',
      lifecycle: 'production',
      owner: 'team-a',
      compatibility: 'Node.js 20+, macOS/Linux',
    };
    await expect(skillValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty compatibility', async () => {
    (entity as any).spec.compatibility = '';
    await expect(skillValidator.check(entity)).rejects.toThrow(/compatibility/);
  });

  it('rejects compatibility longer than 500 characters', async () => {
    (entity as any).spec.compatibility = 'a'.repeat(501);
    await expect(skillValidator.check(entity)).rejects.toThrow(/compatibility/);
  });

  it('rejects wrong compatibility type', async () => {
    (entity as any).spec.compatibility = 42;
    await expect(skillValidator.check(entity)).rejects.toThrow(/compatibility/);
  });
});

describe('AiResourceV1alpha1 rule validator', () => {
  let entity: RuleAiResourceEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: {
        name: 'use-internal-apis',
      },
      spec: {
        type: 'rule',
        lifecycle: 'production',
        owner: 'frontend-platform',
        disciplines: ['web', 'backend'],
        category: 'architecture',
        rationale: 'Ensures consistent error handling across all service calls',
      },
    };
  });

  it('accepts valid rule data with all fields', async () => {
    await expect(ruleValidator.check(entity)).resolves.toBe(true);
  });

  it('accepts rule with only required fields', async () => {
    entity.spec = {
      type: 'rule',
      lifecycle: 'production',
      owner: 'team-a',
      category: 'security',
      rationale: 'Prevents credential leaks',
    };
    await expect(ruleValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects non-rule type', async () => {
    (entity as any).spec.type = 'skill';
    await expect(ruleValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing category', async () => {
    delete (entity as any).spec.category;
    await expect(ruleValidator.check(entity)).rejects.toThrow(/category/);
  });

  it('rejects empty category', async () => {
    (entity as any).spec.category = '';
    await expect(ruleValidator.check(entity)).rejects.toThrow(/category/);
  });

  it('rejects missing rationale', async () => {
    delete (entity as any).spec.rationale;
    await expect(ruleValidator.check(entity)).rejects.toThrow(/rationale/);
  });

  it('rejects empty rationale', async () => {
    (entity as any).spec.rationale = '';
    await expect(ruleValidator.check(entity)).rejects.toThrow(/rationale/);
  });

  it('accepts missing optional fields', async () => {
    delete (entity as any).spec.system;
    delete (entity as any).spec.disciplines;
    await expect(ruleValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects disciplines with empty strings', async () => {
    (entity as any).spec.disciplines = [''];
    await expect(ruleValidator.check(entity)).rejects.toThrow(/disciplines/);
  });
});

describe('isAiResourceEntity', () => {
  it('returns true when apiVersion and kind match', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
    };
    expect(isAiResourceEntity(entity)).toBe(true);
  });

  it('returns false for a different kind', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
    };
    expect(isAiResourceEntity(entity)).toBe(false);
  });

  it('returns false for a different apiVersion', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'AiResource',
      metadata: { name: 'test' },
    };
    expect(isAiResourceEntity(entity)).toBe(false);
  });
});

describe('isSkillAiResourceEntity', () => {
  it('returns true for a skill AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'skill' },
    };
    expect(isSkillAiResourceEntity(entity)).toBe(true);
  });

  it('returns false for a non-skill AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'rule' },
    };
    expect(isSkillAiResourceEntity(entity)).toBe(false);
  });

  it('returns false for a different kind', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
      spec: { type: 'skill' },
    };
    expect(isSkillAiResourceEntity(entity)).toBe(false);
  });
});

describe('isRuleAiResourceEntity', () => {
  it('returns true for a rule AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'rule' },
    };
    expect(isRuleAiResourceEntity(entity)).toBe(true);
  });

  it('returns false for a non-rule AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'skill' },
    };
    expect(isRuleAiResourceEntity(entity)).toBe(false);
  });
});

describe('aiResourceEntityModel', () => {
  it('declares and restricts all existing relation fields', () => {
    const model = compileCatalogModel([
      defaultCatalogEntityModel,
      aiResourceEntityModel,
    ]);
    const skill = model.getKind({
      kind: 'AiResource',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'skill' },
    });

    expect(skill?.relationFields).toEqual([
      expect.objectContaining({
        path: 'spec.owner',
        relation: 'ownedBy',
        allowedKinds: ['Group', 'User'],
      }),
      expect.objectContaining({
        path: 'spec.system',
        relation: 'partOf',
        allowedKinds: ['System'],
      }),
      expect.objectContaining({
        path: 'spec.dependsOn',
        relation: 'dependsOn',
        allowedKinds: ['AiResource'],
      }),
    ]);

    const relations = model.getRelations({ kind: 'AiResource' });
    expect(relations?.find(r => r.forward.type === 'ownedBy')?.toKind).toEqual([
      'Group',
      'User',
    ]);
    expect(relations?.find(r => r.forward.type === 'partOf')?.toKind).toEqual([
      'System',
    ]);
    expect(
      relations?.find(r => r.forward.type === 'dependsOn')?.toKind,
    ).toEqual(['AiResource']);

    expect(
      model
        .getRelations({ kind: 'System' })
        ?.find(r => r.forward.type === 'hasPart')?.toKind,
    ).toContain('AiResource');
    expect(
      model
        .getRelations({ kind: 'AiResource' })
        ?.find(r => r.forward.type === 'dependencyOf')?.toKind,
    ).toEqual(['AiResource']);

    const plugin = model.getKind({
      kind: 'AiResource',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'plugin' },
    });
    expect(plugin?.relationFields).toContainEqual(
      expect.objectContaining({
        path: 'spec.skills',
        relation: RELATION_HAS_SKILL,
        allowedKinds: ['AiResource'],
      }),
    );

    const marketplace = model.getKind({
      kind: 'AiResource',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'marketplace' },
    });
    expect(marketplace?.relationFields).toContainEqual(
      expect.objectContaining({
        path: 'spec.plugins',
        relation: RELATION_HAS_PLUGIN,
        allowedKinds: ['AiResource'],
      }),
    );

    expect(
      relations?.find(r => r.forward.type === RELATION_HAS_SKILL)?.toKind,
    ).toEqual(['AiResource']);
    expect(
      relations?.find(r => r.forward.type === RELATION_SKILL_OF)?.toKind,
    ).toEqual(['AiResource']);
    expect(
      relations?.find(r => r.forward.type === RELATION_HAS_PLUGIN)?.toKind,
    ).toEqual(['AiResource']);
    expect(
      relations?.find(r => r.forward.type === RELATION_PLUGIN_OF)?.toKind,
    ).toEqual(['AiResource']);
  });
});

describe('AiResourceV1alpha1 plugin validator', () => {
  let entity: PluginAiResourceEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: {
        name: 'code-review-plugin',
      },
      spec: {
        type: 'plugin',
        lifecycle: 'production',
        owner: 'ai-platform-team',
        system: 'ai-tooling',
        skills: ['airesource:default/typescript-best-practices'],
        version: '1.0.0',
      },
    };
  });

  it('accepts valid plugin data with all fields', async () => {
    await expect(pluginValidator.check(entity)).resolves.toBe(true);
  });

  it('accepts plugin with only required fields', async () => {
    entity.spec = {
      type: 'plugin',
      lifecycle: 'production',
      owner: 'team-a',
      skills: ['airesource:default/some-skill'],
    };
    await expect(pluginValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects non-plugin type', async () => {
    (entity as any).spec.type = 'skill';
    await expect(pluginValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(pluginValidator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(pluginValidator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects missing skills', async () => {
    delete (entity as any).spec.skills;
    await expect(pluginValidator.check(entity)).rejects.toThrow(/skills/);
  });

  it('accepts empty skills array', async () => {
    entity.spec.skills = [];
    await expect(pluginValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects skills with empty strings', async () => {
    (entity as any).spec.skills = [''];
    await expect(pluginValidator.check(entity)).rejects.toThrow(/skills/);
  });

  it('rejects skills with wrong type', async () => {
    (entity as any).spec.skills = 'not-an-array';
    await expect(pluginValidator.check(entity)).rejects.toThrow(/skills/);
  });

  it('rejects skills with wrong item type', async () => {
    (entity as any).spec.skills = [42];
    await expect(pluginValidator.check(entity)).rejects.toThrow(/skills/);
  });

  it('accepts missing optional fields', async () => {
    delete (entity as any).spec.system;
    delete (entity as any).spec.version;
    await expect(pluginValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty version', async () => {
    (entity as any).spec.version = '';
    await expect(pluginValidator.check(entity)).rejects.toThrow(/version/);
  });

  it('rejects wrong version type', async () => {
    (entity as any).spec.version = 42;
    await expect(pluginValidator.check(entity)).rejects.toThrow(/version/);
  });
});

describe('AiResourceV1alpha1 marketplace validator', () => {
  let entity: MarketplaceAiResourceEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: {
        name: 'company-ai-tools',
      },
      spec: {
        type: 'marketplace',
        lifecycle: 'production',
        owner: 'ai-platform-team',
        system: 'ai-tooling',
        plugins: ['airesource:default/code-review-plugin'],
        version: '1.0.0',
      },
    };
  });

  it('accepts valid marketplace data with all fields', async () => {
    await expect(marketplaceValidator.check(entity)).resolves.toBe(true);
  });

  it('accepts marketplace with only required fields', async () => {
    entity.spec = {
      type: 'marketplace',
      lifecycle: 'production',
      owner: 'team-a',
      plugins: ['airesource:default/some-plugin'],
    };
    await expect(marketplaceValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects non-marketplace type', async () => {
    (entity as any).spec.type = 'skill';
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(
      /lifecycle/,
    );
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects missing plugins', async () => {
    delete (entity as any).spec.plugins;
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/plugins/);
  });

  it('accepts empty plugins array', async () => {
    entity.spec.plugins = [];
    await expect(marketplaceValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects plugins with empty strings', async () => {
    (entity as any).spec.plugins = [''];
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/plugins/);
  });

  it('rejects plugins with wrong type', async () => {
    (entity as any).spec.plugins = 'not-an-array';
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/plugins/);
  });

  it('rejects plugins with wrong item type', async () => {
    (entity as any).spec.plugins = [42];
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/plugins/);
  });

  it('accepts missing optional fields', async () => {
    delete (entity as any).spec.system;
    delete (entity as any).spec.version;
    await expect(marketplaceValidator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty version', async () => {
    (entity as any).spec.version = '';
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/version/);
  });

  it('rejects wrong version type', async () => {
    (entity as any).spec.version = 42;
    await expect(marketplaceValidator.check(entity)).rejects.toThrow(/version/);
  });
});

describe('isPluginAiResourceEntity', () => {
  it('returns true for a plugin AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'plugin' },
    };
    expect(isPluginAiResourceEntity(entity)).toBe(true);
  });

  it('returns false for a non-plugin AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'skill' },
    };
    expect(isPluginAiResourceEntity(entity)).toBe(false);
  });

  it('returns false for a different kind', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
      spec: { type: 'plugin' },
    };
    expect(isPluginAiResourceEntity(entity)).toBe(false);
  });
});

describe('isMarketplaceAiResourceEntity', () => {
  it('returns true for a marketplace AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'marketplace' },
    };
    expect(isMarketplaceAiResourceEntity(entity)).toBe(true);
  });

  it('returns false for a non-marketplace AiResource', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'AiResource',
      metadata: { name: 'test' },
      spec: { type: 'skill' },
    };
    expect(isMarketplaceAiResourceEntity(entity)).toBe(false);
  });

  it('returns false for a different kind', () => {
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'test' },
      spec: { type: 'marketplace' },
    };
    expect(isMarketplaceAiResourceEntity(entity)).toBe(false);
  });
});
