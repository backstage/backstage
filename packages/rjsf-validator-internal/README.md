# @internal/rjsf-validator

An RJSF 5 validator backed by [`@cfworker/json-schema`](https://github.com/cfworker/cfworker/tree/main/packages/json-schema), for use by Backstage's own forms. Unlike `@rjsf/validator-ajv8`, it doesn't generate code at runtime, so forms that use it work under a Content Security Policy without `'unsafe-eval'`.

The code is adapted from [`@rjsf/validator-cfworker`](https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/validator-cfworker) 6.11.0 (Apache-2.0), which only supports RJSF 6. Once Backstage moves to RJSF 6, this package should be replaced by that one.

The `errorMessage: true` option adds support for the `errorMessage` keyword from [`ajv-errors`](https://github.com/ajv-validator/ajv-errors), which scaffolder templates use for custom error messages. It supports the same message forms, except message templates such as `${/path}`. The upstream package has no equivalent, so this would need to carry over when replacing it.

Nothing from this package may be exported in any public API.
