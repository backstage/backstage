# Linguist Backend

Welcome to the Linguist backend plugin! This plugin provides data for the Linguist frontend features. Additionally, it provides an optional entity processor which will automate adding language tags to your entities.

## Setup

The following sections will help you get the Linguist Backend plugin setup and running.

### Up and Running

Here's how to get the backend up and running:

1. First we need to add the `@backstage/plugin-linguist-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-linguist-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/linguist.ts`, and add the
   following to it:

   ```ts
   import { TaskScheduleDefinition } from '@backstage/backend-tasks';
   import { createRouter } from '@backstage/plugin-linguist-backend';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const schedule: TaskScheduleDefinition = {
       frequency: { minutes: 2 },
       timeout: { minutes: 15 },
       initialDelay: { seconds: 90 },
     };

     return createRouter({ schedule: schedule }, { ...env });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import linguist from './plugins/linguist';
   // ...
   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const linguistEnv = useHotMemoize(module, () => createEnv('linguist'));
     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/linguist', await linguist(linguistEnv));
   ```

4. Now run `yarn start-backend` from the repo root
5. Finally open `http://localhost:7007/api/linguist/health` in a browser and it should return `{"status":"ok"}`

#### New Backend System

The Linguist backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
+ import { linguistPlugin } from '@backstage/plugin-linguist-backend';

  const backend = createBackend();

  // ... other feature additions

+ backend.add(linguistPlugin());

  backend.start();
```

The plugin options can be set through the `app-config.yaml`:

```yaml
// ...

linguist:
  schedule:
    frequency:
      minutes: 2
    timeout:
      minutes: 2
    initialDelay:
      seconds: 15
  age:
    days: 30
  batchSize: 2
  useSourceLocation: false

