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

import { createCatalogModelLayer } from '../model/createCatalogModelLayer';
import type { Entity } from '../entity/Entity';
import { entityKindSchemaValidator } from '../validation';
import type { KindValidator } from './types';
import type { JsonObject } from '@backstage/types';
import defaultJsonSchema from '../schema/kinds/AiResource.v1alpha1.schema.json';
import skillJsonSchema from '../schema/kinds/AiResource.v1alpha1.skill.schema.json';
import ruleJsonSchema from '../schema/kinds/AiResource.v1alpha1.rule.schema.json';
import pluginJsonSchema from '../schema/kinds/AiResource.v1alpha1.plugin.schema.json';
import marketplaceJsonSchema from '../schema/kinds/AiResource.v1alpha1.marketplace.schema.json';

/**
 * Default AiResource entity for types that don't have a structured spec.
 *
 * @remarks
 *
 * The actual content of skills and rules is not stored in the entity spec.
 * Instead, the source file is referenced via the standard
 * `backstage.io/source-location` annotation, consistent with how other
 * Backstage entities reference their source files.
 *
 * @alpha
 */
export interface AiResourceEntityV1alpha1Default extends Entity {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'AiResource';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    system?: string;
  };
}

/**
 * AiResource entity with spec.type 'skill'. Represents reusable contextual
 * knowledge consumed by AI coding tools.
 *
 * @alpha
 */
export interface SkillAiResourceEntityV1alpha1
  extends AiResourceEntityV1alpha1Default {
  spec: {
    type: 'skill';
    lifecycle: string;
    owner: string;
    system?: string;
    disciplines?: string[];
    categories?: string[];
    agents?: string[];
    dependsOn?: string[];
    allowedTools?: string;
    license?: string;
    compatibility?: string;
  };
}

/**
 * AiResource entity with spec.type 'rule'. Represents a governance rule
 * or constraint for AI coding tools.
 *
 * @alpha
 */
export interface RuleAiResourceEntityV1alpha1
  extends AiResourceEntityV1alpha1Default {
  spec: {
    type: 'rule';
    lifecycle: string;
    owner: string;
    system?: string;
    disciplines?: string[];
    category: string;
    rationale: string;
  };
}

/**
 * AiResource entity with spec.type 'plugin'. Represents a packaged collection
 * of skills distributed as a unit.
 *
 * @alpha
 */
export interface PluginAiResourceEntityV1alpha1
  extends AiResourceEntityV1alpha1Default {
  spec: {
    type: 'plugin';
    lifecycle: string;
    owner: string;
    system?: string;
    skills: string[];
    version?: string;
  };
}

/**
 * AiResource entity with spec.type 'marketplace'. Represents a curated
 * registry of plugins for discovery and distribution.
 *
 * @alpha
 */
export interface MarketplaceAiResourceEntityV1alpha1
  extends AiResourceEntityV1alpha1Default {
  spec: {
    type: 'marketplace';
    lifecycle: string;
    owner: string;
    system?: string;
    plugins: string[];
    version?: string;
  };
}

/**
 * Backstage catalog AiResource kind Entity. Represents contextual information
 * consumed by AI coding tools, such as skills and rules.
 *
 * @alpha
 */
export type AiResourceEntityV1alpha1 =
  | AiResourceEntityV1alpha1Default
  | SkillAiResourceEntityV1alpha1
  | RuleAiResourceEntityV1alpha1
  | PluginAiResourceEntityV1alpha1
  | MarketplaceAiResourceEntityV1alpha1;

const defaultValidator = entityKindSchemaValidator(defaultJsonSchema);

/**
 * Entity data validator for the default {@link AiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const aiResourceEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return defaultValidator(data) === data;
  },
};

const skillValidator = entityKindSchemaValidator(skillJsonSchema);

/**
 * Entity data validator for {@link SkillAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const skillAiResourceEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return skillValidator(data) === data;
  },
};

/**
 * Type guard for {@link AiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const isAiResourceEntity = (
  entity: Entity,
): entity is AiResourceEntityV1alpha1 =>
  entity.apiVersion === 'backstage.io/v1alpha1' && entity.kind === 'AiResource';

/**
 * Type guard for {@link SkillAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const isSkillAiResourceEntity = (
  entity: Entity,
): entity is SkillAiResourceEntityV1alpha1 =>
  isAiResourceEntity(entity) && entity.spec?.type === 'skill';

/**
 * Type guard for {@link RuleAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const isRuleAiResourceEntity = (
  entity: Entity,
): entity is RuleAiResourceEntityV1alpha1 =>
  isAiResourceEntity(entity) && entity.spec?.type === 'rule';

/**
 * Type guard for {@link PluginAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const isPluginAiResourceEntity = (
  entity: Entity,
): entity is PluginAiResourceEntityV1alpha1 =>
  isAiResourceEntity(entity) && entity.spec?.type === 'plugin';

/**
 * Type guard for {@link MarketplaceAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const isMarketplaceAiResourceEntity = (
  entity: Entity,
): entity is MarketplaceAiResourceEntityV1alpha1 =>
  isAiResourceEntity(entity) && entity.spec?.type === 'marketplace';

const ruleValidator = entityKindSchemaValidator(ruleJsonSchema);

/**
 * Entity data validator for {@link RuleAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const ruleAiResourceEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return ruleValidator(data) === data;
  },
};

const pluginValidator = entityKindSchemaValidator(pluginJsonSchema);

/**
 * Entity data validator for {@link PluginAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const pluginAiResourceEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return pluginValidator(data) === data;
  },
};

const marketplaceValidator = entityKindSchemaValidator(marketplaceJsonSchema);

/**
 * Entity data validator for {@link MarketplaceAiResourceEntityV1alpha1}.
 *
 * @alpha
 */
