---
id: external-integrations
title: External integrations
# prettier-ignore
description: Documentation on External integrations to integrate systems with Backstage
---

Backstage natively supports importing catalog data through the use of
[entity descriptor YAML files](descriptor-format.md). However, companies that
already have an existing system for keeping track of software and its owners can
leverage those systems by integrating them with Backstage. This article shows
the two common ways of doing that integration: by adding a custom catalog
_entity provider_, or by adding a _processor_.

## Background

The catalog has a frontend plugin part, that communicates via a service API to
the backend plugin part. The backend continuously ingests data from the sources
you specify, to store them in its database. The details of how this works is
detailed in [The Life of an Entity](life-of-an-entity.md). Reading that article
first is recommended.

There are two main options for how to ingest data into the catalog: making a
[custom entity provider](#custom-entity-providers), or making a
[custom processor](#custom-processors). They both have strengths and drawbacks,
but the former would usually be preferred. Both options are presented in a
dedicated subsection below.

## Custom Entity Providers

Entity providers sit at the very edge of the catalog. They are the original
sources of entities that form roots of the processing tree. The dynamic location
store API, and the static locations you can specify in your app-config, are two
examples of builtin providers in the catalog.

Some defining traits of entity providers:

- You instantiate them individually using code in your backend, and pass them to
  the catalog builder. Often there's one provider instance per remote system.
- You may be responsible for actively running them. For example, some providers
  need to be triggered periodically by a method call to know when they are meant
  to do their job; in that case you'll have to make that happen.
- The timing of their work is entirely detached from the processing loops. One
  provider may run every 30 seconds, another one on every incoming webhook call
  of a certain type, etc.
- They can perform detailed updates on the set of entities that they are
  responsible for. They can make full updates of the entire set, or issue
  individual additions and removals.
- Their output is a set of unprocessed entities. Those are then subject to the
  processing loops before becoming final, stitched entities.
- When they remove an entity, the entire subtree of processor-generated entities
  under that root is eagerly removed as well.

### Creating an Entity Provider

The recommended way of instantiating the catalog backend classes is to use the
`CatalogBuilder`, as illustrated in the
[example backend here](https://github.com/backstage/backstage/blob/master/packages/backend/src/plugins/catalog.ts).
We will create a new
[`EntityProvider`](https://github.com/backstage/backstage/blob/master/plugins/catalog-node/src/api/provider.ts)
subclass that can be added to this catalog builder.

Let's make a simple provider that can refresh a set of entities based on a
remote store. The provider part of the interface is actually tiny - you only
have to supply a (unique) name, and accept a connection from the environment
through which you can issue writes. The rest is up to the individual provider
implementation.

It is up to you where you put the code for this new provider class. For quick
experimentation you could place it in your backend package, but we recommend
putting all extensions like this in a backend module package of their own in the
`plugins` folder of your Backstage repo:

```sh
yarn new --select backend-module --option id=catalog
```

The class will have this basic structure:

```ts
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

/**
 * Provides entities from fictional frobs service.
 */
export class FrobsProvider implements EntityProvider {
  private readonly env: string;
  private readonly reader: UrlReader;
  private connection?: EntityProviderConnection;

  /** [1] */
  constructor(env: string, reader: UrlReader) {
    this.env = env;
    this.reader = reader;
  }

  /** [2] */
  getProviderName(): string {
    return `frobs-${this.env}`;
  }

  /** [3] */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
  }

  /** [4] */
  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const response = await this.reader.readUrl(
      `https://frobs-${this.env}.example.com/data`,
    );
    const data = JSON.parse(await response.buffer()).toString();

    /** [5] */
    const entities: Entity[] = frobsToEntities(data);

    /** [6] */
    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: `frobs-provider:${this.env}`,
      })),
    });
  }
}
```

This class demonstrates several important concepts, some of which are optional.
Check out the numbered markings - let's go through them one by one.

1. The class takes an `env` parameter. This is only illustrative for the sake of
   the example. We'll use this field to exhibit the type of provider where end
   users may want or need to make multiple instances of the same provider, and
   what the implications would be in that case.
2. The catalog requires that all registered providers return a name that is
   _unique_ among those providers, and which is _stable_ over time. The reason
   for these requirements is, the emitted entities for each provider instance
   all hang around in a closed bucket of their own. This bucket needs to be tied
   to their provider over time, and across backend restarts. We'll see below how
   the processor emits some entities and what that means for its own bucket.
3. Once the catalog engine starts up, it immediately issues the `connect` call
   to all known providers. This forms the bond between the code and the
   database. This is also an opportunity for the provider to do one-time updates
   on the connection at startup if it wants to.
4. At this point the provider contract is already complete. But the class needs
   to do some actual work too! In this particular example, we chose to make a
   `run` method that has to be called each time that you want to issue a sync
   with the `frobs` service. Let's repeat that - this is only an example
   implementation; some providers may be written in entirely different ways,
   such as for example subscribing to pubsub events and only reacting to those,
   or any number of other solutions. The only point is - external stimuli happen
   somehow, which somehow get translated to calls on the `connection` to persist
   the outcome of that. This example issues a `fetch` to the right service and
   issues a full refresh of its entity bucket based on that.
5. The method translates the foreign data model to the native `Entity` form, as
   expected by the catalog. The `Entity` must include the
   `backstage.io/managed-by-location` and
   `backstage.io/managed-by-origin-location annotations`; otherwise, it will not
   appear in the Catalog and will generate warning logs. The
   [Well-known Annotations](./well-known-annotations.md#backstageiomanaged-by-location)
   documentation has guidance on what values to use for these.
6. Finally, we issue a "mutation" to the catalog. This persists the entities in
   our own bucket, along with an optional `locationKey` that's used for conflict
   checks. But this is a bigger topic - mutations warrant their own explanatory
   section below.

### Provider Mutations

Let's circle back to the bucket analogy.

Each provider _instance_ - not each class but each instance registered with the
catalog - has access to its own bucket of entities, and the bucket is identified
by the stable name of the provider instance. Every time the provider issues
"mutations", it changes the contents of that bucket. Nothing else outside of the
bucket is accessible.

There are two different types of mutation.

The first is `'full'`, which means to figuratively throw away the contents of
the bucket and replacing it with all of the new contents specified. Under the
hood, this is actually implemented through a highly efficient delta mechanism
for performance reasons, since it is common that the difference from one run to
the other is actually very small. This strategy is convenient for providers that
have easy access to batch-fetches of the entire subject material from a remote
source, and doesn't have access to, or does not want to compute, deltas.

The other mutation type is `'delta'`, which lets the provider explicitly upsert
or delete entities in its bucket. This mutation is convenient e.g. for event
based providers, and can also be more performant since no deltas need to be
computed, and previous bucket contents outside of the targeted set do not have
to be taken into account.

In all cases, the mutation entities are treated as _unprocessed_ entities. When
they land in the database, the registered catalog processors go to work on them
to transform them into final, processed and stitched, entities ready for
consumption.

Every entity emitted by a processor can have a `locationKey`, as shown above.
This is a critical conflict resolution key, in the form of an opaque string that
should be unique for each location that an entity could be located at, and
undefined if the entity does not have a fixed location.

In practice it should be set to the serialized location reference if the entity
is stored in Git, for example
`https://github.com/backstage/backstage/blob/master/catalog-info.yaml`, or a
similar string that distinctly pins down its origins. In our example we set it
to a string that was distinct for the provider class, plus its instance
identifying properties which in this case was the `env`.

