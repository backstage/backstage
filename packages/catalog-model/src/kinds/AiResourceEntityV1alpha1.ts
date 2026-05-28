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
 * Backstage catalog AiResource kind Entity. Represents contextual information
 * consumed by AI coding tools, such as skills and rules.
 *
 * @alpha
 */
export type AiResourceEntityV1alpha1 =
  | AiResourceEntityV1alpha1Default
  | SkillAiResourceEntityV1alpha1
  | RuleAiResourceEntityV1alpha1;

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
      ],
    });
  },
});
