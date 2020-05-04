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

  constructor(constructor: Function, message?: string, cause?: Error) {
    super(message);
    Object.setPrototypeOf(this, constructor.prototype);
    Error.captureStackTrace(this, constructor);
    this.name = this.constructor.name;
    this.cause = cause;
  }

  toString() {
    let result = super.toString();

    if (this.cause) {
      result += `; caused by ${this.cause.toString()}`;
    }

    return result;
  }
}

/**
 * The request is malformed and cannot be processed.
 */
export class BadRequestError extends CustomErrorBase {
  constructor(message?: string, cause?: Error) {
    super(BadRequestError, message, cause);
  }
}

/**
 * The request requires authentication, which was not properly supplied.
 */
export class UnauthenticatedError extends CustomErrorBase {
  constructor(message?: string, cause?: Error) {
    super(UnauthenticatedError, message, cause);
  }
}

/**
 * The authenticated caller is not permitted to perform this request.
 */
export class ForbiddenError extends CustomErrorBase {
  constructor(message?: string, cause?: Error) {
    super(ForbiddenError, message, cause);
  }
}

/**
 * The requested resource could not be found.
 *
 * Note that this error usually is used to indicate that an entity with a given
 * ID does not exist, rather than signalling that an entire route is missing.
 */
export class NotFoundError extends CustomErrorBase {
  constructor(message?: string, cause?: Error) {
    super(NotFoundError, message, cause);
  }
}

/**
 * The request could not complete due to a conflict in the current state of the
 * resource.
 */
export class ConflictError extends CustomErrorBase {
  constructor(message?: string, cause?: Error) {
    super(ConflictError, message, cause);
  }
}
