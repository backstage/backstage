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

import { isError, toError } from './assertion';

/**
 * A base class that custom Error classes can inherit from.
 *
 * @public
 * @example
 *
 * ```ts
 * class MyCustomError extends CustomErrorBase {
 *  name = 'MyCustomError' as const;
 *
 *  static is(value: unknown): value is MyCustomError {
 *    return MyCustomError.isErrorWithName(value, 'MyCustomError');
 *  }
 * }
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
   * Checks an explicit error name and basic shape, including an optional
   * error-shaped cause. Subclasses can use this to implement their own type
   * guards, adding checks for any additional fields as needed.
   */
  protected static isErrorWithName(
    value: unknown,
    name: string,
  ): value is CustomErrorBase {
    return (
      isError(value) &&
      value.name === name &&
      (value.cause === undefined || isError(value.cause))
    );
  }

  /**
   * An inner error that caused this error to be thrown, if any.
   */
  readonly cause?: Error | undefined;

  constructor(message?: string, cause?: Error | unknown) {
    const causeError = cause !== undefined ? toError(cause) : undefined;

    let fullMessage = message;
    if (causeError !== undefined) {
      const causeStr = String(causeError);
      const causeMsg =
        causeStr !== '[object Object]'
          ? causeStr
          : `${causeError.name}: ${causeError.message}`;
      if (fullMessage) {
        fullMessage += `; caused by ${causeMsg}`;
      } else {
        fullMessage = `caused by ${causeMsg}`;
      }
    }

    super(fullMessage);

    Error.captureStackTrace?.(this, this.constructor);

    if (!this.name || this.name === 'Error') {
      const baseName = this.constructor.name;
      if (baseName !== 'Error') {
        this.name = this.constructor.name;
      }
    }

    this.cause = causeError;
  }
}
