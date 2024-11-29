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

import { isError } from './assertion';
import { CustomErrorBase } from './CustomErrorBase';

/*
 * A set of common business logic errors.
 *
 * A backend error handler middleware would understand these and translate them
 * to well formed HTTP responses.
 *
 * While these are intentionally analogous to HTTP errors, they are not
 * intended to be thrown by the request handling layer. In those places, please
 * use e.g. the http-errors library.
 */

/**
 * The given inputs are malformed and cannot be processed.
 *
 * @public
 */
export class InputError extends CustomErrorBase {
  name = 'InputError' as const;
}

/**
 * The request requires authentication, which was not properly supplied.
 *
 * @public
 */
export class AuthenticationError extends CustomErrorBase {
  name = 'AuthenticationError' as const;
}

/**
 * The authenticated caller is not allowed to perform this request.
 *
 * @public
 */
export class NotAllowedError extends CustomErrorBase {
  name = 'NotAllowedError' as const;
}

/**
 * The requested resource could not be found.
 *
 * Note that this error usually is used to indicate that an entity with a given
 * ID does not exist, rather than signalling that an entire route is missing.
 *
 * @public
 */
export class NotFoundError extends CustomErrorBase {
  name = 'NotFoundError' as const;
}

/**
 * The request could not complete due to a conflict in the current state of the
 * resource.
 *
 * @public
 */
export class ConflictError extends CustomErrorBase {
  name = 'ConflictError' as const;
}

/**
 * The requested resource has not changed since last request.
 *
 * @public
 */
export class NotModifiedError extends CustomErrorBase {
  name = 'NotModifiedError' as const;
}

/**
 * The server does not support the functionality required to fulfill the request.
 *
 * @public
 */
export class NotImplementedError extends CustomErrorBase {
  name = 'NotImplementedError' as const;
}

/**
 * The server is not ready to handle the request.
 *
 * @public
 */
export class ServiceUnavailableError extends CustomErrorBase {}

/**
 * An error that forwards an underlying cause with additional context in the message.
 *
 * The `name` property of the error will be inherited from the `cause` if
 * possible, and will otherwise be set to `'Error'`.
 *
 * @public
 */
export class ForwardedError extends CustomErrorBase {
  constructor(message: string, cause: Error | unknown) {
    super(message, cause);

    this.name = isError(cause) ? cause.name : 'Error';
  }
}
