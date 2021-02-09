/*
 * Copyright 2020 Spotify AB
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

/*
 * A set of common business logic errors.
 *
 * The error handler middleware understands these and will translate them to
 * well formed HTTP responses.
 *
 * While these are intentionally analogous to HTTP errors, they are not
 * intended to be thrown by the request handling layer. In those places, please
 * use e.g. the http-errors library.
 */

class CustomErrorBase extends Error {
  readonly cause?: Error;

  constructor(message?: string, cause?: Error) {
    let fullMessage = message;
    if (cause) {
      if (fullMessage) {
        fullMessage += `; caused by ${cause}`;
      } else {
        fullMessage = `caused by ${cause}`;
      }
    }

    super(fullMessage);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.cause = cause;
  }
}

/**
 * The given inputs are malformed and cannot be processed.
 */
export class InputError extends CustomErrorBase {}

/**
 * The request requires authentication, which was not properly supplied.
 */
export class AuthenticationError extends CustomErrorBase {}

/**
 * The authenticated caller is not allowed to perform this request.
 */
export class NotAllowedError extends CustomErrorBase {}

/**
 * The requested resource could not be found.
 *
 * Note that this error usually is used to indicate that an entity with a given
 * ID does not exist, rather than signalling that an entire route is missing.
 */
export class NotFoundError extends CustomErrorBase {}

/**
 * The request could not complete due to a conflict in the current state of the
 * resource.
 */
export class ConflictError extends CustomErrorBase {}

/**
 * The requested resource has not changed since last request.
 */
export class NotModifiedError extends CustomErrorBase {}
