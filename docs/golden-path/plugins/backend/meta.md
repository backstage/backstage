<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Glossary

- Page: A single `md` file.
- Guide: A number of pages grouped under the same folder.

# Overall Writing Guidelines

The goal of these docs is to provide a comprehensive set of guides that developers + admins can use to quickly get up to speed with plugin development, and then refer to as they're developing their own plugins.

A user that finishes all of these guides will feel comfortable implementing plugins on their own. If additional assistance is required, they should be referred to other sources of information such as Discord, GitHub, source code, or documentation for further support. The user will also understand why/when to build their own plugins, inner-sourcing their developer portal and contributing internal plugins back to the open-source project.

At the same time, not all users will finish the docs or they may come back to them as required. Individual guides should have strong "abstracts" (what will I learn by reading this guide), table of contents, and "next steps" (what do I need to do next) to guide users to read the most important pieces for their work.

When writing guide pages, keep it light! These should be instructional docs, and at the same time conversational and a joy to read. Guides should build on each other, when reading through a progression, the reader should feel more comfortable and confident with concepts as they pop up across progression levels. Guides should be standalone, when finishing one level (for example 101), you should be able to immediately jump into the next (201) without additional research or background. Referencing previous progression levels is ok.

# Sections

## Why build plugins?

This section should answer definitely why you should build a new plugin. The Backstage framework is deeply empowered by plugins and plugins are core to the project's success. Users should walk away from reading this section with a conviction that plugins are the right path for new functionality.

## Sustainable plugin development

Plugins are not developed in a vacuum. Users should reach for them to solve specific business problems facing their developers, for example, you may be tasked to create

- a new vendor integration like PagerDuty,
- a new plugin backend that talks to an internal service,
- etc.

This section should contain learnings from successful Backstage deployments about how to engage with stakeholders, how/when to iterate on your plugin, and setting yourself up for future success.

## Creating your first plugin

This section should be extremely deliberate in showing readers every step of the way to create a plugin using Backstage's best practices. A reader that finishes this section should feel extremely comfortable creating new plugins and how to install and use plugins regardless of their experience with JS/TS and Backstage.

### Setting up your environment

This can point to the getting started section for setting everything up. Users should have NodeJS and yarn installed. They should also already have a scaffolded app.

### Scaffolding a new plugin

Talk through how to run the `backstage-cli create` command as well as what the output it creates is. This should touch on why we install this into `packages/backend`.

### Debugging

How to handle common errors like,

- Declaration error, `export default` missing
- Startup error, `httpRouter` failed to start

## First steps with the new plugin

### Creating a todo plugin

We're going to be creating the backend for a todo list plugin. We want the user to be able to create todos for themselves and show the user their current list of todos.

To start, we will use an in-memory solution that naively writes to an array.

```ts
const todos = [];
todos.push({ id: 1, text: 'Write some code.' });
console.log(todos);
```

### HTTP API

We want our todo plugin to be externally accessible - in Backstage, the way we do that is through an HTTP API.

```ts
app.post('/create', async (req, res) => {
  todos.push(req.body);
});

app.get('/list', async (req, res) => {
  res.json(todos);
});
```

### Testing

Let's write a unit test using `supertest` to make sure that everything is working as expected.

After verifying everything, introduce the problem of persistence - the todos aren't saved across reloads.

### Persistence

Saving values to the database. Writing a migrations file. Plumbing through the database service.

## Integrations

Now that our plugin is ready for prime time, let's see how we can really leverage the rest of the Backstage ecosystem. Backstage provides a set of core features out of the box, namely, the Software Catalog, Search, Permissions, and Notifications.

### Catalog

We want to show our todos as separate Catalog entities. How can we make this happen?

### Search

We want to make our todos searchable.

### Permissions

We only want users to be able to find their own todos.

### Notifications

We want to set an alarm time for todos that sends a notification when the time is met.

## SCM Integrations

Our users love the new plugin, and now they want it to automatically fetch todos from their source code.

## Additional Resources and Further Reading

- **Real-world Implementations and Lessons**

  - [Case studies and examples from the community](https://github.com/backstage/community#newsletters).
  - Best practices derived from mature implementations.
  - [Existing open-source community-maintained plugins](https://github.com/backstage/community-plugins).

- **Resource Compendium**

  - [Backstage Glossary](https://backstage.io/docs/references/glossary) of key terms.
  - Recommended readings and tools for advanced developers.

- **Certification and Learning Pathways**
  - Pathways to deepen your understanding and expertise in plugin development for Backstage.

Stay tuned for detailed exploration and guidance in each of these modules. We're excited to accompany you on your plugin development journey!
