# @internal/rjsf-validator

An RJSF 5 validator backed by [`@cfworker/json-schema`](https://github.com/cfworker/cfworker/tree/main/packages/json-schema), for use by Backstage's own forms. Unlike `@rjsf/validator-ajv8`, it doesn't generate code at runtime, so forms that use it work under a Content Security Policy without `'unsafe-eval'`.

The code is adapted from [`@rjsf/validator-cfworker`](https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/validator-cfworker) 6.11.0 (Apache-2.0), which only supports RJSF 6. Once Backstage moves to RJSF 6, this package should be replaced by that one.

Nothing from this package may be exported in any public API.
