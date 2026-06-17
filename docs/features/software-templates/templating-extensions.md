---
id: templating-extensions
title: Templating Extensions
description: Templating extensions system
---

Backstage templating is powered by [Nunjucks][]. The basics:

# Templating Filters

The [filter][] is a critical mechanism for the rendering of Nunjucks templates,
providing a means of transforming values in a familiar [piped][] fashion.
Templating filters are functions that help you transform data, extract specific
information, and perform various operations in Scaffolder templates.

## Built-in

Backstage provides out of the box the following set of "built-in" templating
filters (to create your own custom filters, look to the section [Custom Filter](#custom-filter) hereafter):

### parseRepoUrl

The `parseRepoUrl` filter parses a repository URL into its constituent parts:
`owner`, repository name (`repo`), etc.

**Usage Example:**

```yaml
- id: log
  name: Parse Repo URL
  action: debug:log
  input:
    message: ${{ parameters.repoUrl | parseRepoUrl }}
```

- **Input**: `github.com?repo=backstage&owner=backstage`
- **Output**: "RepoSpec" (see [parseRepoUrl][])

### parseEntityRef

The `parseEntityRef` filter allows you to extract different parts of
an entity reference, such as the `kind`, `namespace`, and `name`.

**Usage example**

1. Without context

```yaml
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    message: ${{ parameters.owner | parseEntityRef }}
```

- **Input**: `group:techdocs`
- **Output**: [CompoundEntityRef][]

1. With context

```yaml
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    message: ${{ parameters.owner | parseEntityRef({ defaultKind:"group", defaultNamespace:"another-namespace" }) }}
```

- **Input**: `techdocs`
- **Output**: [CompoundEntityRef][]

### pick

The `pick` filter allows you to select a specific property (e.g. `kind`, `namespace`, `name`) from an object.

**Usage Example**

```yaml
- id: log
  name: Pick
  action: debug:log
  input:
    message: ${{ parameters.owner | parseEntityRef | pick('name') }}
```

- **Input**: `{ kind: 'Group', namespace: 'default', name: 'techdocs' }`
- **Output**: `techdocs`

### projectSlug

The `projectSlug` filter generates a project slug from a repository URL.

**Usage Example**

```yaml
- id: log
  name: Project Slug
  action: debug:log
  input:
    message: ${{ parameters.repoUrl | projectSlug }}
```

- **Input**: `github.com?repo=backstage&owner=backstage`
- **Output**: `backstage/backstage`

# Templating Globals

In addition to its powerful filtering functionality, the Nunjucks engine allows
access from the template expression context to specified globally-accessible
references. Backstage propagates this capability via the scaffolder backend
plugin, which we shall soon see in action.

# Customizing the templating environment

Custom plugins make it possible to install your own templating extensions, which
may be any combination of filters, global functions and global values. With the
new backend you would use a scaffolder plugin module for this; later we will
demonstrate the analogous approach with the old backend.

## Streamlining Templating Extension Module Creation with the Backstage CLI

The creation of a "template environment customization" module in Backstage can
be accelerated using the Backstage CLI.

Start by using the `yarn backstage-cli new` command to generate a scaffolder module. This command sets up the necessary boilerplate code, providing a smooth start:

```
$ yarn backstage-cli new
? What do you want to create?
  frontend-plugin - A new frontend plugin
  backend-plugin - A new backend plugin
❯ backend-plugin-module - A new backend module that extends an existing backend plugin
  plugin-web-library - A new web library plugin package
  plugin-node-library - A new Node.js library plugin package
  plugin-common-library - A new isomorphic common plugin package
  web-library - A library package, exporting shared functionality for web environments
```

When prompted, use the arrow keys to select the option to generate a `backend-plugin-module`.
Since we want to extend the Scaffolder backend, enter `scaffolder` when prompted for the ID of the plugin to extend.
Next, enter the ID (name) of your module. This will be appended to the `scaffolder-backend-module-` prefix. The CLI will then generate the required files and directory structure, for example:

```
? Enter the ID of the plugin [required] scaffolder
? Enter the ID of the module [required] foo-bar
  templating    plugins/scaffolder-backend-module-foo-bar ✔
  backend       adding @internal/plugin-scaffolder-backend-module-foo-bar ✔
  executing     yarn install ✔
  executing     yarn lint --fix ✔

🎉  Successfully created backend-plugin-module
```

**Directory Structure**

```
plugins
├── README.md
├── scaffolder-backend-module-foo-bar
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── index.ts
│       └── module.ts
```

## Writing your Module

Once the CLI has generated the essential structure for your new scaffolder
module, it's time to implement our templating extensions. Here we'll demonstrate
how to create each of the supported extension types.

`src/module.ts` is where the magic happens. First, we prepare to utilize the
associated (_**alpha** phase_) API extension point by adding the below import to `src/module.ts`:

```ts
import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
```

Considering the generated code, you may observe that everything rests on the
`createBackendModule` call, which after providing some minimal metadata to
establish context, specifies a `register` callback whose sole responsibility
here is to call, in turn, `registerInit` against the
`BackendModuleRegistrationPoints` argument it receives. Modify this call to
make the `scaffolderTemplatingExtensionPoint` available to the specified `init`
function:

```ts
  register(reg) {
    reg.registerInit({
      deps: {
        ...,
        templating: scaffolderTemplatingExtensionPoint,
      },
      async init({
        ...,
        templating
        }) {
        ...
      };
    });
  };
```

Now we're ready to extend the scaffolder templating engine. For our purposes
here we'll drop everything in `module.ts`; use your own judgment as to the
organization of your real-world plugin modules.

### Custom Filter

In this contrived example we add a filter to test whether the incoming string
value contains (at least) a specified number of occurrences of a given
substring. We can easily define this by adding code to our `init` callback:

```ts
async init({
  ...,
  templating,
}) {
  ...
  templating.addTemplateFilters({
    containsOccurrences: (arg: string, substring: string, times: number) => {
      let pos = 0;
      let count = 0;
      while (pos < arg.length) {
        pos = arg.indexOf(substring, pos);
        if (pos < 0) {
          break;
        }
        count++;
      }
      return count === times;
    },
  });
},
```

This demonstrates the bare minimum: a TypeScript `Record` of named templating
filter implementations to register. However, by adopting an alternate structure
we can document our filter with additional metadata; to utilize this capability
we begin by adding a new import:

```ts
import { createTemplateFilter } from '@backstage/plugin-scaffolder-node/alpha';
```

Then, update your `init` implementation to specify an array rather than an
object/record:

```ts
async init({
  ...,
  templating,
}) {
  ...
  templating.addTemplateFilters([
    createTemplateFilter({
      id: 'containsOccurrences',
      description: 'determine whether filter input contains a substring N times',
      filter: (arg: string, substring: string, times: number) => {
        let pos = 0;
        let count = 0;
        while (pos < arg.length) {
          pos = arg.indexOf(substring, pos);
          if (pos < 0) {
            break;
          }
          count++;
        }
        return count === times;
      },
    }),
  ]);
},
```

With this we have added a `description` to our filter, which helps a template
author to understand the filter's purpose.

#### Schema

To enhance our filter documentation further, we will specify its `schema`
using a callback against the [Zod][] schema declaration library:

```ts
    createTemplateFilter({
      id: 'containsOccurrences',
      description: 'determine whether filter input contains a substring N times',
      schema: z =>
        z.function(
          z.tuple([
            z.string().describe('input'),
            z.string().describe('substring whose occurrences to find'),
            z.number().describe('number of occurrences to check for'),
          ]),
          z.boolean(),
        ),
      ...,
    }),
```

Because a filter is, in fact, a function, its schema is defined by generating a
[Zod function schema][zod-fn] against the parameter supplied to our schema
callback. A filter function is required to have at least one argument; in this
example, we have two additional arguments. But what if we modify our filter's
implementation function to make `times` optional? Code:

```ts
    createTemplateFilter({
      id: 'containsOccurrences',
      ...,
      filter: (arg: string, substring: string, times?: number) => {
        if (times === undefined) {
          // note that, in real life, simply calling this function directly with Nunjucks would suffice rather than implementing a filter:
          return arg.includes(substring);
        }
        // original implementation follows
        ...
      },
    }),
```

In this case we should modify our `schema`:

```ts
    createTemplateFilter({
      ...,
      schema: z =>
        z.function(
          z.tuple([
            z.string().describe('input'),
            z.string().describe('substring whose occurrences to find'),
            z
              .number()
              .describe('number of occurrences to check for')
              .optional(),
          ]),
          z.boolean(),
        ),
      ...,
    }),
```

#### Filter Example Documentation

Our filter documentation may benefit from examples which we specify thus:

```ts
    createTemplateFilter({
      ...,
      examples: [
        {
          description: 'Basic Usage',
          example: `\
- name: Contains Occurrences
  action: debug:log
  input:
    message: \${{ parameters.projectName | containsOccurrences('-', 2) }}
          `,
          notes: `\
- **Input**: \`foo-bar-baz\`
- **Output**: \`true\`
      `,
        },
        {
          description: 'Omitting Optional Parameter',
          example: `\
- name: Contains baz
  action: debug:log
  input:
    message: \${{ parameters.projectName | containsOccurrences('baz') | dump }}
          `,
          notes: `\
- **Input**: \`foo-bar\`
- **Output**: \`false\`
        `,
        },
      ],
    }),