A conflict between two entity definitions happen when they have the same entity
reference, i.e. kind, namespace, and name. In the event of a conflict, such as
if two "competing" providers try to emit entities that have the same reference
triplet, the location key will be used according to the following rules to
resolve the conflict:

- If the entity is already present in the database but does not have a location
  key set, the new entity wins and will override the existing one.
- If the entity is already present in the database the new entity will only win
  if the location keys of the existing and new entity are the same.
- If the entity is not already present, insert the entity into the database
  along with the provided location key.

This may seem complex, but is a vital mechanism for ensuring that users aren't
permitted to do "rogue" takeovers of already registered entities that belong to
others.

### Installing the Provider

You should now be able to add this class to your backend in
`packages/backend/src/plugins/catalog.ts`:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { FrobsProvider } from '../path/to/class';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = CatalogBuilder.create(env);
  /* highlight-add-start */
  const frobs = new FrobsProvider('production', env.reader);
  builder.addEntityProvider(frobs);
  /* highlight-add-end */

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();

  /* highlight-add-start */
  await env.scheduler.scheduleTask({
    id: 'run_frobs_refresh',
    fn: async () => {
      await frobs.run();
    },
    frequency: { minutes: 30 },
    timeout: { minutes: 10 },
  });
  /* highlight-add-end */

  // ..
}
```

Note that we used the builtin scheduler facility to regularly call the `run`
method of the provider, in this example. It is a suitable driver for this
particular type of recurring task. We placed the scheduling after the actual
construction and startup phase of the rest of the catalog, because at that point
the `connect` call has been made to the provider.

Start up the backend - it should now start reading from the previously
registered location and you'll see your entities start to appear in Backstage.

### Example User Entity Provider

If you have a 3rd party entity provider such as an internal HR system that you wish to use you are not limited to using our entity providers, (or simply wish to add to existing entity providers with your own data).

We can create an entity provider to read entities that are based off that provider.

We create a basic entity provider as shown above. In the example below we might want to extract our users from an HR system, I am assuming the HR system already has the slackUserId to get that information please see the [Slack Api](https://api.slack.com/methods).

```typescript
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model'
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend'
import { WebClient } from '@slack/web-api'
import {kebabCase} from 'lodash'

