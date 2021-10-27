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

export class CancelToken {
  #cancel: () => void;
  #isCancelled: boolean;
  #cancelPromise: Promise<void>;

  static create(): CancelToken {
    return new CancelToken();
  }

  private constructor() {
    this.#isCancelled = false;

    this.#cancel = () => {}; // Avoids a TS warning
    this.#cancelPromise = new Promise(resolve => {
      this.#cancel = () => {
        this.#isCancelled = true;
        resolve();
      };
    });
  }

  cancel(): void {
    this.#cancel();
  }

  get isCancelled(): boolean {
    return this.#isCancelled;
  }

  get promise(): Promise<void> {
    return this.#cancelPromise;
  }
}
