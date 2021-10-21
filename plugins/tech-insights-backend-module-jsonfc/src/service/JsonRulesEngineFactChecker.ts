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

import { JsonRuleBooleanCheckResult, TechInsightJsonRuleCheck } from '../types';
import {
  FactChecker,
  FactResponse,
  FactValueDefinitions,
  TechInsightCheckRegistry,
  FlatTechInsightFact,
  TechInsightsStore,
  CheckValidationResponse,
  CheckValidationError,
} from '@backstage/plugin-tech-insights-common';
import { Engine, EngineResult, TopLevelCondition } from 'json-rules-engine';
import { DefaultCheckRegistry } from './CheckRegistry';
import { Logger } from 'winston';
import { pick } from 'lodash';
import Ajv from 'ajv';
import * as validationSchema from './validation-schema.json';
import { JSON_RULE_ENGINE_CHECK_TYPE } from '../constants';

const noopEvent = {
  type: 'noop',
};

/**
 * @public
 * Should actually be at-internal
 *
 * Constructor options for JsonRulesEngineFactChecker
 */
export type JsonRulesEngineFactCheckerOptions = {
  checks: TechInsightJsonRuleCheck[];
  repository: TechInsightsStore;
  logger: Logger;
  checkRegistry?: TechInsightCheckRegistry<any>;
};

/**
 * @public
 * Should actually be at-internal
 *
 * FactChecker implementation using json-rules-engine
 */
export class JsonRulesEngineFactChecker
  implements FactChecker<TechInsightJsonRuleCheck, JsonRuleBooleanCheckResult>
{
  private readonly checkRegistry: TechInsightCheckRegistry<TechInsightJsonRuleCheck>;
  private repository: TechInsightsStore;
  private readonly logger: Logger;

  constructor({
    checks,
    repository,
    logger,
    checkRegistry,
  }: JsonRulesEngineFactCheckerOptions) {
    this.repository = repository;
    this.logger = logger;
    checks.forEach(check => this.validate(check));
    this.checkRegistry = checkRegistry ?? new DefaultCheckRegistry(checks);
  }

  async runChecks(
    entity: string,
    checks: string[],
  ): Promise<JsonRuleBooleanCheckResult[]> {
    const engine = new Engine();
    const techInsightChecks = await this.checkRegistry.getAll(checks);
    const factRefs = techInsightChecks.flatMap(it => it.factRefs);
    const facts = await this.repository.getLatestFactsForRefs(factRefs, entity);
    techInsightChecks.forEach(techInsightCheck => {
      const rule = techInsightCheck.rule;
      rule.name = techInsightCheck.id;
      engine.addRule({ ...techInsightCheck.rule, event: noopEvent });

      if (techInsightCheck.dynamicFacts) {
        techInsightCheck.dynamicFacts.forEach(it =>
          engine.addFact(it.id, it.calculationMethod, it.options),
        );
      }
    });

    const factValues = Object.values(facts).reduce(
      (acc, it) => ({ ...acc, ...it.facts }),
      {},
    );

    try {
      const results = await engine.run(factValues);
      return await this.ruleEngineResultsToCheckResponse(
        results,
        techInsightChecks,
        Object.values(facts),
      );
    } catch (e) {
      throw new Error(`Failed to run rules engine, ${e.message}`);
    }
  }

  async validate(
    check: TechInsightJsonRuleCheck,
  ): Promise<CheckValidationResponse> {
    const ajv = new Ajv({ verbose: true });
    const validator = ajv.compile(validationSchema);
    const isValidToSchema = validator(check.rule);
    if (check.type !== JSON_RULE_ENGINE_CHECK_TYPE) {
      const msg = `Only ${JSON_RULE_ENGINE_CHECK_TYPE} checks can be registered to this fact checker`;
      this.logger.warn(msg);
      return {
        valid: false,
        message: msg,
      };
    }
    if (!isValidToSchema) {
      const msg = 'Failed to to validate conditions against JSON schema';
      this.logger.warn(
        'Failed to to validate conditions against JSON schema',
        validator.errors,
      );
      return {
        valid: false,
        message: msg,
        errors: validator.errors,
      };
    }

    const existingSchemas = await this.repository.getLatestSchemas(
      check.factRefs,
    );
    const references = this.retrieveFactReferences(check.rule.conditions);
    const results = references.map(ref => ({
      ref,
      result: existingSchemas.some(schema => schema.schema.hasOwnProperty(ref)),
    }));
    const failedReferences = results.filter(it => !it.result);
    failedReferences.forEach(it => {
      this.logger.warn(
        `Validation failed for check ${check.name}. Reference to value ${
          it.ref
        } does not exists in referred fact schemas: ${check.factRefs.join(
          ',',
        )}`,
      );
    });
    const valid = failedReferences.length === 0;
    return {
      valid,
      ...(!valid
        ? {
            message: `Check is referencing missing values from fact schemas: ${failedReferences
              .map(it => it.ref)
              .join(',')}`,
          }
        : {}),
    };
  }

  getChecks(): Promise<TechInsightJsonRuleCheck[]> {
    return this.checkRegistry.list();
  }

  async addCheck(
    check: TechInsightJsonRuleCheck,
  ): Promise<TechInsightJsonRuleCheck> {
    const checkValidationResponse = await this.validate(check);
    if (!checkValidationResponse.valid) {
      const msg = `Check validation failed when adding check ${check.name} to check registry.`;
      this.logger.warn(msg);
      throw new CheckValidationError({
        message: checkValidationResponse.message || msg,
        errors: checkValidationResponse.errors,
      });
    }
    return await this.checkRegistry.register(check);
  }

  private retrieveFactReferences(
    condition: TopLevelCondition | { fact: string },
  ): string[] {
    let results: string[] = [];
    if ('all' in condition) {
      results = results.concat(
        condition.all.flatMap(con => this.retrieveFactReferences(con)),
      );
    } else if ('any' in condition) {
      results = results.concat(
        condition.any.flatMap(con => this.retrieveFactReferences(con)),
      );
    } else {
      results.push(condition.fact);
    }
    return results;
  }

  private async ruleEngineResultsToCheckResponse(
    results: EngineResult,
    techInsightChecks: TechInsightJsonRuleCheck[],
    facts: FlatTechInsightFact[],
  ) {
    return await Promise.all(
      [
        ...(results.results && results.results),
        ...(results.failureResults && results.failureResults),
      ].map(async result => {
        const techInsightCheck = techInsightChecks.find(
          check => check.id === result.name,
        );
        if (!techInsightCheck) {
          // This should never happen, we just constructed these based on each other
          throw new Error(
            `Failed to determine tech insight check with id ${result.name}. Discrepancy between ran rule engine and configured checks.`,
          );
        }
        const factResponse = await this.constructFactInformationResponse(
          facts,
          techInsightCheck,
        );
        return {
          facts: factResponse,
          result: result.result,
          check: JsonRulesEngineFactChecker.constructCheckResponse(
            techInsightCheck,
            result,
          ),
        };
      }),
    );
  }

  private static constructCheckResponse(
    techInsightCheck: TechInsightJsonRuleCheck,
    result: any,
  ) {
    const returnable = {
      id: techInsightCheck.id,
      type: techInsightCheck.type,
      name: techInsightCheck.name,
      description: techInsightCheck.description,
      factRefs: techInsightCheck.factRefs,
      metadata: result.result
        ? techInsightCheck.successMetadata
        : techInsightCheck.failureMetadata,
      rule: { conditions: {} },
    };

    if ('toJSON' in result) {
      // Results serialize "wrong" since the objects are creating their own serialization implementations
      // 'toJSON' should always be present in the result object but it is missing from the types
      const rule = JSON.parse(result.toJSON());
      return { ...returnable, rule: pick(rule, ['conditions']) };
    }
    return returnable;
  }

  private async constructFactInformationResponse(
    facts: FlatTechInsightFact[],
    techInsightCheck: TechInsightJsonRuleCheck,
  ): Promise<FactResponse> {
    const factSchemas = await this.repository.getLatestSchemas(
      techInsightCheck.factRefs,
    );
    const schemas: FactValueDefinitions = factSchemas.reduce(
      (acc, schema) => ({ ...acc, ...schema.schema }),
      {},
    );
    const individualFacts = this.retrieveFactReferences(
      techInsightCheck.rule.conditions,
    );
    const factValues = facts
      .filter(factContainer =>
        techInsightCheck.factRefs.includes(factContainer.ref),
      )
      .reduce(
        (acc, factContainer) => ({
          ...acc,
          ...pick(factContainer.facts, individualFacts),
        }),
        {},
      );
    return Object.entries(factValues).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          value,
          ...schemas[key],
        },
      };
    }, {});
  }
}

