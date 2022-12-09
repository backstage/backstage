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
 * A context that just holds a single value, and delegates the rest to its
 * parent.
 */
export class ValueContext implements Context {
  static forConstantValue(ctx: Context, key: string, value: unknown): Context {
    return new ValueContext(ctx, key, value);
  }

  constructor(
    private readonly _parent: Context,
    private readonly _key: string,
    private readonly _value: unknown,
  ) {}

  get abortSignal(): AbortSignal {
    return this._parent.abortSignal;
  }

  get deadline(): Date | undefined {
    return this._parent.deadline;
  }

  value<T = unknown>(key: string): T | undefined {
    return key === this._key ? (this._value as T) : this._parent.value(key);
  }
}