export const marketplaceAiResourceEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return marketplaceValidator(data) === data;
  },
};

/**
 * A relation from an AI plugin to one of the skills that it contains.
 * Reversed direction of {@link RELATION_SKILL_OF}.
 *
 * @alpha
 */
export const RELATION_HAS_SKILL = 'hasSkill';

/**
 * A relation from an AI skill to a plugin that contains it. Reversed
 * direction of {@link RELATION_HAS_SKILL}.
 *
 * @alpha
 */
export const RELATION_SKILL_OF = 'skillOf';

/**
 * A relation from an AI marketplace to one of the plugins that it contains.
 * Reversed direction of {@link RELATION_PLUGIN_OF}.
 *
 * @alpha
 */
export const RELATION_HAS_PLUGIN = 'hasPlugin';

/**
 * A relation from an AI plugin to a marketplace that contains it. Reversed
 * direction of {@link RELATION_HAS_PLUGIN}.
 *
 * @alpha
 */
export const RELATION_PLUGIN_OF = 'pluginOf';

const baseRelationFields = [
  {
    selector: { path: 'spec.owner' },
    relation: 'ownedBy',
    defaultKind: 'Group',
    defaultNamespace: 'inherit' as const,
    allowedKinds: ['Group', 'User'],
  },
  {
    selector: { path: 'spec.system' },
    relation: 'partOf',
    defaultKind: 'System',
    defaultNamespace: 'inherit' as const,
    allowedKinds: ['System'],
  },
];

/**
 * Extends the catalog model with the AiResource kind.
 *
 * @alpha
 */
export const aiResourceEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/kind-ai-resource',
  builder: model => {
    model.addKind({
      group: 'backstage.io',
      names: {
        kind: 'AiResource',
        singular: 'airesource',
        plural: 'airesources',
      },
      description:
        'An AI resource represents contextual information consumed by AI coding tools, such as skills and rules.',
      versions: [
        {
          name: 'v1alpha1',
          relationFields: baseRelationFields,
          schema: {
            jsonSchema: defaultJsonSchema as JsonObject,
          },
        },
        {
          name: 'v1alpha1',
          specType: 'skill',
          relationFields: [
            ...baseRelationFields,
            {
              selector: { path: 'spec.dependsOn' },
              relation: 'dependsOn',
              defaultKind: 'AiResource',
              defaultNamespace: 'inherit' as const,
              allowedKinds: ['AiResource'],
            },
          ],
          schema: {
            jsonSchema: skillJsonSchema as JsonObject,
          },
        },
        {
          name: 'v1alpha1',
          specType: 'rule',
          relationFields: baseRelationFields,
          schema: {
            jsonSchema: ruleJsonSchema as JsonObject,
          },
        },
        {
          name: 'v1alpha1',
          specType: 'plugin',
          relationFields: [
            ...baseRelationFields,
            {
              selector: { path: 'spec.skills' },
              relation: RELATION_HAS_SKILL,
              defaultKind: 'AiResource',
              defaultNamespace: 'inherit' as const,
              allowedKinds: ['AiResource'],
            },
          ],
          schema: {
            jsonSchema: pluginJsonSchema as JsonObject,
          },
        },
        {
          name: 'v1alpha1',
          specType: 'marketplace',
          relationFields: [
            ...baseRelationFields,
            {
              selector: { path: 'spec.plugins' },
              relation: RELATION_HAS_PLUGIN,
              defaultKind: 'AiResource',
              defaultNamespace: 'inherit' as const,
              allowedKinds: ['AiResource'],
            },
          ],
          schema: {
            jsonSchema: marketplaceJsonSchema as JsonObject,
          },
        },
      ],
    });
    model.updateRelationPair({
      fromKind: 'AiResource',
      toKind: ['Group', 'User'],
      forward: { type: 'ownedBy' },
      reverse: { type: 'ownerOf' },
    });
    model.updateRelationPair({
      fromKind: 'AiResource',
      toKind: 'System',
      forward: { type: 'partOf' },
      reverse: { type: 'hasPart' },
    });
    model.updateRelationPair({
      fromKind: 'AiResource',
      toKind: 'AiResource',
      forward: { type: 'dependsOn' },
      reverse: { type: 'dependencyOf' },
    });
    model.addRelationPair({
      fromKind: 'AiResource',
      toKind: 'AiResource',
      description: 'An AI plugin contains an AI skill.',
      forward: { type: RELATION_HAS_SKILL, title: 'has skill' },
      reverse: { type: RELATION_SKILL_OF, title: 'skill of' },
    });
    model.addRelationPair({
      fromKind: 'AiResource',
      toKind: 'AiResource',
      description: 'An AI marketplace contains an AI plugin.',
      forward: { type: RELATION_HAS_PLUGIN, title: 'has plugin' },
      reverse: { type: RELATION_PLUGIN_OF, title: 'plugin of' },
    });
  },
});
