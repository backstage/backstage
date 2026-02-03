# @internal/opaque

This is an internal package for use by other internal packages. Instances created with `OpaqueType.create` should never be exported in any public API, instead use an `@internal/*` if they need to be used in multiple packages.