interface Staff {
  displayName: string
  slackUserId: string
  jobTitle: string
  photoUrl: string
  address: string
  email:string
}

export class UserEntityProvider implements EntityProvider {
  private readonly getStaffUrl: string
  protected readonly slackTeam: string
  protected readonly slackToken: string
  protected connection?: EntityProviderConnection

  static fromConfig(config: Config, options: { logger: Logger }) {
    const getStaffUrl = config.getString('staff.url')
    const slackToken = config.getString('slack.token')
    const slackTeam = config.getString('slack.team')
    return new UserEntityProvider({
      ...options,
      getStaffUrl,
      slackToken,
      slackTeam,
    })
  }

  private constructor(options: {
    getStaffUrl: string
    slackToken: string
    slackTeam: string
  }) {
    this.getStaffUrl = options.getStaffUrl
    this.slackToken = options.slackToken
    this.slackTeam = options.slackTeam
  }

  async getAllStaff(): Promise<Staff[]>{
    await return axios.get(this.getStaffUrl)
  }

  public async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection
  }

  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('User Connection Not initialized')
    }

    const userResources: UserEntity[] = []
    const staff = await this.getAllStaff()

    for (const user of staff) {
      // we can add any links here in this case it would be adding a slack link to the users so you can directly slack them.
      const links =
        user.slackUserId != null && user.slackUserId.length > 0
          ? [
              {
                url: `slack://user?team=${this.slackTeam}&id=${user.slackUserId}`,
                title: 'Slack',
                icon: 'message',
              },
            ]
          : undefined
      const userEntity: UserEntity = {
        kind: 'User',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          annotations: {
            [ANNOTATION_LOCATION]: 'hr-user-https://www.hrurl.com/',
            [ANNOTATION_ORIGIN_LOCATION]: 'hr-user-https://www.hrurl.com/',
          },
          links,
          // name of the entity
          name: kebabCase(user.displayName),
          // name for display purposes could be anything including email
          title: user.displayName,
        },
        spec: {
          profile: {
            displayName: user.displayName,
            email: user.email,
            picture: user.photoUrl,
          },
          memberOf: [],
        },
      }

      userResources.push(userEntity)
    }

    await this.connection.applyMutation({
      type: 'full',
      entities: userResources.map((entity) => ({
        entity,
        locationKey: 'hr-user-https://www.hrurl.com/',
      })),
    })
}

