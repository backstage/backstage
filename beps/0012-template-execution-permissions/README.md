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

Companies are able to create custom actions and fields for their templates, and will want to restrict who can execute a template action to specific groups of users.

With the existing permissions `stepReadPermission`, `parameterReadPermission`, and `actionExecutePermission` the template sections can be restricted, but still allows the template to partially run. This can result in "successful" templates that silently fail. For example, a template could be written to scaffold out a Backstage plugin, but the user is not allowed to read the`publish:github` action. The template would succeed, but the push to github would be skipped.

Using `catalogEntityReadPermission` can restrict execution, however this would also hide the entity from the catalog for the user. The entity page for templates can be used by companies to provide additional information about the template, and if a user doesn't have permission to run the template, information on why and how to get permission can be displayed on that page.

## Motivation

### Goals

- Pull templates via the scaffolder API instead of directly from the Catalog API
  - To allow for more performant permission checks
- Filter the template list to only templates the user can execute
  - eg. if a user can't run one of the actions in the template, the template is not visible
- update/rename section in the action spec for permissions related data
  - Currently under `spec.step[].backstage:permissions`
  - eg. `spec.step[].permissions.groups`, `spec.step[].permissions.tags`

### Non-Goals

- Changes to the scaffolder tasks permissions
- Changes to the core permissions framework

## Proposal

This proposal is for enhancements to the Backstage Scaffolder permissions system to allow companies to have better access controls for custom actions and to improve UX around if a user is able to execute a template or not. Currently if a permission like `stepReadPermission` or `actionExecutePermission` evaluates to `DENY`, the user is still able to execute the template after filling in all the details for the template, which may result in the template failing. If permissions for actions and fields was able to be checked ahead of time (for statically given values) the index page can be filtered down to just the list of templates that the User could potentially execute.

## Design Details

The bulk of this would be implemented via adding a `scaffolderPermissionsExtensionPoint` following prior work in the Catalog Plugin. This would allow for policy writers to easily craft their own rules instead of needing to rely on the existing group of permissions. (Note: options to add custom permission rules currently exists for the legacy backend plugin, but not for the new backend.)

As an example, permission policy writers would be able to craft custom rules to restrict who is able to execute an action based on fields from the template action.

```ts title="packages/backend/src/extensions/scaffolderPermissionRules.ts"
/**
 * Example permission rule to restrict a template as a whole to specific user groups
 * Allowing template creators to specify who should be able to run their template
 */
const userInTaggedGroupRule = createScaffolderTemplateEntityPermissionRule({
  name: 'USER_IN_TAGGED_GROUP',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  description: `Check if the user is part of a tagged group`,
  paramsSchema: z.object({
    userGroupRefs: z
      .string()
      .array()
      .describe('entityRefs of groups the user is part of'),
  }),
  apply: (action, { userGroupRefs }) => {
    const taggedGroups = action.permissions?.groups || [];
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
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  description: `Check if the user is part of a group required for this action`,
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
  apply: (action, { actionId, requiredGroupRef, userGroupRefs }) => {
    if (action.id !== actionId) return true; // action is not restricted
    return userGroupsRef.includes(requiredGroupRef);
  },
  toQuery: () => ({}),
});

// Namespace for custom conditions
export const customScaffolderActionConditions = {
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

    if (isPermission(request.permission, actionExecutePermission)) {
      const userGroupsRefs = getUserGroups(user);

      return createScaffolderActionConditionalDecision(request.permission, {
        allOf: [
          customScaffolderActionConditions.userInTaggedGroup({
            userGroupRefs: userGroupsRefs,
          }),
          customScaffolderActionConditions.canExecAction({
            actionId: 'action:restricted',
            requiredUserGroup: 'group:default/special',
            userGroupRefs: userGroupsRefs,
          }),
        ],
      });
    }

    //...
  }
}
```

In the "create..." template index page, templates that fail one or more of the action permission checks would be hidden in the listing. Alternately, the template could be displayed, but disabled, with a notice saying that the user does not have permission to run one or more actions.

## Release Plan

- Add `permissionRulesExtensionPoint` to support custom actions (#28053)
- Update scaffolder to pull templates via the scaffolder router
- Update scaffolder router to check that the user can execute all template actions

## Dependencies

- None currently

## Alternatives

- using `catalogEntityReadPermission` to restrict template visibility
  - Also removes the template from the catalog for the user. Viewing a template and executing the template should be two separate permissions
- adding a `templateExecutePermission` to restrict at a high level
  - a high level permission would need to be re-evaluated for each action after template substitutions
  - the template task worker does not have access to the full template object during execution
