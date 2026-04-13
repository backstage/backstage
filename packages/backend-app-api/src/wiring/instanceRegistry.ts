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

/** @internal */
export interface Stoppable {
  stop(): Promise<void>;
}

/**
 * A registry of backend instances, used to manage process shutdown hooks across all instances.
 */
export const instanceRegistry = new (class InstanceRegistry {
  #registered = false;
  #instances = new Set<Stoppable>();

  register(instance: Stoppable) {
    if (!this.#registered) {
      this.#registered = true;

      process.addListener('SIGTERM', this.#exitHandler);
      process.addListener('SIGINT', this.#exitHandler);
      process.addListener('beforeExit', this.#exitHandler);
    }

    this.#instances.add(instance);
  }

  unregister(instance: Stoppable) {
    this.#instances.delete(instance);
  }

  #exitHandler = async () => {
    try {
      const results = await Promise.allSettled(
        Array.from(this.#instances).map(b => b.stop()),
      );
      const errors = results.flatMap(r =>
        r.status === 'rejected' ? [r.reason] : [],
      );

      if (errors.length > 0) {
        for (const error of errors) {
          console.error(error);
        }
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
})();
