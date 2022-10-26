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

import { Store } from 'keyv';

/**
 * Storage class compatible with Keyv which always results in a no-op. This is
 * used when no cache store is configured in a Backstage backend instance.
 */
export class NoStore implements Store<string | undefined> {
  clear(): void {
    return;
  }

  delete(_key: string): boolean {
    return false;
  }

  get(_key: string) {
    return undefined;
  }

  has(_key: string): boolean {
    return false;
  }

  set(_key: string, _value: any): this {
    return this;
  }
}
