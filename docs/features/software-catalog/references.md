---
id: references
title: Entity References
description: How to express references between entities
---

Entities commonly have a need to reference other entities. For example, a
[Component](descriptor-format.md#kind-component) entity may want to declare who
its owner is by mentioning a Group or User entity, and a User entity may want to
declare what Group entities it is a member of. This article describes how to
write those references in your yaml entity declaration files.

Each entity in the catalog is uniquely identified by the triplet of its
[kind](descriptor-format.md#apiversion-and-kind-required),
[namespace](descriptor-format.md#namespace-optional), and
[name](descriptor-format.md#name-required). But that's a lot to type out
manually, and in a lot of circumstances, both the kind and the namespace are
fixed, or possible to deduce, or could have sane default values. So in order to
help the writer, the catalog has a few tricks up its sleeve.

Each reference can be expressed in one of two ways: as a compact string, or as a
compound reference structure.

## String References

This is the most common alternative, that should be used in almost all
circumstances.

The string is on the form `[<kind>:][<namespace>/]<name>`, that is, it is
composed of between one and three parts in this specific order, without any
additional encoding:

- Optionally, the kind, followed by a colon
- Optionally, the namespace, followed by a forward slash
- The name

The name is always required. Depending on the context, you may be able to leave
out the kind and/or namespace. If you do, it is contextual what values will be
used, and the relevant documentation should specify which rule applies where.
All strings are case insensitive.

```yaml
# Example:
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: petstore
  namespace: external-systems
  description: Petstore
spec:
  type: service
  lifecycle: experimental
  owner: group:pet-managers
  providesApis:
    - petstore
    - internal/streetlights
    - hello-world
```

The field `spec.owner` is a reference. In this case, the string
`group:pet-managers` was given by the user. That means that the kind is `Group`,
the namespace is left out, and the name is `pet-managers`. In this context, the
namespace was chosen to fall back to the value `default` by the code that parsed
the reference, so the end result is that we expect to find another entity in the
catalog that is of kind `Group`, namespace `default` (which, actually, also can
be left out in its own yaml file because that's the default value there too),
and name `pet-managers`.

The entries in `providesApis` are also references. In this case, none of them
needs to specify a kind since we know from the context that that's the only kind
that's supported here. The second entry specifies a namespace but the other ones
don't, and in this context, the default is to refer to the same namespace as the
originating entity (`external-systems` here). So the three references
essentially expand to `api:external-systems/petstore`,
`api:internal/streetlights`, and `api:external-systems/hello-world`. We expect
there to exist three API kind entities in the catalog matching those references.

## Compound References

This is a more verbose version of a reference, where each part of the
kind-namespace-name triplet is expressed as a field in a structure. This format
can be used where necessary, such as if either of the three elements contains
colons or forward slashes. Avoid using it where possible, since it is harder to
read and write for humans.

```yaml
# Example:
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: petstore
  description: Petstore
spec:
  type: service
  lifecycle: experimental
  owner:
    kind: Group
    name: aegis-imports/pet-managers
```

In this example, the `spec.owner` has been broken apart since the name was
complex. The kind happened to be written with an uppercase letter G, which also
works. The namespace was left out just like in the string version above, which
is handled identically.