// ...
```

## Plugin Option

The Linguist backend has various plugin options that you can provide to the `createRouter` function in your `packages/backend/src/plugins/linguist.ts` file that will allow you to configure various aspects of how it works. The following sections go into the details of these options

### Batch Size

The Linguist backend is setup to process entities by acting as a queue where it will pull down all the applicable entities from the Catalog and add them to it's database (saving just the `entityRef`). Then it will grab the `n` oldest entities that have not been processed to determine their languages and process them. To control the batch size simply provide that to the `createRouter` function in your `packages/backend/src/plugins/linguist.ts` like this:

```ts
return createRouter({ schedule: schedule, batchSize: 40 }, { ...env });
```

**Note:** The default batch size is 20

### Kind

The default setup only processes entities of kind `['API', 'Component', 'Template']`. To control the `kind` that are processed provide that to the `createRouter` function in your `packages/backend/src/plugins/linguist.ts` like this:

```ts
return createRouter({ schedule: schedule, kind: ['Component'] }, { ...env });
```

### Refresh

The default setup will only generate the language breakdown for entities with the linguist annotation that have not been generated yet. If you want this process to also refresh the data you can do so by adding the `age` (as a `HumanDuration`) in your `packages/backend/src/plugins/linguist.ts` when you call `createRouter`:

```ts
return createRouter({ schedule: schedule, age: { days: 30 } }, { ...env });
```

With the `age` setup like this if the language breakdown is older than 15 days it will get regenerated. It's recommended that if you choose to use this configuration to set it to a large value - 30, 90, or 180 - as this data generally does not change drastically.

### Linguist JS options

The default setup will use the default [linguist-js](https://www.npmjs.com/package/linguist-js) options, a full list of the available options can be found [here](https://www.npmjs.com/package/linguist-js#API).

```ts
return createRouter(
  { schedule: schedule, linguistJsOptions: { offline: true } },
  { ...env },
);
```

### Use Source Location

You may wish to use the `backstage.io/source-location` annotation over using the `backstage.io/linguist` as you may not be able to quickly add that annotation to your Entities. To do this you'll just need to set the `useSourceLocation` boolean to `true` in your `packages/backend/src/plugins/linguist.ts` when you call `createRouter`:

```ts
return createRouter(
  { schedule: schedule, useSourceLocation: true },
  { ...env },
);
```

**Note:** This has the potential to cause a lot of processing, be very thoughtful about this before hand

## Linguist Tags Processor

The `LinguistTagsProcessor` can be added into your catalog builder as a way to incorporate the language breakdown from linguist as `metadata.tags` on your entities. Doing so enables the ability to easily filter for entities in your catalog index based on the language of the source repository.

### Processor Setup

Setup the linguist tag processor in `packages/backend/src/plugins/catalog.ts`.

```ts
import { LinguistTagsProcessor } from '@backstage/plugin-linguist-backend';
// ...
export default async function createPlugin(
  // ...
  builder.addProcessor(
    LinguistTagsProcessor.fromConfig(env.config, {
      logger: env.logger,
      discovery: env.discovery,
    })
  );
```

### Processor Options

The processor accepts configurations either directly as options when constructing using `fromConfig()`, or can also be configured in `app-config.yaml` with the same fields.

Example linguist processor configuration:

```yaml
linguist:
  tagsProcessor:
    bytesThreshold: 1000
    languageTypes: ['programming', 'markup']
    languageMap:
      Dockerfile: ''
      TSX: 'react'
    cacheTTL:
      hours: 24
```

#### `languageMap`

The `languageMap` option allows you to build a custom map of linguist languages to how you want them to show up as tags. The keys should be exact matches to languages in the [linguist dataset](https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml) and the values should be how they render as backstage tags. These values will be used "as is" and will not be further transformed.

Keep in mind that backstage has [character requirements for tags](https://backstage.io/docs/features/software-catalog/descriptor-format#tags-optional). If your map emits an invalid tag, it will cause an error during processing and your entity will not be processed.

If you map a key to `''`, it will not be emitted as a tag. This can be useful if you want to ignore some of the linguist languages.

```yaml
linguist:
  tagsProcessor:
    languageMap:
      # You don't want dockerfile to show up as a tag
      Dockerfile: ''
      # Be more specific about what the file is
      HCL: terraform
      # A more casual tag for a formal name
      Protocol Buffer: protobuf
```

#### `cacheTTL`

The `cacheTTL` option allows you to determine for how long this processor will cache languages for an `entityRef` before refreshing from the linguist backend. As this processor will run continuously, this cache is supplied to limit the load done on the linguist DB and API.

By default, this processor will cache languages for 30 minutes before refreshing from the linguist database.

You can optionally disable the cache entirely by passing in a `cacheTTL` duration of 0 minutes.

```yaml
linguist:
  tagsProcessor:
    cacheTTL: { minutes: 0 }
```

#### `bytesThreshold`

The `bytesThreshold` option allows you to control a number of bytes threshold which must be surpassed before a language tag will be emitted by this processor. As an example, some repositories may have short build scripts written in Bash, but you may only want the main language of the project emitted (an alternate way to control this is to use the `languageMap` to map `Shell` languages to `undefined`).

```yaml
linguist:
  tagsProcessor:
    # Ignore languages with less than 5000 bytes in a repo.
    bytesThreshold: 5000
```

#### `languageTypes`

The `languageTypes` option allows you to control what categories of linguist languages are automatically added as tags. By default, this will only include language tags of type `programming`, but you can pass in a custom array here to allow adding other language types.

You can see the full breakdown of linguist supported languages [in their repo](https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml).

For example, you may want to also include languages of type `data`

```yaml
linguist:
  tagsProcessor:
    languageTypes:
      - programming
      - data
```

#### `shouldProcessEntity`

The `shouldProcessEntity` is a function you can pass into the processor which determines which entities should have language tags fetched from linguist and added to the entity. By default, this will only run on entities of `kind: Component`, however this function let's you fully customize which entities should be processed.

As an example, you may choose to extend this to support both `Component` and `Resource` kinds along with allowing an opt-in annotation on the entity which entity authors can use.

As this option is a function, it cannot be configured in `app-config.yaml`. You must pass this as an option within typescript.

```ts
LinguistLanguageTagsProcessor.fromConfig(env.config, {
  logger: env.logger,
  discovery: env.discovery,
  shouldProcessEntity: (entity: Entity) => {
    if (
      ['Component', 'Resource'].includes(entity.kind) &&
      entity.metadata.annotations?.['some-custom-annotation']
    ) {
      return true;
    }
    return false;
  },
});
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/linguist)
- [The Backstage homepage](https://backstage.io)
