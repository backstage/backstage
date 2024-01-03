---
id: adrs-adr014
title: 'ADR014: Exposing Zod schemas'
# prettier-ignore
description: Architecture Decision Record (ADR) for treating Zod as a first class dependency and support for exposing Zod schemas from plugins.
---

## Context

Backstage currently uses the [Zod](https://zod.dev) library extensively for creating schemas to validate data types and use these schemas as TypeScript types within a plugin (and sometimes as parameters to public APIs). However, we are currently not exposing these schemas directly as part of plugin public APIs.

Plugins that are working with the data types of other plugins, can benefit from these schemas for performing their own validation and composing more complex types. As an example, the permission framework has the concept of a `Permission` data type, which internally is validated with a Zod schema.

```ts
const permissionSchema = z.union([
  z.object({
    type: z.literal('basic'),
    name: z.string(),
    attributes: z
      .union([
        z.literal('create'),
        z.literal('read'),
        z.literal('update'),
        z.literal('delete'),
      ])
      .optional(),
  }),
  z.object({
    type: z.literal('resource'),
    name: z.string(),
    attributes: attributesSchema,
    resourceType: z.string(),
  }),
]);
```

Adopters of Backstage may want to create an RBAC frontend interface for the permission framework, which would require to work with the `Permission` data type. They would benefit from aligning with the validation function from the permission plugin, and be able to compose additional schemas from it. For example.

```ts
import { permissionSchema } from '@backstage/permission-node';

const rbacRolePermissions = z.union({
  permissions: z.array(permissionSchema),
});
```

However, there is a possible risk to exposing the Zod schemas. A difference in Zod version could result in creating a schema that doesn't align with the expected data. It also externally couples Backstage to the Zod library.

## Decision

1. Zod is the preferred library for validating data, and that plugins should where possible align with using Zod.

2. Adopters of Backstage should keep their version of Zod in sync within the same `major` version of Zod used inside Backstage. This is to ensure data types and validation remain compatible.

3. The second step above opens up the possibility to safely expose Zod schemas from plugins.
