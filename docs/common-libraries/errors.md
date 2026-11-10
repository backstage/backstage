---
id: errors
title: Error Handling
description: Create, recognize, and handle errors with @backstage/errors
---

The `@backstage/errors` package provides error types and utilities shared by
frontend and backend code. Use them to describe failures in business logic and
to recognize errors without depending on a shared constructor.

For individual API signatures, see the
[package API reference](https://backstage.io/api/stable/modules/_backstage_errors.html).

## Choosing an error type

Choose a common error type that describes why an operation failed:

| Error type                | When to use it                                                 |
| ------------------------- | -------------------------------------------------------------- |
| `InputError`              | Inputs are malformed and cannot be processed.                  |
| `AuthenticationError`     | Required authentication was not supplied correctly.            |
| `NotAllowedError`         | The authenticated caller is not allowed to perform the action. |
| `NotFoundError`           | A requested resource does not exist.                           |
| `ConflictError`           | The action conflicts with the current state of a resource.     |
| `NotModifiedError`        | A resource has not changed since the previous request.         |
| `NotImplementedError`     | The requested functionality is not supported.                  |
| `ServiceUnavailableError` | The service is not ready to handle the operation.              |

These errors describe application failures. For request-layer HTTP errors, use
the error conventions of the HTTP framework you are using.

## Recognizing an error

Use the static `.is(value)` guards to narrow an unknown value:

```ts
import { AuthenticationError, NotAllowedError } from '@backstage/errors';

function describeError(error: unknown): string {
  if (AuthenticationError.is(error)) {
    return `Authentication failed: ${error.message}`;
  }
  if (NotAllowedError.is(error)) {
    return `Access denied: ${error.message}`;
  }
  return 'The operation failed';
}
```

The guards check an explicit string `name` and the basic error shape: a non-array
object with a nonempty string name and a string message. For the common error
types, any defined `cause` must also be error-shaped. This works across package
copies and after error serialization, where constructor identity may differ.

The checks are deliberately lightweight. They assume that a matching name
identifies the intended error type; they do not fully validate arbitrary data.

For a general error shape without a specific name, use `isError(value)`. Use
`assertError(value)` to throw when the value is not error-shaped, or
`toError(value)` to convert an unknown value into an error-shaped object.

## Adding context with ForwardedError

Use `ForwardedError` to add context while preserving the underlying error's name:

```ts
import { AuthenticationError, ForwardedError } from '@backstage/errors';

const cause = new AuthenticationError('Credentials have expired');
const error = new ForwardedError('Failed to load the resource', cause);

AuthenticationError.is(error); // true
error.cause === cause; // true
```

The message includes both the added context and the cause. If the cause is not
error-shaped, the forwarded error uses the name `Error`.

`ForwardedError` has no `.is` guard because it has no fixed error name. Recognize
the error type it forwards instead.

## Handling failed responses

Use `ResponseError.fromResponse` to turn a failed fetch response into an error.
Check the response status first; creating the error consumes the response body:

```ts
import { ResponseError } from '@backstage/errors';

const response = await fetch('/api/example/resources');
if (!response.ok) {
  throw await ResponseError.fromResponse(response);
}
```

The returned error exposes the consumed `response`, the parsed `body`, the remote
error as `cause`, and the `statusCode` and `statusText`. The parser expects the
Backstage `ErrorResponseBody` format and creates a fallback body if it cannot
read that format.

Use `ResponseError.is(error)` to recognize this wrapper. Use the common error
guards on `error.cause` to recognize the remote failure:

```ts
import { NotFoundError, ResponseError } from '@backstage/errors';

function isMissingResource(error: unknown): boolean {
  return ResponseError.is(error) && NotFoundError.is(error.cause);
}
```

`ResponseError.is` checks the name and basic error shape, requires an error-shaped
cause, and checks the primitive status field types. It checks that `response` and
`body` are non-array objects, without validating their nested contents.

## Defining custom errors

Extend `CustomErrorBase` to get message, stack, and optional cause handling. Give
your error an explicit name and use the exported `isErrorWithName` helper to
implement its guard. Check any additional fields needed by your error type:

```ts
import { CustomErrorBase, isErrorWithName } from '@backstage/errors';

class ResourceError extends CustomErrorBase {
  name = 'ResourceError' as const;

  constructor(readonly resourceId: string, cause?: unknown) {
    super(`Failed to load resource '${resourceId}'`, cause);
  }

  static is(value: unknown): value is ResourceError {
    return (
      isErrorWithName(value, 'ResourceError') &&
      typeof value.resourceId === 'string'
    );
  }
}
```

`isErrorWithName` checks the same basic shape and optional cause as the common
error guards. It does not check your additional fields. An inherited guard
narrows to the type that declares it, so add a guard when a subclass needs
additional checks. `CustomErrorBase` itself has no `.is` guard.

## Serializing errors

Use `serializeError(error)` to produce a JSON-compatible error representation,
and `deserializeError(data)` to turn it back into an error. The error name is
preserved, so name-based guards can recognize the result even when its
constructor differs from the original error's constructor.

Stack traces are omitted by default. Set `includeStack: true` when calling
`serializeError` if the recipient needs them. Choose what error information to
share with the recipient; omitting the stack does not remove sensitive details
from messages or other fields.
