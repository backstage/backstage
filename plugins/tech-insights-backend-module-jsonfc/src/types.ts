/*
 * Copyright 2021 The Backstage Authors
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
import { TopLevelCondition } from 'json-rules-engine';
import { TechInsightCheck } from '@backstage/plugin-tech-insights-node';
import {
  BooleanCheckResult,
  CheckResponse,
} from '@backstage/plugin-tech-insights-common';

/**
 * @public
 */
export type Rule = {
  conditions: TopLevelCondition;
  name?: string;
  priority?: number;
};

/**
 * @public
 */
export interface TechInsightJsonRuleCheck extends TechInsightCheck {
  rule: Rule;
}

/**
 * @public
 */
export type CheckCondition = {
  operator: string;
  fact: string;
  factValue: any;
  factResult: any;
  result: boolean;
};

/**
 * @public
 */
export type ResponseTopLevelCondition =
  | { all: CheckCondition[] }
  | { any: CheckCondition[] };

/**
 * @public
 */
export interface JsonRuleCheckResponse extends CheckResponse {
  rule: {
    conditions: ResponseTopLevelCondition & {
      priority: number;
    };
  };
}

/**
 * @public
 */
export interface JsonRuleBooleanCheckResult extends BooleanCheckResult {
  check: JsonRuleCheckResponse;
}
