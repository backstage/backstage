---
id: authorizing-parameters-steps-and-actions
title: 'Authorizing parameters, steps and actions'
description: How to authorize part of a template
---

The scaffolder plugin integrates with the Backstage [permission framework](../../permissions/overview.md), which allows you to control access to certain parameters and steps in your templates based on the user executing the template.

### Authorizing parameters and steps

To mark specific parameters or steps as requiring permission, add the `backstage:permissions` property to the parameter or step with one or more tags. For example:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my_custom_template
  parameters:
    - title: Provide some simple information
      properties:
        title:
          title: Title
          type: string
    - title: Extra information
      properties:
        description:
          title: Description
          type: string
      backstage:permissions:
        tags:
          - secret
  steps:
    - id: step1
      name: First log
      action: debug:log
      input:
        message: hello
    - id: step2
      name: Log message
      action: debug:log
      input:
        message: hello
      backstage:permissions:
        tags:
          - secret
```

In this example, the `description` parameter and the `step2` step are marked with the `secret` tag.

To conditionally authorize parameters and steps based on the user executing the template, [edit your permission policy](../../permissions/writing-a-policy.md), by targeting `templateParameterReadPermission` and `templateStepReadPermission` permissions, which are provided by the scaffolder plugin. For example:

```ts
import {
  templateParameterReadPermission,
  templateStepReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderTemplateConditions,
} from '@backstage/plugin-scaffolder-backend/alpha';

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (
      isPermission(request.permission, templateParameterReadPermission) ||
      isPermission(request.permission, templateStepReadPermission)
    ) {
      if (user?.identity.userEntityRef === 'user:default/spiderman')
        return createScaffolderTemplateConditionalDecision(request.permission, {
          not: {
            allOf: [
              scaffolderTemplateConditions.hasTag({ tag: 'secret' }),
              scaffolderTemplateConditions.hasTag({ tag: 'secret' }),
            ],
          },
        });
    }

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}
```

In this example, the user `spiderman` is not authorized to read parameters or steps marked with the `secret` tag.

By combining this feature with restricting the ingestion of templates in the Catalog as recommended in our threat model, you can create a solid system to restrict certain actions.

### Authorizing actions

Similar to parameters and steps, the scaffolder plugin exposes permissions to restrict access to certain actions. This can be useful if you want to secure your templates.

To restrict access to a particular action, you can modify your permission policy as follows:

```ts
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from '@backstage/plugin-scaffolder-backend/alpha';

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, actionExecutePermission)) {
      if (user?.identity.userEntityRef === 'user:default/spiderman') {
        return createScaffolderActionConditionalDecision(request.permission, {
          not: scaffolderActionConditions.hasActionId({
            actionId: 'debug:log',
          }),
        });
      }
    }

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}
```

With this permission policy, the user `spiderman` won't be able to execute the debug:log action.

You can also restrict the input provided to the action by combining multiple rules.
In the example below, spiderman won't be able to execute debug:log when passing `{ "message": "not-this!" }` as action input:

```ts
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from '@backstage/plugin-scaffolder-backend/alpha';

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, actionExecutePermission)) {
      if (user?.identity.userEntityRef === 'user:default/spiderman') {
        return createScaffolderActionConditionalDecision(request.permission, {
          not: {
            allOf: [
              scaffolderActionConditions.hasActionId({ actionId: 'debug:log' }),
              scaffolderActionConditions.hasProperty({
                key: 'message',
                value: 'not-this!',
              }),
            ],
          },
        });
      }
    }

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}
```

Although the rules exported by the scaffolder are simple, combining them can help you achieve more complex cases.
