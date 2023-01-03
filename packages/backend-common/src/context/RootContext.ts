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

import { Context } from './types';

/**
 * Since the root context can never abort, and since nobody is ever meant to
 * dispatch events through it, we can use a static fake instance for efficiency.
 *
 * The reason that this was initially made for the root context is that due to
 * the way that we always chain contexts off of it, sometimes a huge number of
 * listeners want to add themselves to something that effectively never can be
 * aborted in the first place. This triggered warnings that the max listeners
 * limit was exceeded.
 */
class FakeAbortSignal implements AbortSignal {
  readonly aborted = false;
  readonly reason = undefined;
  onabort() {}
  throwIfAborted() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

/**
 * An empty root context.
 */
export class RootContext implements Context {
  readonly abortSignal = new FakeAbortSignal();
  readonly deadline = undefined;
  value<T = unknown>(_key: string): T | undefined {
    return undefined;
  }
}
