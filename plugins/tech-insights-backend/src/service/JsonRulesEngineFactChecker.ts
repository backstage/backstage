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

import {
  CheckResult,
  FactSchema,
  TechInsightCheck,
  TechInsightJsonRuleCheck,
} from '../types';
import { Engine } from 'json-rules-engine';
import { TechInsightCheckRegistry } from './CheckRegistry';
import { TechInsightsStore } from './TechInsightsDatabase';

export interface FactChecker<CheckType extends TechInsightCheck> {
  check(entity: string, checkName: string): Promise<CheckResult>;
  addCheck(check: CheckType): Promise<boolean>;
  getChecks(): CheckType[];
  validate(check: CheckType): Promise<boolean>;
}

// This should likely be a submodule when we expand it to handle multiple checks
export class JsonRulesEngineFactChecker
  implements FactChecker<TechInsightJsonRuleCheck>
{
  /*
  Checks:
    - [x] JSON code
    - [ ] Store in DB? (No dynamic facts)
    - [ ] Read from catalog-info? (No dynamic facts)
    - [X] Read reference of a check from catalog-info on the frontend, use predefined JSON/code as a check
  */

  private readonly checkRegistry: TechInsightCheckRegistry<TechInsightJsonRuleCheck>;
  private repository: TechInsightsStore;
  private readonly schemas: FactSchema[];

  constructor(
    schemas: FactSchema[],
    checks: TechInsightJsonRuleCheck[],
    repository: TechInsightsStore,
  ) {
    this.repository = repository;
    this.schemas = schemas;
    checks.forEach(check => this.validate(check));
    this.checkRegistry = new TechInsightCheckRegistry(checks);
  }

  async check(entity: string, checkName: string): Promise<CheckResult> {
    const engine = new Engine();
    const techInsightCheck = this.checkRegistry.get(checkName);
    const facts = await this.repository.retrieveLatestFactsForRefs(
      techInsightCheck.factRefs,
      entity,
    );

    engine.addRule(techInsightCheck.rule);

    if (techInsightCheck.dynamicFacts) {
      techInsightCheck.dynamicFacts.forEach(it =>
        engine.addFact(it.id, it.calculationMethod, it.options),
      );
    }

    const facts1 = Object.values(facts).reduce(
      (acc, it) => ({ ...acc, ...it.facts }),
      {},
    );
    const results = await engine.run(facts1);

    // TODO: maybe cache/store in DB
    const firstRuleResult = results.results[0];
    const firstEvent = results.events[0];
    return {
      value: firstRuleResult.result,
      text: firstEvent.params?.message,
    };
  }

  validate(check: TechInsightJsonRuleCheck): Promise<boolean> {
    const schemas = this.schemas;
    const rule = check.rule;
    console.log(schemas.length);
    console.log(rule.conditions);
    // Check that all keys referred in the check exists in the schemas of facts listed in the factRef array
    return Promise.resolve(false);
  }

  getChecks(): TechInsightJsonRuleCheck[] {
    return this.checkRegistry.list();
  }

  addCheck(check: TechInsightJsonRuleCheck): Promise<boolean> {
    return this.validate(check);
  }
}
