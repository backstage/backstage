<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Sections

## Creating your first plugin

### Scaffolding a new plugin

Talk through how to run the `backstage-cli create` command as well as what the output it creates is. This should touch on why we install this into `packages/app`.

### Debugging

How to handle common errors.

## First steps with the new plugin

### Exploring the scaffolded code

Walk through the generated TodoPage and TodoList components, the plugin definition, and how they fit together.

### Controlling your component dynamically

Show how to disable extensions and configure them dynamically using a PageBlueprint config schema and validated config passed into factories (without using configApiRef).

### HTTP API

The scaffolded plugin already fetches from the backend. Walk through how discoveryApiRef and fetchApiRef work together, and show how to extract a client class.

### Testing

Unit tests - Let's write a unit test using React Testing Library to make sure that everything is working as expected.
Integration tests - Let's write an integration test using Playwright to _really_ make sure everything is working.
