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

import { JsonValue } from '@backstage/types';

/**
 * Represents a single check defined on the TechInsights backend.
 *
 * @public
 */
export type Check = {
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
  factIds: string[];

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
};

/**
 * Represents a Fact defined on the TechInsights backend.
 *
 * @public
 */
export interface InsightFacts {
  [factId: string]: {
    timestamp: string;
    version: string;
    facts: Record<string, JsonValue>;
  };
}
