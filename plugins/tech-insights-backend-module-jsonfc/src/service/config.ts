/*
 * Copyright 2024 The Backstage Authors
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

import { Config } from '@backstage/config';
import { TopLevelCondition } from 'json-rules-engine';
import { Rule, TechInsightJsonRuleCheck } from '../types';

// copy of non-exported `ConditionProperties` from 'json-rules-engine'
interface ConditionProperties {
  fact: string;
  operator: string;
  value: { fact: string } | any;
  path?: string;
  priority?: number;
  params?: Record<string, any>;
  name?: string;
}

// copy of non-exported `NestedCondition` from 'json-rules-engine'
type NestedCondition = ConditionProperties | TopLevelCondition;

function readRuleConditionProperties(config: Config): ConditionProperties {
  const fact = config.getString('fact');
  const name = config.getOptionalString('name');
  const operator = config.getString('operator');
  const params = config.getOptionalConfig('params')?.get<Record<string, any>>();
  const path = config.getOptionalString('path');
  const priority = config.getOptionalNumber('priority');
  const value: { fact: string } | any = config.get('value');

  return {
    fact,
    name,
    operator,
    params,
    path,
    priority,
    value,
  };
}

function readRuleNestedCondition(config: Config): NestedCondition {
  if (config.has('fact')) {
    return readRuleConditionProperties(config);
  }

  return readRuleTopLevelCondition(config);
}

function readRuleTopLevelCondition(config: Config): TopLevelCondition {
  const base = {
    name: config.getOptionalString('name'),
    priority: config.getOptionalNumber('priority'),
  };

  if (config.has('all')) {
    const all = config
      .getConfigArray('all')
      .map(conditionConfig => readRuleNestedCondition(conditionConfig));
    return {
      ...base,
      all,
    };
  }

  if (config.has('any')) {
    const any = config
      .getConfigArray('any')
      .map(conditionConfig => readRuleNestedCondition(conditionConfig));
    return {
      ...base,
      any,
    };
  }

  if (config.has('not')) {
    const not = readRuleNestedCondition(config.getConfig('not'));
    return {
      ...base,
      not,
    };
  }

  const condition = config.getString('condition');

  return {
    ...base,
    condition,
  };
}

function readRuleFromRuleConfig(config: Config): Rule {
  const conditions = readRuleTopLevelCondition(config.getConfig('conditions'));
  const name = config.getOptionalString('name');
  const priority = config.getOptionalNumber('priority');

  return {
    conditions,
    name,
    priority,
  };
}

function readCheckFromCheckConfig(
  id: string,
  config: Config,
): TechInsightJsonRuleCheck {
  const type = config.getString('type');
  const name = config.getString('name');
  const description = config.getString('description');
  const factIds = config.getStringArray('factIds');
  const successMetadata = config
    .getOptionalConfig('successMetadata')
    ?.get<Record<string, any>>();
  const failureMetadata = config
    .getOptionalConfig('failureMetadata')
    ?.get<Record<string, any>>();
  const rule = readRuleFromRuleConfig(config.getConfig('rule'));

  return {
    description,
    factIds,
    failureMetadata,
    id,
    name,
    rule,
    successMetadata,
    type,
  };
}

export function readChecksFromConfig(
  config: Config,
): TechInsightJsonRuleCheck[] {
  const key = 'techInsights.factChecker.checks';
  if (!config.has(key)) {
    return [];
  }

  const checksConfig = config.getConfig(key);
  const checks: TechInsightJsonRuleCheck[] = [];
  checksConfig.keys().forEach(checkId => {
    const checkConfig = checksConfig.getConfig(checkId);

    checks.push(readCheckFromCheckConfig(checkId, checkConfig));
  });

  return checks;
}
