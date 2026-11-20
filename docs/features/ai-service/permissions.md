---
id: ai-service-permissions
title: AI Service Permissions
sidebar_label: Permissions
description: The AI service permissions, their resource rules, and how policies decide which models, tools, and features each plugin may use
---

The AI service moves all permission-relevant control into the Backstage
[permission framework](../../permissions/overview.md). Which models a caller
may dispatch, which tools a plugin may use, and which service features a
plugin may request are all permission queries — there is no allowlist in
`app-config.yaml` for them.

When no policy is configured, the framework's default applies: every
permission is allowed. See [the default and its sharp edge](#the-default-and-its-sharp-edge).

## The permissions

| Permission       | Type                    | Checked at                                              |
| :--------------- | :---------------------- | :------------------------------------------------------ |
| `ai.model.use`   | Resource (`ai-model`)   | Model discovery and every model dispatch                |
| `ai.tool.use`    | Resource (`ai-tool`)    | Every tool dispatch, inside the guarded tool operations |
| `ai.feature.use` | Resource (`ai-feature`) | Harness admission, when a plugin requests a feature     |
| `ai.session.use` | Basic                   | Every AI backend HTTP route                             |
| `ai.audit.read`  | Basic                   | Session audit reads (also requires session ownership)   |

The fixed permissions and resource types are exported from
`@backstage/plugin-ai-common`; the resource rules and conditional decision
helpers are exported from `@backstage/ai-node/alpha` and re-exported from
`@backstage/plugin-ai-backend/alpha` for policy authors who already depend
on the plugin.

## Resource rules

Each resource permission carries attributes that rules match against:

- `ai-model`: `provider`, `modelId`, `type`
- `ai-tool`: `serverId`, `toolName`, `pluginId` (the dispatching plugin)
- `ai-feature`: `pluginId`, `feature`

The rules:

| Rule          | Resource     | Params                 | Matches                                                         |
| :------------ | :----------- | :--------------------- | :-------------------------------------------------------------- |
| `isModel`     | `ai-model`   | `provider`, `modelId`  | One cataloged model                                             |
| `isProvider`  | `ai-model`   | `provider`             | Every model of one provider                                     |
| `isModelType` | `ai-model`   | `type`                 | Every model of one catalog type (`chat`, `classifier`, `image`) |
| `isTool`      | `ai-tool`    | `serverId`, `toolName` | One registered tool                                             |
| `isServer`    | `ai-tool`    | `serverId`             | Every tool of one server                                        |
| `isPlugin`    | `ai-tool`    | `pluginId`             | Every tool dispatched by one plugin                             |
| `isFeature`   | `ai-feature` | `feature`              | One harness feature (`tools`, `codemode`)                       |
| `isPlugin`    | `ai-feature` | `pluginId`             | Every feature requested by one plugin                           |

## Writing a policy

Rules compose into conditional decisions with the helpers and conditions
objects exported alongside them. A policy that allows two providers'
models, one tool server for one plugin, and one feature:

```ts
import { isPermission } from '@backstage/plugin-permission-common';
import type {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import {
  aiFeatureConditions,
  aiModelConditions,
  aiToolConditions,
  createAiFeatureConditionalDecision,
  createAiModelConditionalDecision,
  createAiToolConditionalDecision,
} from '@backstage/plugin-ai-backend/alpha';
import {
  aiFeatureUsePermission,
  aiModelUsePermission,
  aiToolUsePermission,
} from '@backstage/plugin-ai-common';

export class AiPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery, user?: PolicyQueryUser) {
    if (isPermission(request.permission, aiModelUsePermission)) {
      return createAiModelConditionalDecision(request.permission, {
        anyOf: [
          aiModelConditions.isProvider({ provider: 'anthropic' }),
          aiModelConditions.isModelType({ type: 'image' }),
        ],
      });
    }
    if (isPermission(request.permission, aiToolUsePermission)) {
      return createAiToolConditionalDecision(request.permission, {
        allOf: [
          aiToolConditions.isServer({ serverId: 'files' }),
          aiToolConditions.isPlugin({ pluginId: 'scaffolder' }),
        ],
      });
    }
    if (isPermission(request.permission, aiFeatureUsePermission)) {
      return createAiFeatureConditionalDecision(
        request.permission,
        aiFeatureConditions.isPlugin({ pluginId: 'scaffolder' }),
      );
    }
    if (user === undefined) {
      return { result: 'DENY' };
    }
    return { result: 'ALLOW' };
  }
}
```

The conditional-decision helper takes the permission and the criteria
directly; conditions come from the matching conditions object
(`aiModelConditions`, `aiToolConditions`, `aiFeatureConditions`) and
compose with `anyOf`, `allOf` and `not`. The caller's identity is the
optional second `user` argument of `handle`, never part of the query.
To narrow a policy instead of granting, compose with the `not` form —
for example, `{ not: aiFeatureConditions.isPlugin({ pluginId: 'scaffolder' }) }`
denies that plugin while leaving everyone else open.

## How conditions are evaluated

Only the permission and the caller's credentials cross the wire to the
permission backend. The resource attributes are held in the service and
evaluated in-process when the decision returns: the service validates the
returned decision envelope and the entire condition tree before evaluating
it, and any condition it cannot evaluate — an unknown rule, a foreign
resource type, malformed parameters — denies, fail closed, with the reason
recorded in the journal.

## The default and its sharp edge

With no policy configured, the permission framework allows everything:
every cataloged model can be dispatched, every tool used, every feature
granted. This is the standard Backstage default and it composes with the
community RBAC plugin the way other Backstage permissions do. The sharp
edge is the same one every resource permission has: a blanket `ALLOW` on
`ai.model.use` grants every cataloged model to every caller. If you run
with an open default, treat the model catalog in
[Configuration](./configuration.md#aimodels) as your exposure surface, and
narrow it with rules when you need to.