```

### Custom Global Function

In case your template needs access to a value generated from a function not
appropriately modeled as a filter, Nunjucks supports the direct invocation of
[global functions][global-fn]. We might, for example, add to `init`:

```ts
async init({
  ...,
  templating,
}) {
  ...
  templating.addTemplateGlobals({
    now: () => new Date().toISOString(),
  });
},
```

Here we have implemented a simple mechanism to obtain a timestamp (note that
because we can only pass JSON-compatible--or `undefined`--values we have chosen
to model a date/time as an ISO string) using a globally available function.

Again we have the option to make our global function self-documenting. Import:

```ts
import {
  ...,
  createTemplateGlobalFunction,
} from '@backstage/plugin-scaffolder-node/alpha';
```

Then modify:

```ts
  ...
  templating.addTemplateGlobals([
    createTemplateGlobalFunction({
      id: 'now',
      description:
        'obtain an ISO representation of the current date and time',
      fn: () => new Date().toISOString(),
    }),
  ]);
```

#### Schema

Declaring a global function schema is quite like the schema declaration for a
templating filter:

```ts
    createTemplateGlobal({
      ...,
      schema: z => z.function().args().returns(z.string()),
      ...,
    }),
```

#### Global Function Example Documentation

Again, this works in the same way as filter examples:

```ts
    createTemplateGlobal({
      ...,
      examples: [
        {
          description: 'Obtain the current date/time',
          example: `\
- name: Log Timestamp
  action: debug:log
  input:
    message: Current date/time: \${{ now() }}
          `,
          // optional `notes` omitted from this example
        },
      ],
      ...,
    }),

