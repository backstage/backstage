/*
 * Copyright 2020 The Backstage Authors
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

import { stringifyError } from '../serialization';
import { isError } from './assertion';

/**
 * A base class that custom Error classes can inherit from.
 *
 * @public
 * @example
 *```ts
 * class MyCustomError extends CustomErrorBase {}
 *
 * const e = new MyCustomError('Some message', cause);
 * // e.name === 'MyCustomError'
 * // e.message === 'Some message'
 * // e.cause === cause
 * // e.stack is set if the runtime supports it
 * ```
 */
export class CustomErrorBase extends Error {
  /**
   * An inner error that caused this error to be thrown, if any.
   */
  readonly cause?: Error | undefined;

  constructor(message?: string, cause?: Error | unknown) {
    let fullMessage = message;
    if (cause !== undefined) {
      const causeStr = stringifyError(cause);
      if (fullMessage) {
        fullMessage += `; caused by ${causeStr}`;
      } else {
        fullMessage = `caused by ${causeStr}`;
      }
    }

    super(fullMessage);

    Error.captureStackTrace?.(this, this.constructor);

    this.name = this.constructor.name;
    this.cause = isError(cause) ? cause : undefined;
  }
}
