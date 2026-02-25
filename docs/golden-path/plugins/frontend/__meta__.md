<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Sections

## Creating your first plugin

### Scaffolding a new plugin

Talk through how to run the `backstage-cli create` command as well as what the output it creates is. This should touch on why we install this into `packages/app`.

### Debugging

How to handle common errors.

## First steps with the new plugin

### Creating a todo plugin

We're going to be creating the frontend for a todo list plugin. We want the user to be able to create todos for themselves and show the user their current list of todos.

To start, we'll use a list of mocked data.

### Controlling your component dynamically

Update the mocked data to be controlled by config.

### HTTP API

We want our todo plugin to reach the backend that we implemented in [the backend plugin Golden Path](../backend/001-first-steps.md). Let's write a client to do this (or use OpenAPI to generate a client for us).

### Testing

Unit tests - Let's write a unit test using React Testing Library to make sure that everything is working as expected.
Integration tests - Let's write an integration test using Playwright to _really_ make sure everything is working.
