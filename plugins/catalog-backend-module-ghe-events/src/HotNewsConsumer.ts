/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  AuthService,
  LifecycleService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Location } from '@backstage/catalog-client';
import {
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { assertError, InputError } from '@backstage/errors';
import {
  CatalogService,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import {
  Organization,
  PushEvent,
  RepositoryArchivedEvent,
  RepositoryDeletedEvent,
  RepositoryEditedEvent,
  RepositoryEvent,
  RepositoryRenamedEvent,
  RepositoryTransferredEvent,
  RepositoryUnarchivedEvent,
  User,
} from '@octokit/webhooks-types';
import { Counter, metrics } from '@opentelemetry/api';
import lodash from 'lodash';
import { OctokitProvider } from './octokitProviderService';

interface HotNewsConsumerOptions {
  logger: LoggerService;
  lifecycle: LifecycleService;
  auth: AuthService;
  events: EventsService;
  catalog: CatalogService;
  octokitProvider: OctokitProvider;
}

type FileState =
  | { type: 'added' }
  | { type: 'removed'; commitUrl: string }
  | { type: 'changed' }
  | { type: 'moved'; from: string };

export class HotNewsConsumer implements EntityProvider {
  readonly #options: HotNewsConsumerOptions;
  readonly #metrics: {
    events: Counter;
    actions: Counter;
  };
  #connection: EntityProviderConnection | undefined;

  constructor(options: HotNewsConsumerOptions) {
    this.#options = options;

    const meter = metrics.getMeter('default');
    this.#metrics = {
      events: meter.createCounter('catalog.events.github.messages', {
        description: 'Number of github messages received',
        unit: 'short',
      }),
      actions: meter.createCounter('catalog.events.github.actions', {
        description: 'Number of actions taken as a result of github events',
        unit: 'short',
      }),
    };
  }

  getProviderName(): string {
    return 'hot-news-consumer';
  }

  async connect(connection: EntityProviderConnection) {
    this.#connection = connection;
    await this.#options.events.subscribe({
      id: 'catalog-hot-news-github',
      topics: ['github.push', 'github.repository'],
      onEvent: async event => {
        await this.#onEvent(event);
      },
    });
  }

  async #onEvent(event: EventParams): Promise<void> {
    let eventType = 'unknown';
    try {
      const rawEventType = event.metadata?.['x-github-event'];
      const data = event.eventPayload;
      if (
        typeof rawEventType !== 'string' ||
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data)
      ) {
        this.#metrics.events.add(1, {
          eventType: 'unknown',
          status: 'failed',
        });
        throw new InputError(
          'Malformed event: missing/bad event type or payload',
        );
      }
      eventType = rawEventType;

      if (eventType === 'push') {
        await this.#onPushEvent(data as PushEvent);
      } else if (eventType === 'repository') {
        const repositoryEvent = data as RepositoryEvent;
        if (repositoryEvent.action === 'deleted') {
          await this.#onRepositoryDeletedEvent(repositoryEvent);
        } else if (repositoryEvent.action === 'archived') {
          await this.#onRepositoryArchivedEvent(repositoryEvent);
        } else if (repositoryEvent.action === 'unarchived') {
          await this.#onRepositoryUnarchivedEvent(repositoryEvent);
        } else if (repositoryEvent.action === 'renamed') {
          await this.#onRepositoryRenamedEvent(repositoryEvent);
        } else if (repositoryEvent.action === 'edited') {
          await this.#onRepositoryEditedEvent(repositoryEvent);
        } else if (repositoryEvent.action === 'transferred') {
          await this.#onRepositoryTransferredEvent(repositoryEvent);
        } else {
          this.#options.logger.debug(
            `Unsupported ${eventType} event action: ${repositoryEvent.action}`,
          );
        }
      } else {
        this.#options.logger.debug(`Unsupported event type: ${eventType}`);
      }
      this.#metrics.events.add(1, { eventType, status: 'success' });
    } catch (error) {
      this.#metrics.events.add(1, { eventType, status: 'failed' });
      throw error;
    }
  }

  // #endregion
  // #region Push events

  async #onPushEvent(event: PushEvent): Promise<void> {
    // NOTE: The following caveats are mentioned in https://docs.github.com/en/webhooks/webhook-events-and-payloads#push
    // * Events will not be created if more than 5000 branches are pushed at once.
    // * Events will not be created for tags when more than three tags are pushed at once.
    // * The commits array includes a maximum of 2048 commits. If necessary, you can use the Commits API to fetch additional commits.
    // TODO(freben): Do we need to support reading the commits using the separate API under some circumstances?

    // We ignore any event that doesn't target the default branch as this
    // is where the metadata files should be stored for now.
    if (event.ref !== `refs/heads/${event.repository.default_branch}`) {
      return;
    }

    const isRelevant = (path: string) =>
      path.endsWith('.yaml') || path.endsWith('.yml');
    // UrlReaderProcessor emits a type:target refresh key for every location read, and always in the "tree" format
    const toRefreshKey = (path: string) =>
      `url:${event.repository.html_url}/tree/${event.repository.default_branch}/${path}`;
    const toBlobUrl = (path: string) =>
      `${event.repository.html_url}/blob/${event.repository.default_branch}/${path}`;

    const refreshKeys = new Set<string>();
    const addedPaths = new Map<
      string,
      { blobUrl: string; commitUrl: string; commitId: string }
    >();
    const removedPaths = new Map<
      string,
      { blobUrl: string; commitUrl: string; commitId: string }
    >();

    // First we go through the commits in time order and just make a quick
    // assessment of what happened
    for (const commit of event.commits ?? []) {
      for (const path of commit.modified?.filter(isRelevant) ?? []) {
        // UrlReaderProcessor emits a type:target refresh key for every location read, and always in the "tree" format
        refreshKeys.add(toRefreshKey(path));
      }

      for (const path of commit.added?.filter(isRelevant) ?? []) {
        addedPaths.set(path, {
          blobUrl: toBlobUrl(path),
          commitUrl: commit.url,
          commitId: commit.id,
        });
        removedPaths.delete(path);
      }

      for (const path of commit.removed?.filter(isRelevant) ?? []) {
        removedPaths.set(path, {
          blobUrl: toBlobUrl(path),
          commitUrl: commit.url,
          commitId: commit.id,
        });
        addedPaths.delete(path);
      }
    }

    // Handle trivial additions
    if (addedPaths.size > 0 && removedPaths.size === 0) {
      // TODO(freben): Implement if we want automatic discovery
    }

    // Handle trivial removals
    if (removedPaths.size > 0 && addedPaths.size === 0) {
      for (const [_, { blobUrl, commitUrl }] of removedPaths) {
        await this.#tryUnregisterLocationRef(
          `url:${blobUrl}`,
          `commit ${commitUrl} deleted the file`,
        );
      }
    }

    // This is the complex case, where there are both additions and removals
    // that look interesting. Now we need to analyze the commits more
    // carefully, to see which changes constitute deletions and which ones
    // are moves. We do this by iterating through the actual commits as
    // fetched from the remote (since they contain richer information than
    // the webhook), and computing the "compound" outcome (e.g. an add
    // followed by a remove of the same file can be ignored).
    if (removedPaths.size > 0 && addedPaths.size > 0) {
      const octokit = await this.#options.octokitProvider.getOctokit(
        event.repository.html_url,
      );

      // While going through all changes in all commits, keep track of the
      // computed state of each file as they go through various changes.
      const state = new Map<string, FileState | undefined>();

      for (const eventCommit of event.commits ?? []) {
        const commit = await octokit.rest.repos.getCommit({
          owner: event.repository.owner.login,
          repo: event.repository.name,
          ref: eventCommit.id,
        });
        for (const file of commit.data.files ?? []) {
          const previous = state.get(file.previous_filename || file.filename);
          let next: FileState | undefined;
          if (file.status === 'added') {
            if (!previous) {
              // First time we see this file in this set of commits
              next = { type: 'added' };
            } else if (previous.type === 'removed') {
              // Removed and then added again - assume changes
              next = { type: 'changed' };
            } else {
              // Should not happen; added/changed/moved -> added
              next = previous;
              this.#options.logger.debug(
                `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
              );
            }
          } else if (file.status === 'removed') {
            if (!previous) {
              // First time we see this file in this set of commits
              next = { type: 'removed', commitUrl: commit.data.html_url };
            } else if (previous.type === 'added') {
              // It was first added and then removed - turn into noop
              next = undefined;
            } else if (previous.type === 'changed') {
              // Changed and then removed; convert to removed
              next = { type: 'removed', commitUrl: commit.data.html_url };
            } else if (previous.type === 'moved') {
              // It was moved and then removed - convert to remoal of the ORIGINAL path
              if (!state.has(previous.from)) {
                state.set(previous.from, {
                  type: 'removed',
                  commitUrl: commit.data.html_url,
                });
              }
              next = undefined;
            } else {
              // Should not happen; removed -> removed
              next = previous;
              this.#options.logger.debug(
                `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
              );
            }
          } else if (file.status === 'renamed') {
            state.delete(file.previous_filename!);
            if (!previous) {
              // First time we see this file in this set of commits
              next = { type: 'moved', from: file.previous_filename! };
            } else if (previous.type === 'added') {
              // It was first added and then moved - this sums to still just an add but in the new path
              next = { type: 'added' };
            } else if (previous.type === 'changed') {
              // Changed and then moved; convert to moved
              next = { type: 'moved', from: file.previous_filename! };
            } else if (previous.type === 'moved') {
              // It was moved and then moved again
              next = { type: 'moved', from: previous.from };
            } else {
              // Should not happen; remove -> move
              next = undefined;
              this.#options.logger.debug(
                `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
              );
            }
          } else if (file.status === 'changed' || file.status === 'modified') {
            if (!previous) {
              // First time we see this file in this set of commits
              next = { type: 'changed' };
            } else if (previous.type === 'added') {
              // It was first added and then changed - still an add
              next = previous;
            } else if (previous.type === 'changed') {
              // Changed twice - still just a change
              next = previous;
            } else if (previous.type === 'moved') {
              // Moved and then changed - still a move
              next = previous;
            } else {
              // Should not happen; remove -> change
              next = undefined;
              this.#options.logger.debug(
                `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
              );
            }
          } else {
            // remaining statuses are 'copied' and 'unchanged' - ignoring
          }
          state.set(file.filename, next);
        }
      }

      // Apply all of the updates
      for (const [path, pathState] of state) {
        if (isRelevant(path) && pathState) {
          if (pathState.type === 'added') {
            // TODO(freben): Implement if we want automatic discovery
          } else if (pathState.type === 'removed') {
            await this.#tryUnregisterLocationRef(
              `url:${toBlobUrl(path)}`,
              `commit ${pathState.commitUrl} deleted the file`,
            );
          } else if (pathState.type === 'moved') {
            await this.#tryMoveLocationsByTargetUrlPrefix(
              toBlobUrl(pathState.from),
              toBlobUrl(path),
            );
          } else if (pathState.type === 'changed') {
            refreshKeys.add(toRefreshKey(path));
          }
        }
      }
    }

    // Either way, handle the refresh keys
    if (refreshKeys.size > 0) {
      this.#metrics.actions.add(refreshKeys.size, { action: 'refresh' });
      await this.#connection!.refresh({
        keys: Array.from(refreshKeys),
      });
    }
  }

  // #endregion
  // #region Repository events

  async #onRepositoryArchivedEvent(
    event: RepositoryArchivedEvent,
  ): Promise<void> {
    // When a repository is archived we want to ensure that all registered
    // entities inside that repo get reprocessed. This ensures that they get
    // marked as having a sunset lifecycle.
    const locationRefs = await this.#getUrlLocationsWithTargetPrefix(
      `${event.repository.html_url}/`,
    ).then(locations => locations.map(stringifyLocationRef));

    for (const locationRefChunk of lodash.chunk(locationRefs, 50)) {
      const entities = await this.#options.catalog.getEntities(
        {
          filter: { [ANNOTATION_ORIGIN_LOCATION]: locationRefChunk },
          fields: ['kind', 'metadata.name', 'metadata.namespace'],
        },
        { credentials: await this.#options.auth.getOwnServiceCredentials() },
      );

      for (const entity of entities.items) {
        await this.#options.catalog.refreshEntity(stringifyEntityRef(entity), {
          credentials: await this.#options.auth.getOwnServiceCredentials(),
        });
      }
      this.#metrics.actions.add(entities.items.length, { action: 'refresh' });
    }
  }

  async #onRepositoryUnarchivedEvent(
    event: RepositoryUnarchivedEvent,
  ): Promise<void> {
    // When a repository is unarchived we want to ensure that all registered
    // entities inside that repo get reprocessed. This ensures that they get
    // marked as no longer having a sunset lifecycle.
    const locationRefs = await this.#getUrlLocationsWithTargetPrefix(
      `${event.repository.html_url}/`,
    ).then(locations => locations.map(stringifyLocationRef));

    for (const locationRefChunk of lodash.chunk(locationRefs, 50)) {
      const entities = await this.#options.catalog.getEntities(
        {
          filter: { [ANNOTATION_ORIGIN_LOCATION]: locationRefChunk },
          fields: ['kind', 'metadata.name', 'metadata.namespace'],
        },
        { credentials: await this.#options.auth.getOwnServiceCredentials() },
      );

      for (const entity of entities.items) {
        await this.#options.catalog.refreshEntity(stringifyEntityRef(entity), {
          credentials: await this.#options.auth.getOwnServiceCredentials(),
        });
      }
      this.#metrics.actions.add(entities.items.length, { action: 'refresh' });
    }
  }

  async #onRepositoryDeletedEvent(
    event: RepositoryDeletedEvent,
  ): Promise<void> {
    // When a repository is deleted, we assume that the user's intent was to
    // also unregister all of the corresponding locations that were registered
    // under it.
    const locations = await this.#getUrlLocationsWithTargetPrefix(
      `${event.repository.html_url}/`,
    );
    for (const location of locations) {
      await this.#tryUnregisterLocation(location, 'the repository was deleted');
    }
  }

  async #onRepositoryRenamedEvent(
    event: RepositoryRenamedEvent,
  ): Promise<void> {
    const oldUrlPrefix = `${event.repository.owner.html_url}/${event.changes.repository.name.from}/`;
    const newUrlPrefix = `${event.repository.html_url}/`;
    await this.#tryMoveLocationsByTargetUrlPrefix(oldUrlPrefix, newUrlPrefix);
  }

  async #onRepositoryEditedEvent(event: RepositoryEditedEvent): Promise<void> {
    if (event.changes.default_branch) {
      const oldUrlPrefix = `${event.repository.html_url}/blob/${event.changes.default_branch.from}/`;
      const newUrlPrefix = `${event.repository.html_url}/blob/${event.repository.default_branch}/`;
      await this.#tryMoveLocationsByTargetUrlPrefix(oldUrlPrefix, newUrlPrefix);
    }
  }

  async #onRepositoryTransferredEvent(
    event: RepositoryTransferredEvent,
  ): Promise<void> {
    // TODO(freben): The web interface allows renaming while transferring, but
    // we do not yet have a way of detecting that because weirdly, the actual
    // webhooks that then get sent are
    //
    // - First a transferred event SOURCE_REPO -> TARGET_REPO/NEW_NAME
    //   (no mention of the old name anywhere)
    //
    // - Then a renamed event for TARGET_REPO of OLD_NAME -> NEW_NAME
    //   (where where the former of course never existed as far as we know;
    //   no mention of the former source repo anywhere)
    //
    // Handling this seems to need some form of state handling across events.

    // The documentation states that there is an organization property in from,
    // but the types disagree. Hence the cast.
    // https://docs.github.com/en/webhooks/webhook-events-and-payloads?actionType=transferred#repository
    const from = event.changes.owner.from as {
      user?: User;
      organization?: Organization;
    };

    let oldOwnerUrl = from.user?.html_url ?? from.organization?.html_url;
    if (!oldOwnerUrl) {
      // Some servers do not supply an html_url field, so we
      // construct it by removing the last two segments of the
      // target URL instead (which we know ends with "/owner/repo")
      const base = event.repository.html_url.split('/').slice(0, -2).join('/');
      oldOwnerUrl = `${base}/${from.user?.login ?? from.organization?.login}`;
    }

    const oldUrlPrefix = `${oldOwnerUrl}/${event.repository.name}/`;
    const newUrlPrefix = `${event.repository.html_url}/`;
    await this.#tryMoveLocationsByTargetUrlPrefix(oldUrlPrefix, newUrlPrefix);
  }

  // #endregion
  // #region Helpers

  // Return all locations of type url that have a target starting with the given
  // prefix
  async #getUrlLocationsWithTargetPrefix(prefix: string): Promise<Location[]> {
    return await this.#options.catalog
      .getLocations(
        {},
        { credentials: await this.#options.auth.getOwnServiceCredentials() },
      )
      .then(response =>
        response.items.filter(
          l => l.type === 'url' && l.target.startsWith(prefix),
        ),
      );
  }

  // Given a full location ref (including e.g. the url: prefix), tries to locate
  // such a registered location and unregister it.
  async #tryUnregisterLocationRef(ref: string, reason: string) {
    const location = await this.#options.catalog.getLocationByRef(ref, {
      credentials: await this.#options.auth.getOwnServiceCredentials(),
    });
    if (location) {
      try {
        await this.#options.catalog.removeLocationById(location.id, {
          credentials: await this.#options.auth.getOwnServiceCredentials(),
        });
        this.#metrics.actions.add(1, { action: 'unregister' });
        this.#options.logger.info(
          `Unregistered location ${location.id} for ${ref}, because ${reason}`,
        );
      } catch (error) {
        assertError(error);
        this.#options.logger.warn(
          `Failed to remove location ${ref} based on event`,
          error,
        );
      }
    }
  }

  // Given a location, tries to unregister it.
  async #tryUnregisterLocation(location: Location, reason: string) {
    const ref = stringifyLocationRef(location);
    try {
      this.#metrics.actions.add(1, { action: 'unregister' });
      await this.#options.catalog.removeLocationById(location.id, {
        credentials: await this.#options.auth.getOwnServiceCredentials(),
      });
      this.#options.logger.info(
        `Unregistered location ${location.id} for ${ref}, because ${reason}`,
      );
    } catch (error) {
      assertError(error);
      this.#options.logger.warn(
        `Failed to remove location ${ref} based on event`,
        error,
      );
    }
  }

  // Tries to find all registered locations of url type whose target start with
  // the given prefix, and move them to the new prefix.
  async #tryMoveLocationsByTargetUrlPrefix(
    oldTargetUrlPrefix: string,
    newTargetUrlPrefix: string,
  ) {
    const locations = await this.#options.catalog
      .getLocations(
        {},
        { credentials: await this.#options.auth.getOwnServiceCredentials() },
      )
      .then(response =>
        response.items.filter(
          l => l.type === 'url' && l.target.startsWith(oldTargetUrlPrefix),
        ),
      );

    for (const location of locations) {
      try {
        const newUrl = `${newTargetUrlPrefix}${location.target.slice(
          oldTargetUrlPrefix.length,
        )}`;
        await this.#options.catalog.removeLocationById(location.id, {
          credentials: await this.#options.auth.getOwnServiceCredentials(),
        });
        await this.#options.catalog.addLocation(
          { type: 'url', target: newUrl },
          { credentials: await this.#options.auth.getOwnServiceCredentials() },
        );
        this.#metrics.actions.add(1, { action: 'move' });
        this.#options.logger.info(
          `Moved location from url:${location.target} to url:${newUrl}`,
        );
      } catch (error) {
        assertError(error);
        this.#options.logger.warn(
          `Failed to move location ${stringifyLocationRef(
            location,
          )} based on event`,
          error,
        );
      }
    }
  }
}
