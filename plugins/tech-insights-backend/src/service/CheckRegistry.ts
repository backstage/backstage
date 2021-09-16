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

import { TechInsightCheck } from '../types';
import { ConflictError, NotFoundError } from '@backstage/errors';

export class TechInsightCheckRegistry<CheckType extends TechInsightCheck> {
  private readonly checks = new Map<string, CheckType>();

  constructor(checks: CheckType[]) {
    checks.forEach(check => {
      this.register(check);
    });
  }

  register(check: CheckType) {
    if (this.checks.has(check.name)) {
      throw new ConflictError(
        `Tech insight check with name '${check.name}' has already been registered`,
      );
    }
    this.checks.set(check.name, check);
  }

  get(checkName: string): CheckType {
    const retriever = this.checks.get(checkName);
    if (!retriever) {
      throw new NotFoundError(
        `Tech insight check with name '${checkName}' is not registered.`,
      );
    }
    return retriever;
  }

  list(): CheckType[] {
    return [...this.checks.values()];
  }
}