```

## Custom Processors

The other possible way of ingesting data into the catalog is through the use of
location reading catalog processors.

Processors sit in the middle of the processing loops of the catalog. They are
responsible for updating and finalizing unprocessed entities on their way to
becoming final, stitched entities. They can also, crucially, emit other entities
while doing so. Those then form branches of the entity tree.

Some defining traits of processors:

- You instantiate them using code in your backend, and pass them to the catalog
  builder. There's usually only one instance of each type, which then gets
  called many times over in parallel for all entities in the catalog.
- Their invocation is driven by the fixed processing loop. All processors are
  unconditionally repeatedly called for all entities. You cannot control this
  behavior, besides adjusting the frequency of the loop, which then applies
  equally to all processors.
- They cannot control in detail the entities that they emit, the only effective
  operation is upsert on their children. If they stop emitting a certain child,
  that child becomes marked as an orphan; no deletions are possible.
- Their input is an unprocessed entity, and their output is modifications to
  that same entity plus possibly some auxiliary data including unprocessed child
  entities.

### Processors and the Ingestion Loop

The catalog holds a number of registered locations, that were added either by
site admins or by individual Backstage users. Their purpose is to reference some
sort of data that the catalog shall keep itself up to date with. Each location
has a `type`, and a `target` that are both strings.

```yaml
# Example location
type: url
target: https://github.com/backstage/backstage/blob/master/catalog-info.yaml
```

The builtin catalog backend has an ingestion loop that periodically goes through
all of these registered locations, and pushes them and their resulting output
through the list of _processors_.

Processors are classes that the site admin has registered with the catalog at
startup. They are at the heart of all catalog logic, and have the ability to
read the contents of locations, modify in-flight entities that were read out of
a location, perform validation, and more. The catalog comes with a set of
builtin processors, that have the ability to read from a list of well known
location types, to perform the basic processing needs, etc, but more can be
added by the organization that adopts Backstage.

We will now show the process of creating a new processor and location type,
which enables the ingestion of catalog data from an existing external API.

### Deciding on the New Locations

The first step is to decide how we want to point at the system that holds our
data. Let's assume that it is internally named System-X and can be reached
through HTTP REST calls to its API.

Let's decide that our locations shall take the following form:

```yaml
type: system-x
target: http://systemx.services.example.net/api/v2
```

It got its own made-up `type`, and the `target` conveniently points to the
actual API endpoint to talk to.

So now we have to make the catalog aware of such a location so that it can start
feeding it into the ingestion loop. For this kind of an integration, you'd
typically want to add it to the list of statically always-available locations in
the config.

```yaml title="app-config.yaml"
catalog:
  locations:
    - type: system-x
      target: http://systemx.services.example.net/api/v2
```

If you start up the backend now, it will start to periodically say that it could
not find a processor that supports that location. So let's make a processor that
does so!

### Creating a Catalog Data Reader Processor

The recommended way of instantiating the catalog backend classes is to use the
`CatalogBuilder`, as illustrated in the
[example backend here](https://github.com/backstage/backstage/blob/master/packages/backend/src/plugins/catalog.ts).
We will create a new
[`CatalogProcessor`](https://github.com/backstage/backstage/blob/master/plugins/catalog-node/src/api/processor.ts)
subclass that can be added to this catalog builder.

It is up to you where you put the code for this new processor class. For quick
experimentation you could place it in your backend package, but we recommend
putting all extensions like this in a backend module package of their own in the
`plugins` folder of your Backstage repo:

```sh
yarn new --select backend-module --option id=catalog
```

The class will have this basic structure:

```ts
import { UrlReader } from '@backstage/backend-common';
import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';

import { LocationSpec } from '@backstage/plugin-catalog-common';

