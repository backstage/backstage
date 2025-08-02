/*
 * Copyright 2025 The Backstage Authors
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
import { createConditionExports } from '@backstage/plugin-permission-node';
import { taskPermissionResourceRef, taskPermissionRules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
  resourceRef: taskPermissionResourceRef,
  rules: Object.fromEntries(taskPermissionRules.map(rule => [rule.name, rule])),
});

/**
 * @public
 */
export const taskConditions = conditions;

/**
 * @public
 */
export const createTaskConditionalDecision = createConditionalDecision;