```

### Custom Global Value

Alternatively, you may need to provide templates access to a simple JSON value, which can
be registered in this manner:

```ts
async init({
  ...,
  templating,
}) {
  ...
  templating.addTemplateGlobals({
    ...,
    preferredMetasyntacticIdentifier: 'foo',
  });
},
```

Or the documenting form:

```ts
async init({
  ...,
  templating,
}) {
  ...
  templating.addTemplateGlobals([
    ...,
    createTemplateGlobalValue({
      id: 'preferredMetasyntacticIdentifier',
      value: 'foo',
      description:
        'This description is as contrived as the global value it documents',
    }),
  ]);
},
```

## Register Templating Extensions with the Legacy Backend System

Users of the original Backstage backend can register templating extensions by
specifying options to the scaffolder backend plugin's `createRouter` function
(customarily called in `packages/backend/src/plugins/scaffolder.ts`):

- `additionalTemplateFilters` - either of:
  - object mapping filter name to implementation function, or
  - array of documented templating filters as returned by the
    utility function `createTemplateFilter`
- `additionalTemplateGlobals` - either of:
  - object mapping global name to value or function, or
  - array of documented global functions and values as returned by the utility
    functions `createTemplateGlobalFunction` and `createTemplateGlobalValue`

[nunjucks]: https://mozilla.github.io/nunjucks
[filter]: https://mozilla.github.io/nunjucks/templating.html#filters
[global-fn]: https://mozilla.github.io/nunjucks/templating.html#global-functions
[parseRepoUrl]: https://backstage.io/api/stable/functions/_backstage_plugin-scaffolder-node.index.parseRepoUrl.html
[CompoundEntityRef]: https://backstage.io/api/stable/types/_backstage_catalog-model.index.CompoundEntityRef.html
[Zod]: https://zod.dev/
[zod-fn]: https://zod.dev/?id=functions
[piped]: https://en.wikipedia.org/wiki/Pipeline_(Unix)#Pipelines_in_command_line_interfaces
