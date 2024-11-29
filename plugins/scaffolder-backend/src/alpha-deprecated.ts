/*
 * Copyright 2023 The Backstage Authors
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
  createScaffolderActionConditionalDecision as createScaffolderActionConditionalDecisionNode,
  createScaffolderTemplateConditionalDecision as createScaffolderTemplateConditionalDecisionNode,
  scaffolderActionConditions as scaffolderActionConditionsNode,
  scaffolderTemplateConditions as scaffolderTemplateConditionsNode,
} from '@backstage/plugin-scaffolder-node/alpha';

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-scaffolder-node/alpha` instead
 */
export const createScaffolderTemplateConditionalDecision =
  createScaffolderTemplateConditionalDecisionNode;

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-scaffolder-node/alpha` instead
 */
export const scaffolderTemplateConditions = scaffolderTemplateConditionsNode;

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-scaffolder-node/alpha` instead
 */
export const createScaffolderActionConditionalDecision =
  createScaffolderActionConditionalDecisionNode;

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-scaffolder-node/alpha` instead
 */
export const scaffolderActionConditions = scaffolderActionConditionsNode;
