---
title: Supporting templating syntax in `parameters` schema
status: provisional
authors:
  - '@benjdlambert'
owners:
  - '@benjdlambert'
  - '@backstage/scaffolder-maintainers'
project-areas:
  - scaffolder
creation-date: 2024-03-26
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Supporting templating syntax in `parameters` schema

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/16275)

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

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

This BEP proposes to add support for templating syntax in the `parameters` schema of a scaffolder template.
This will allow users to define properties in the JSON Schema which are templated from current values that have been collected from the user already.
This can be useful when you want to use a value that has already been collected as a default value in another field.

For example:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my-template
spec:
  parameters:
    - title: Some input
      description: Get some info from the user
      properties:
        name:
          type: string
          default: Test
        description:
          type: string
          default: ${{ parameters.name or "unknown" }}-description
```

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

Inclusive of the initial RFC there's been a swarm of issues that are requesting this feature, and we want to align on the implementation and design of this feature.

See the following:

- https://github.com/backstage/backstage/issues/16275
- https://github.com/backstage/backstage/pull/23283
- https://github.com/backstage/backstage/issues/19597
- https://github.com/backstage/backstage/issues/20533
- https://github.com/backstage/backstage/pull/17746

There's some ideas for introducing a templating syntax for both templating into the `parameters` schema, and also being able to pass through some templating strings to underlying field extensions that can use those templating strings.
We want to align here so that we're not going to have those conflict or compete, and create a standard for how to achieve templating in both circumstances.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

- This BEP will settle the implementation for the templating of fields into the JSON Schema in the `parameters` section in the scaffolder templates.
- This BEP will settle how to pass through templating strings to underlying field extensions in a non-conflicting way.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

## Proposal

The proposal is to be able to decorate the template schema server side with a context and use that to drive the form rendering client side.

We can extend the `/parameter-schema` endpoint to accept a `formData` context query parameter which will be a JSON object of the current `formData` state. This in turn allows the scaffolder frontend to repeatedly call the endpoint to get the updated rendered parameter schema. We'll need to turn the endpoint into a `POST` endpoint to accept the form data, but will retain the `GET` version for backwards compatibility.

## Design Details

### Example implementation of the `/parameter-schema` endpoint

```diff
export interface ScaffolderApi {
  getTemplateParameterSchema(
    templateRef: string,
+    formData?: JsonObject,
  ): Promise<TemplateParameterSchema>;
}
```

```diff
 router
-    .get(
+    .post(
      '/v2/templates/:namespace/:kind/:name/parameter-schema',
      async (req, res) => {
        const credentials = await httpAuth.credentials(req);
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: credentials,
          targetPluginId: 'catalog',
        });
        const template = await authorizeTemplate(
          req.params,
          token,
          credentials,
        );

        const parameters = [template.spec.parameters ?? []].flat();
+        const secureTemplater = await SecureTemplater.loadRenderer({
+          templateFilters: {
+            ...createDefaultFilters({ integrations }),
+            ...additionalTemplateFilters,
+          },
+          templateGlobals: additionalTemplateGlobals,
+        });
+
+        const templatedParameters = parameters.map(parameter =>
+          renderTemplateString(
+            parameter,
+            {
+              parameters: req.body.formData,
+            },
+            secureTemplater,
+            logger,
+          ),
+        );
```

You can see a quick implementation of this in this [branch](https://github.com/backstage/backstage/compare/master...blam/templating-in-parameters)

### Workaround for the `default` field

There's a slight issue with the implementation of the `react-jsonschema-form`, which makes things like live updating on things like the `default` field slightly more difficult.
Currently, on first render, the default value is populated and then stored in the `formData` object or the current state, and the default value is never re-evaluated again at a later stage.

This means that if end users are wanting to set default values with `${{ parameters.myOtherProperty }}`, then they would need to ensure that they are on different steps in the form
as the form would need to be re-rendered, and for performance reasons, we don't want to re-render the form on every `formData` update.

We could fix this, by implementing custom logic for when the `parameter-schema` is updated, if the updated field is in a `default: *` field, then we replace the previous value with the new value in the `formData` automatically.
This is a pretty ugly workaround, but maybe the only option we have. Also at this point, pretty unsure if this affects any other parts of the `JSONSchema`, and we would also have to implement it for those fields if they exist.

### Templated error messages

Templating for `errorMessages` has been solved by using the `ajv-errors` library https://github.com/backstage/backstage/pull/25624, you can see more about [`backrefs` and pointers here](https://ajv.js.org/packages/ajv-errors.html). Any other template strings that will be passed through the underlying components and to be left untemplated should be encapsulated with options instead of passing through raw strings. The below example illustrates an `entityAndName` format, which under the hood, might do something like `${{ parameters.entity }} - ${{ parameters.name }}`, but this implementation never leaks out to the templating language.

```yaml
parameters:
  properties:
    ...
    description:
      type: string
      default: Test-description
      ui:field: CustomDisplayField
      ui:options:
        format: entityAndName
```

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

This change is backwards compatible, and can be released in a minor release. There's no breaking changes to worry about here.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->

### Templating client side

- This could lead to confusion as `filters` such as `parseRepoUrl` and `pick` and any custom filters which you define in the backend would not be available in the client side.

- Also with the limitations of the `default` value being updated only on first render and never re-evaluated, there's no performance benefit of doing things client side anymore.

### Accept limitation of the `default` field

Rather than using a workaround to support re-evaluating the `default` field, we could instead accept it as a limitation, and document it as such.

This is not desirable, as it is likely a very common use-case to want to template the `default` field, leading to a poor template creation experience.
