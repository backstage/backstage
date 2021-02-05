---
id: extending-index
title: Extending the Scaffolder
---

Welcome. Take a seat. You're at the Scaffolder Documentation.

So, you want to create stuff inside your company from some prebaked templates?
You're at the right place.

This guide is going to take you through how the Scaffolder in Backstage works.
We'll dive into some jargon and run through what's going on in the backend to be
able to create these templates. There's also more guides that you might find
useful at the bottom of this document. At its core, there are 3 simple stages.

1. Pick a skeleton
2. Template some variables into the skeleton
3. Send the templated skeleton somewhere

These three steps are translated to the following stages under the hood in the
scaffolder that you will need to know:

1. Prepare
2. Template
3. Publish

Each of these steps can be configured for your own use case, but we provide some
sensible defaults, too.

Let's dive a little deeper into these phases.

### Glossary and Jargon

**Preparer** - The preparer is responsible for fetching the skeleton code and
placing it into a directory and then will return that directory. It is
registered with the `Preparers` with a particular type, which is then used in
the router to pick the correct `Preparer` to run for the `Template` entity.

**Templater** - The templater is responsible for actually running the chosen
templater on top of the previously returned temporary directory from the
**Preparer**. We advise making these Docker containers as it can keep all
dependencies--for example Cookiecutter--self contained and not a dependency on
the host machine.

**Publisher** - The publisher is responsible for taking the finished directory,
and publishing it to a remote registry. This could be a Git repository or
something similar. Right now, the scaffolder only supports one publishing method
for the entire lifecycle, but it could be configured from the frontend and
passed through to the scaffolder backend.

### How it works

Most of the heavy lifting is done in the
[router.ts](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/service/router.ts#L93)
file in the `scaffolder-backend` plugin.

There are two routes defined in the router: `POST /v1/jobs` and
`GET /v1/job/:jobId`

To create a scaffolding job, a JSON object containing the
[Template Entity](../../software-catalog/descriptor-format.md#kind-template) +
additional templating values must be posted as the post body.

```js
{
  "template": {
    "apiVersion": "backstage/v1alpha1",
    "kind": "Template",
    // more stuff here
  },
  "values": {
    "component_id": "test",
    "description": "somethingelse"
  }
}
```

The values should represent something that is valid with the `schema` part of
the [Template Entity](../../software-catalog/descriptor-format.md#kind-template)

Once that has been posted, a job will be setup with different stages, and the
job processor will complete each stage before moving onto the next stage, whilst
collecting logs and mutating the running job.

Here's some further reading that you might find useful:

- [Adding your own Template](../adding-templates.md)
- [Creating your own Templater](./create-your-own-templater.md)
- [Creating your own Publisher](./create-your-own-publisher.md)
- [Creating your own Preparer](./create-your-own-preparer.md)
