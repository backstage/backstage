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

import { ConflictError, NotFoundError } from '@backstage/errors';
import {
  TechInsightCheck,
  TechInsightCheckRegistry,
} from '@backstage/plugin-tech-insights-node';

export class DefaultCheckRegistry<CheckType extends TechInsightCheck>
  implements TechInsightCheckRegistry<CheckType>
{
  private readonly checks = new Map<string, CheckType>();

  constructor(checks: CheckType[]) {
    checks.forEach(check => {
      this.register(check);
    });
  }

  async register(check: CheckType): Promise<CheckType> {
    if (this.checks.has(check.id)) {
      throw new ConflictError(
        `Tech insight check with id ${check.id} has already been registered`,
      );
    }
    this.checks.set(check.id, check);
    return check;
  }

  async get(checkId: string): Promise<CheckType> {
    const check = this.checks.get(checkId);
    if (!check) {
      throw new NotFoundError(
        `Tech insight check with id '${checkId}' is not registered.`,
      );
    }
    return check;
  }
  async getAll(checks: string[]): Promise<CheckType[]> {
    return Promise.all(checks.map(checkId => this.get(checkId)));
  }

  async list(): Promise<CheckType[]> {
    return [...this.checks.values()];
  }
}
