/*
 * Copyright 2022 The Backstage Authors
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

import { createApiRef } from '@backstage/core-plugin-api';
import { ApiEntity } from '@backstage/catalog-model';

/**
 * The result of linting.
 *
 * @public
 */
export type LinterResultData = {
  /**
   * The line position in content.
   */
  linePosition: {
    start: number;
    end: number;
  };

  message: string;
  /**
   * The severity.
   */
  severity: number;

  /**
   * The path in content.
   */
  path?: string[];
  /**
   * Rule set code
   */
  code?: string | number;
};

export type LinterResult = {
  /**
   * The ruleset url.
   */
  rulesetUrl: string;

  /**
   * The result data.
   */
  data: LinterResultData[];
};

export type LintOptions = {
  entity: ApiEntity;
};

/**
 * The API used by the spectral linter plugin to lint.
 *
 * @public
 */
export interface LinterApi {
  /** Lint. */
  lint(options: LintOptions): Promise<LinterResult>;

  /** Supported API types. */
  isApiTypeSupported(entity: ApiEntity): boolean;
}

/**
 * ApiRef for the LinterApi.
 *
 * @public
 */
export const linterApiRef = createApiRef<LinterApi>({
  id: 'plugin.spectral.linter.api',
});