// A processor that reads from the fictional System-X
export class SystemXReaderProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReader) {}

  getProcessorName(): string {
    return 'SystemXReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    // Pick a custom location type string. A location will be
    // registered later with this type.
    if (location.type !== 'system-x') {
      return false;
    }

    try {
      // Use the builtin reader facility to grab data from the
      // API. If you prefer, you can just use plain fetch here
      // (from the node-fetch package), or any other method of
      // your choosing.
      const response = await this.reader.readUrl(location.target);
      const json = JSON.parse((await response.buffer()).toString());
      // Repeatedly call emit(processingResult.entity(location, <entity>))
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;
      emit(processingResult.generalError(location, message));
    }

    return true;
  }
}
```

The key points to note are:

- Make a class that implements `CatalogProcessor`
- Only act on location types that you care about, and leave the rest alone by
  returning `false`
- Read the data from the external system in any way you see fit. Use the
  location `target` field if you designed it as mentioned above
- Call `emit` any number of times with the results of that process
- Finally return `true`

You should now be able to add this class to your backend in
`packages/backend/src/plugins/catalog.ts`:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { SystemXReaderProcessor } from '../path/to/class';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = CatalogBuilder.create(env);
  /* highlight-add-next-line */
  builder.addProcessor(new SystemXReaderProcessor(env.reader));

  // ..
}
```

Start up the backend - it should now start reading from the previously
registered location and you'll see your entities start to appear in Backstage.

### Caching processing results

The catalog periodically refreshes entities in the catalog, and in doing so it
calls out to external systems to fetch changes. This can be taxing for upstream
services and large deployments may get rate limited if too many requests are
sent. Luckily many external systems provide ETag support to check for changes
which usually doesn't count towards the quota and saves resources both
internally and externally.

The catalog has built in support for leveraging ETags when refreshing external
locations in GitHub. This example aims to demonstrate how to add the same
behavior for `system-x` that we implemented earlier.

```ts
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorCache,
  CatalogProcessorParser,
  LocationSpec,
} from '@backstage/plugin-catalog-node';

// It's recommended to always bump the CACHE_KEY version if you make
// changes to the processor implementation or CacheItem.
const CACHE_KEY = 'v1';

// Our cache item contains the ETag used in the upstream request
// as well as the processing result used when the Etag matches.
// Bump the CACHE_KEY version if you make any changes to this type.
type CacheItem = {
  etag: string;
  entity: Entity;
};

export class SystemXReaderProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReader) {}

  getProcessorName() {
    // The processor name must be unique.
    return 'system-x-processor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
    _parser: CatalogProcessorParser,
    cache: CatalogProcessorCache,
  ): Promise<boolean> {
    // Pick a custom location type string. A location will be
    // registered later with this type.
    if (location.type !== 'system-x') {
      return false;
    }
    const cacheItem = await cache.get<CacheItem>(CACHE_KEY);
    try {
      // This assumes an URL reader that returns the response together with the ETag.
      // We send the ETag from the previous run if it exists.
      // The previous ETag will be set in the headers for the outgoing request and system-x
      // is going to throw NOT_MODIFIED (HTTP 304) if the ETag matches.
      const response = await this.reader.readUrl(location.target, {
        etag: cacheItem?.etag,
      });
      if (!response) {
        // readUrl is currently optional to implement so we have to check if we get a response back.
        throw new Error(
          'No URL reader that can parse system-x targets installed',
        );
      }

      // ETag is optional in the response but we need it to cache the result.
      if (!response.etag) {
        throw new Error(
          'No ETag returned from system-x, cannot use response for caching',
        );
      }

      // For this example the JSON payload is a single entity.
      const entity: Entity = JSON.parse(response.buffer.toString());
      emit(processingResult.entity(location, entity));

      // Update the cache with the new ETag and entity used for the next run.
      await cache.set<CacheItem>(CACHE_KEY, {
        etag: response.etag,
        entity,
      });
    } catch (error) {
      if (error.name === 'NotModifiedError' && cacheItem) {
        // The ETag matches and we have a cached value from the previous run.
        emit(processingResult.entity(location, cacheItem.entity));
      }
      const message = `Unable to read ${location.type}, ${error}`;
      emit(processingResult.generalError(location, message));
    }

    return true;
  }
}
```

