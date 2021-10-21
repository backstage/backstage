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
import { TechInsightsStore } from './persistence';
import { CheckResponse, FactResponse } from './responses';

/**
 * A factory wrapper to construct FactChecker implementations.
 *
 * @public
 * @typeParam CheckType - Implementation specific Check. Can extend TechInsightCheck with additional information
 * @typeParam CheckResultType - Implementation specific result of a check. Can extend CheckResult with additional information
 */
export interface FactCheckerFactory<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> {
  /**
   * @param repository - TechInsightsStore
   * @returns an implementation of a FactChecker for generic types defined in the factory
   */
  construct(
    repository: TechInsightsStore,
  ): FactChecker<CheckType, CheckResultType>;
}

/**
 * FactChecker interface
 *
 * A generic interface that can be implemented to create checkers for specific check and check return types.
 * This is used especially when creating Scorecards and displaying results of rules when run against facts.
 *
 * @public
 * @typeParam CheckType - Implementation specific Check. Can extend TechInsightCheck with additional information
 * @typeParam CheckResultType - Implementation specific result of a check. Can extend CheckResult with additional information
 */
export interface FactChecker<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> {
  /**
   * Runs checks against an entity.
   *
   * @param entity - A reference to an entity to run checks against. In a format namespace/kind/name
   * @param checks - A collection of checks to run against provided entity
   * @returns - A collection containing check/fact information and the actual results of the check
   */
  runChecks(entity: string, checks: string[]): Promise<CheckResultType[]>;

  /**
   * Adds and stores new checks so they can be run checks against.
   * Implementation should ideally run validation against the check.
   *
   * @param check - The actual check to be added.
   * @returns  - An indicator if fact was successfully added
   */
  addCheck(check: CheckType): Promise<CheckType>;

  /**
   * Retrieves all available checks that can be used to run checks against.
   * The implementation can be just a piping through to CheckRegistry implementation if such is in use.
   *
   * @returns - A collection of checks
   */
  getChecks(): Promise<CheckType[]>;

  /**
   * Validates if check is valid and can be run with the current implementation
   *
   * @param check - The check to be validated
   * @returns - Validation result
   */
  validate(check: CheckType): Promise<CheckValidationResponse>;
}

/**
 * Registry containing checks for tech insights.
 *
 * @public
 * @typeParam CheckType - Implementation specific Check. Can extend TechInsightCheck with additional information
 *
 */
export interface TechInsightCheckRegistry<CheckType extends TechInsightCheck> {
  register(check: CheckType): Promise<CheckType>;
  get(checkId: string): Promise<CheckType>;
  getAll(checks: string[]): Promise<CheckType[]>;
  list(): Promise<CheckType[]>;
}

/**
 * Generic CheckResult
 *
 * Contains information about the facts used to calculate the check result
 * and information about the check itself. Both may include metadata to be able to display additional information.
 * A collection of these should be parseable by the frontend to display scorecards
 *
 * @public
 */
export type CheckResult = {
  facts: FactResponse;
  check: CheckResponse;
};

/**
 * CheckResult of type Boolean.
 *
 * @public
 */
export interface BooleanCheckResult extends CheckResult {
  result: boolean;
}

/**
 * Generic definition of a check for Tech Insights
 *
 * @public
 */
export interface TechInsightCheck {
  /**
   * Unique identifier of the check
   *
   * Used to identify which checks to use when running checks.
   */
  id: string;

  /**
   * Type identifier for the check.
   * Can be used to determine storage options, logical routing to correct FactChecker implementation
   * or to help frontend render correct component types based on this
   */
  type: string;

  /**
   * Human readable name of the check, may be displayed in the UI
   */
  name: string;

  /**
   * Human readable description of the check, may be displayed in the UI
   */
  description: string;

  /**
   * A collection of string referencing fact rows that a check will be run against.
   *
   * References the fact container, aka fact retriever itself which may or may not contain multiple individual facts and values
   */
  factRefs: string[];

  /**
   * Metadata to be returned in case a check has been successfully evaluated
   * Can contain links, description texts or other actionable items
   */
  successMetadata?: Record<string, any>;

  /**
   * Metadata to be returned in case a check evaluation has ended in failure
   * Can contain links, description texts or other actionable items
   */
  failureMetadata?: Record<string, any>;
}

/**
 * Validation response from CheckValidator
 *
 * May contain additional data for display purposes
 * @public
 */
export type CheckValidationResponse = {
  valid: boolean;
  message?: string;
  errors?: any;
};

/**
 * Error object for Validation Errors
 *
 * Can be used to short circuit larger execution paths instead of passing validation response around
 *
 * @public
 */
export class CheckValidationError extends Error {
  errors?: any;

  constructor({ message, errors }: { message: string; errors?: any }) {
    super(message);
    this.errors = errors;
  }
}
