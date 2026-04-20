/*
 * Copyright 2026 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Manages a set of lifecycle hooks that fire once.
 *
 * @internal
 */
export class HookRunner<
  TOptions extends { logger?: LoggerService } | undefined =
    | { logger?: LoggerService }
    | undefined,
> {
  #hasFired = false;
  #tasks: Array<{
    hook: () => void | Promise<void>;
    options?: TOptions;
  }> = [];

  readonly #label: string;
  readonly #logger: LoggerService;

  constructor(label: string, logger: LoggerService) {
    this.#label = label;
    this.#logger = logger;
  }

  add(hook: () => void | Promise<void>, options?: TOptions): void {
    if (this.#hasFired) {
      throw new Error(
        `Attempted to add ${this.#label} hook after ${this.#label}`,
      );
    }
    this.#tasks.push({ hook, options });
  }

  async run(): Promise<void> {
    if (this.#hasFired) {
      return;
    }
    this.#hasFired = true;

    const label = this.#label.charAt(0).toUpperCase() + this.#label.slice(1);

    this.#logger.debug(`Running ${this.#tasks.length} ${this.#label} tasks...`);
    await Promise.all(
      this.#tasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.#logger;
        try {
          await hook();
          logger.debug(`${label} hook succeeded`);
        } catch (error) {
          logger.error(`${label} hook failed, ${error}`);
        }
      }),
    );
  }
}