### Supporting different metadata file formats

Sometimes you might already have files in GitHub or some provider that Backstage already supports but the metadata format that you use is not the same as `catalog-info.yaml` files. In this case you can implement a custom parser that can read the files and convert them on-the-fly to the `Entity` format that Backstage expects, and it will integrate seamlessly into Catalog so that you can use things like the `GithubEntityProvider` to read these files.

What you will need to do is to provide a custom `CatalogProcessorParser` and provide that to `builder.setEntityDataParser`.

Let's say my format looks something like this:

```yaml
id: my-service
type: service
author: user@backstage.com
```

We need to build a custom parser that can read this format and convert it to the `Entity` format that Backstage expects.

```ts title="packages/backend/src/lib/customEntityDataParser.ts"
import {
  CatalogProcessorParser,
  CatalogProcessorResult,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-node';
import yaml from 'yaml';
import {
  Entity,
  stringifyLocationRef,
  ANNOTATION_ORIGIN_LOCATION,
  ANNOTATION_LOCATION,
} from '@backstage/catalog-model';
import _ from 'lodash';
import parseGitUrl from 'git-url-parse';

// This implementation will map whatever your own format is into valid Entity objects.
const makeEntityFromCustomFormatJson = (
  component: { id: string; type: string; author: string },
  location: LocationSpec,
): Entity => {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: component.id,
      namespace: 'default',
      annotations: {
        [ANNOTATION_LOCATION]: `${location.type}:${location.target}`,
        [ANNOTATION_ORIGIN_LOCATION]: `${location.type}:${location.target}`,
      },
    }
    spec: {
      type: component.type,
      owner: component.author,
      lifecycle: 'experimental'
    }
  }
};

export const customEntityDataParser: CatalogProcessorParser = async function* ({
  data,
  location,
}) {
  let documents: yaml.Document.Parsed[];
  try {
    // let's treat the incoming file always as yaml, you can of course change this if your format is not yaml.
    documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
  } catch (e) {
    // if we failed to parse as yaml throw some errors.
    const loc = stringifyLocationRef(location);
    const message = `Failed to parse YAML at ${loc}, ${e}`;
    yield processingResult.generalError(location, message);
    return;
  }

  for (const document of documents) {
    // If there's errors parsing the document as yaml, we should throw an error.
    if (document.errors?.length) {
      const loc = stringifyLocationRef(location);
      const message = `YAML error at ${loc}, ${document.errors[0]}`;
      yield processingResult.generalError(location, message);
    } else {
      // Convert the document to JSON
      const json = document.toJSON();
      if (_.isPlainObject(json)) {
        // Is this a catalog-info.yaml file?
        if (json.apiVersion) {
          yield processingResult.entity(location, json as Entity);

        // let's treat this like it's our custom format instead.
        } else {
          yield processingResult.entity(
            location,
            makeEntityFromCustomFormatJson(json, location),
          );
        }
      } else if (json === null) {
        // Ignore null values, these happen if there is an empty document in the
        // YAML file, for example if --- is added to the end of the file.
      } else {
        // We don't support this format.
        const message = `Expected object at root, got ${typeof json}`;
        yield processingResult.generalError(location, message);
      }
    }
  }
}
```

This is a lot of code right now, as this is a pretty niche use-case, so we don't currently provide many helpers for you to be able to provide custom implementations easier or to compose together different parsers.

You then should be able to provide this `customEntityDataParser` to the `CatalogBuilder`:

```ts title="packages/backend/src/plugins/catalog.ts"
import { customEntityDataParser } from '../lib/customEntityDataParser';

...

builder.setEntityDataParser(customEntityDataParser);
```
