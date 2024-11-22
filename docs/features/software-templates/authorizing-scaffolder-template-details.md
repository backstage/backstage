---
id: authorizing-scaffolder-template-details
title: 'Authorizing scaffolder tasks, parameters, steps, and actions'
description: How to authorize parts of a template and authorize scaffolder task access
---

The scaffolder plugin integrates with the Backstage [permission framework](../../permissions/overview.md), which allows you to control access to certain parameters and steps in your templates based on the user executing the template. It also allows you to control access to scaffolder tasks.

### Authorizing parameters and steps

To mark specific parameters or steps as requiring permission, add the `backstage:permissions` property to the parameter or step with one or more tags. For example:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my_custom_template
spec:
  type: service
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

```ts title="packages/backend/src/plugins/permission.ts"
/* highlight-add-start */
import {
  templateParameterReadPermission,
  templateStepReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderTemplateConditions,
} from '@backstage/plugin-scaffolder-node/alpha';
/* highlight-add-end */

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    /* highlight-add-start */
    if (
      isPermission(request.permission, templateParameterReadPermission) ||
      isPermission(request.permission, templateStepReadPermission)
    ) {
      if (user?.info.userEntityRef === 'user:default/spiderman')
        return createScaffolderTemplateConditionalDecision(request.permission, {
          not: scaffolderTemplateConditions.hasTag({ tag: 'secret' }),
        });
    }
    /* highlight-add-end */

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

```ts title="packages/backend/src/plugins/permission.ts"
/* highlight-add-start */
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from '@backstage/plugin-scaffolder-node/alpha';
/* highlight-add-end */

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    /* highlight-add-start */
    if (isPermission(request.permission, actionExecutePermission)) {
      if (user?.info.userEntityRef === 'user:default/spiderman') {
        return createScaffolderActionConditionalDecision(request.permission, {
          not: scaffolderActionConditions.hasActionId({
            actionId: 'debug:log',
          }),
        });
      }
    }
    /* highlight-add-end */

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}
```

With this permission policy, the user `spiderman` won't be able to execute the `debug:log` action.

You can also restrict the input provided to the action by combining multiple rules.
In the example below, `spiderman` won't be able to execute `debug:log` when passing `{ "message": "not-this!" }` as action input:

```ts title="packages/backend/src/plugins/permission.ts"
/* highlight-add-start */
import { actionExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from '@backstage/plugin-scaffolder-node/alpha';
/* highlight-add-end */

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    /* highlight-add-start */
    if (isPermission(request.permission, actionExecutePermission)) {
      if (user?.info.userEntityRef === 'user:default/spiderman') {
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
    /* highlight-add-end */

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}
```

### Authorizing scaffolder tasks

The scaffolder plugin also exposes permissions that can restrict access to tasks, task logs, task creation, and task cancellation. This can be useful if you want to control who has access to these areas of the scaffolder.

```ts title="packages/src/backend/plugins/permissions.ts"
/* highlight-add-start */
import {
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
/* highlight-add-end */

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    /* highlight-add-start */
    if (isPermission(request.permission, taskCreatePermission)) {
      if (user?.info.userEntityRef === 'user:default/spiderman') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    if (isPermission(request.permission, taskCancelPermission)) {
      if (user?.info.userEntityRef === 'user:default/spiderman') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    if (isPermission(request.permission, taskReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/spiderman') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    /* highlight-add-end */

    return {
      result: AuthorizeResult.DENY,
    };
  }
}
```

In the provided example permission policy, we only grant the `spiderman` user permissions to perform/access the following actions/resources:

- Read all scaffolder tasks and their associated events/logs.
- Cancel any ongoing scaffolder tasks.
- Trigger software templates, which effectively creates new scaffolder tasks.

Any other user would be denied access to these actions/resources.

Although the rules exported by the scaffolder are simple, combining them can help you achieve more complex use cases.

### Authorizing in the New Backend System

Instead of the changes in `permission.ts` noted in the above example you will make them in your `index.ts`. You will need to create a module where your permission policy will get added. Here is a very simplified example of how to do that:

```ts title="packages/backend/src/index.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  AuthorizeResult,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    // Various scaffolder permission checks ...

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

const customPermissionBackendModule = createBackendModule({
  pluginId: 'permission',
  moduleId: 'allow-all-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new ExamplePermissionPolicy());
      },
    });
  },
});

const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(customPermissionBackendModule);
/* highlight-add-end */
```

:::note Note

The `ExamplePermissionPolicy` here could be the one from the [Authorizing parameters and steps](#authorizing-parameters-and-steps) example or from the [Authorizing actions](#authorizing-actions) example. It would work the same way for both of them.

:::
