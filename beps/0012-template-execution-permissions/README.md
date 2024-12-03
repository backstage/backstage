---
title: Template Execution Permissions
status: implementable
authors:
  - '@cptnfizzbin'
owners:
  - '@cptnfizzbin'
project-areas:
  - scaffolder
  - permissions
creation-date: 2024-12-02
---

# BEP: Template Execution Permissions

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

Companies are able to create custom actions and fields for their templates, and will want to restrict who can execute a
template action to specific groups of users.

With the existing permissions `stepReadPermission` and `parameterReadPermission`, the template sections can be
restricted, but still allows the template to run. This can result in "successful" templates that silently fail. For
example, a template could be written to scaffold out a Backstage plugin, but the user is not allowed to read the
`publish:github` action. The template would succeed, but the push to github would be skipped.

Using `catalogEntityReadPermission` can restrict execution, however this would also hide the entity from the catalog for
the user. The entity page for templates can be used by companies to provide additional information about the template,
and if a user doesn't have permission to run the template, information on why and how to get permission can be displayed
on that page.

Adding a `templateExecutePermission` will allow policy writers to explicitly restrict execution of a template based on
built in rules, and any custom rules created by the writer. An additional entity `spec` section for permissions would
provide a dedicated section to provide data to built in or custom permission rules.

## Motivation

### Goals

- Add `templateExecutePermission` that can be targeted to restrict execution of templates
  - eg. restrict custom actions to a specific set of users
- Allow policy writers to add custom rules
  - eg. custom rule for `userInTaggedGroup`
- Filter the template list to only templates the user can execute
  - eg. if a user can't run one of the actions in the template, the template is not visible
- Add section to the template spec for permission related data
  - eg. `spec.permissions.groups`, `spec.permissions.tags`
- (optimization) pull templates via the scaffolder API instead of directly from the Catalog API
  - Will allow for more performant permission checks, and allow for additional Scaffolder specific processing
- (optional) deprecation of the `stepRead` and `parameterRead` permissions
  - Reduce complexity of permissions for template execution

### Non-Goals

- Changes to the scaffolder tasks permissions
- Changes to the core permissions framework

## Proposal

## Design Details

Initial implementation: https://github.com/backstage/backstage/pull/27748

Following prior work in the Catalog Plugin, permission policy writers would be able to craft custom rules to restrict
who is able to execute a permission based on the parameters, actions, or other fields from the entity object using
custom
rules.

```ts title="packages/backend/src/extensions/scaffolderPermissionRules.ts"
/**
 * Example permission rule to restrict a template as a whole to specific user groups
 * Allowing template creators to specify who should be able to run their template
 */
const userInTaggedGroupRule = createScaffolderTemplateEntityPermissionRule({
  name: 'USER_IN_TAGGED_GROUP',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
  description: `Check if the user is part of a tagged group`,
  paramsSchema: z.object({
    userGroupRefs: z
      .string()
      .array()
      .describe('entityRefs of groups the user is part of'),
  }),
  apply: (resource, { userGroupRefs }) => {
    const taggedGroups = resource.spec?.permissions?.groups || [];
    if (taggedGroups.length === 0) return true; // Template is not restricted to any groups

    const matchedGroup = taggedGroups.find(ref => userGroupRefs.includes(ref));

    return !!matchedGroup;
  },
  toQuery: () => ({}),
});

/**
 * Example permission rule to restrict templates that use an action to specific user groups
 * Allowing for admins to restrict who can use a template with a restricted custom action.
 */
const canExecActionRule = createScaffolderTemplateEntityPermissionRule({
  name: 'CAN_EXEC_ACTION',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE_ENTITY,
  description: `Check if the user has a group required for an action`,
  paramsSchema: z.object({
    actionId: z.string().describe('the id of the action to check'),
    requiredGroupRef: z
      .string()
      .describe('the entity ref of the group that is required'),
    userGroupRefs: z
      .string()
      .array()
      .describe('entityRefs of groups the user is part of'),
  }),
  apply: (resource, { actionId, requiredGroupRef, userGroupRefs }) => {
    const actionIds = resource.spec.steps.map(step => step.id);
    if (!actionIds.include(actionId)) return true; // action is not included in template
    return userGroupsRef.includes(requiredGroupRef);
  },
  toQuery: () => ({}),
});

// Namespace for custom conditions
export const customScaffolderTemplateEntityConditions = {
  userInTaggedGroup: createConditionFactory(userInTaggedGroupRule),
  canExecAction: createConditionFactory(canExecActionRule),
};
```

Once defined, custom rules can be installed via a new extension point:

```ts title="packages/backend/src/extensions/scaffolderPermissionRules.ts"
import { scaffolderPermissionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'permission-rules',
  register(reg) {
    reg.registerInit({
      deps: { scaffolder: scaffolderPermissionsExtensionPoint },
      async init({ scaffolder }) {
        scaffolder.addPermissionRule(userInTaggedGroupRule);
        scaffolder.addPermissionRule(canExecActionRule);
      },
    });
  },
});
```

And then used in policies to restrict template execution.

```ts title="packages/backend/src/extensions/permissionsPolicyExtension.ts"
class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    //...

    if (isPermission(request.permission, templateExecutePermission)) {
      const userGroupsRefs = getUserGroups(user);

      return createScaffolderTemplateEntityConditionalDecision(
        request.permission,
        {
          allOf: [
            customScaffolderTemplateEntityConditions.userInTaggedGroup({
              userGroupRefs: userGroupsRefs,
            }),
            customScaffolderTemplateEntityConditions.canExecActionRule({
              actionId: 'action:restricted',
              requiredUserGroup: 'group:default/special',
              userGroupRefs: userGroupsRefs,
            }),
          ],
        },
      );
    }

    //...
  }
}
```

In the "create..." template index page, templates that fail the permission check would be hidden in the listing.
Alternately, the template could be displayed, but disabled, with a notice saying that the user does not have permission
to run the template. A future update to permissions could provide a space for a reason to be provided to the user on why
a permission was denied, but that is outside the scope of this BEP.

## Release Plan

- Add experimental permission `templateExecutePermission` (#27748)
- Add `permissionRulesExtensionPoint` to support custom actions (#27748)
- Gather feedback on common conditions used for restricting templates
- If decided, deprecation of the `stepRead` and `parameterRead` permission

## Dependencies

- None currently

## Alternatives

- using `catalogEntityReadPermission` to restrict template visibility
  - Also removes the template from the catalog for the user. Viewing a
    template and executing the template should be two separate permissions