/**
 * @public
 *
 * Constructor options for JsonRulesEngineFactCheckerFactory
 *
 * Implementation of checkRegistry is optional.
 * If there is a need to use persistent storage for checks, it is recommended to inject a storage implementation here.
 * Otherwise an in-memory option is instantiated and used.
 */
export type JsonRulesEngineFactCheckerFactoryOptions = {
  checks: TechInsightJsonRuleCheck[];
  logger: Logger;
  checkRegistry?: TechInsightCheckRegistry<any>;
};

/**
 * @public
 *
 * Factory to construct JsonRulesEngineFactChecker
 * Can be constructed with optional implementation of CheckInsightCheckRegistry if needed.
 * Otherwise defaults to using in-memory CheckRegistry
 */
export class JsonRulesEngineFactCheckerFactory {
  private readonly checks: TechInsightJsonRuleCheck[];
  private readonly logger: Logger;
  private readonly checkRegistry?: TechInsightCheckRegistry<any>;

  constructor({
    checks,
    logger,
    checkRegistry,
  }: JsonRulesEngineFactCheckerFactoryOptions) {
    this.logger = logger;
    this.checks = checks;
    this.checkRegistry = checkRegistry;
  }

  /**
   * @param repository - Implementation of TechInsightsStore. Used by the returned JsonRulesEngineFactChecker
   *                     to retrieve fact and fact schema data
   * @returns JsonRulesEngineFactChecker implementation
   */
  construct(repository: TechInsightsStore) {
    return new JsonRulesEngineFactChecker({
      checks: this.checks,
      logger: this.logger,
      checkRegistry: this.checkRegistry,
      repository,
    });
  }
}
