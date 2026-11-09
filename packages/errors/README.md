# Common error handling functionality

Contains some common functionality of error handling.

This package will be imported both by the frontend and backend.

## Checking error types

Use static type guards such as `AuthenticationError.is(value)` to narrow an
unknown value:

```ts
import { AuthenticationError, ResponseError } from '@backstage/errors';

try {
  // Call an operation that can fail.
} catch (error) {
  if (AuthenticationError.is(error)) {
    console.log(error.message);
  } else if (ResponseError.is(error)) {
    console.log(error.statusCode, error.cause.message);
  }
}
```

The guards recognize error-shaped objects by their explicit `name`, so they work
across package copies and after error serialization. They assume a matching name
indicates the intended error type. The common error guards also check that any
`cause` is error-shaped. `ResponseError.is` checks that `response` and `body` are
non-array objects, that `cause` is error-shaped, and that the status fields have
the expected primitive types. These are lightweight checks, not full validation
of nested data.

`ForwardedError` preserves its cause's name, so forwarding an
`AuthenticationError` still matches `AuthenticationError.is(value)`.
`ForwardedError` and `CustomErrorBase` have no public `is` method because they
have no fixed error name. When defining your own errors, you can use the
protected `CustomErrorBase.isErrorWithName(value, name)` helper:

```ts
import { CustomErrorBase } from '@backstage/errors';

class MyError extends CustomErrorBase {
  name = 'MyError' as const;

  static is(value: unknown): value is MyError {
    return MyError.isErrorWithName(value, 'MyError');
  }
}
```

If your subclass adds fields, extend its guard with checks for those fields.
An inherited guard checks the type that declares it; it does not narrow to a
subclass with additional fields.

## Links

- [The Backstage homepage](https://backstage.io)
