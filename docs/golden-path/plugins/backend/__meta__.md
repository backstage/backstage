<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Sections

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

### Persistence

Saving values to the database. Writing a migrations file. Plumbing through the database service.

## SCM Integrations

Our users love the new plugin, and now they want it to automatically fetch todos from their source code.

### Testing

Let's write a unit test using `supertest` to make sure that everything is working as expected.
