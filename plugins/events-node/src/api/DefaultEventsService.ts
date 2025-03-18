/*
 * Copyright 2024 The Backstage Authors
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
  DiscoveryService,
  LifecycleService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { EventParams } from './EventParams';
import {
  EVENTS_NOTIFY_TIMEOUT_HEADER,
  EventsService,
  EventsServiceSubscribeOptions,
} from './EventsService';
import { DefaultApiClient } from '../generated';
import { ResponseError } from '@backstage/errors';

const POLL_BACKOFF_START_MS = 1_000;
const POLL_BACKOFF_MAX_MS = 60_000;
const POLL_BACKOFF_FACTOR = 2;

const EVENT_BUS_MODES = ['never', 'always', 'auto'] as const;

/**
 * @public
 */
export type EventBusMode = 'never' | 'always' | 'auto';

/**
 * Local event bus for subscribers within the same process.
 *
 * When publishing events we'll keep track of which subscribers we managed to
 * reach locally, and forward those subscriber IDs to the events backend if it
 * is in use. The events backend will then both avoid forwarding the same events
 * to those subscribers again, but also avoid storing the event altogether if
 * there are no other subscribers.
 * @internal
 */
export class LocalEventBus {
  readonly #logger: LoggerService;

  readonly #subscribers = new Map<
    string,
    Omit<EventsServiceSubscribeOptions, 'topics'>[]
  >();

  constructor(logger: LoggerService) {
    this.#logger = logger;
  }

  async publish(
    params: EventParams,
  ): Promise<{ notifiedSubscribers: string[] }> {
    this.#logger.debug(
      `Event received: topic=${params.topic}, metadata=${JSON.stringify(
        params.metadata,
      )}, payload=${JSON.stringify(params.eventPayload)}`,
    );

    if (!this.#subscribers.has(params.topic)) {
      return { notifiedSubscribers: [] };
    }

    const onEventPromises: Promise<string>[] = [];
    this.#subscribers.get(params.topic)?.forEach(subscription => {
      onEventPromises.push(
        (async () => {
          try {
            await subscription.onEvent(params);
          } catch (error) {
            this.#logger.warn(
              `Subscriber "${subscription.id}" failed to process event for topic "${params.topic}"`,
              error,
            );
          }
          return subscription.id;
        })(),
      );
    });

    return { notifiedSubscribers: await Promise.all(onEventPromises) };
  }

  async subscribe(options: EventsServiceSubscribeOptions): Promise<void> {
    options.topics.forEach(topic => {
      if (!this.#subscribers.has(topic)) {
        this.#subscribers.set(topic, []);
      }

      this.#subscribers.get(topic)!.push({
        id: options.id,
        onEvent: options.onEvent,
      });
    });
  }
}

/**
 * Plugin specific events bus that delegates to the local bus, as well as the
 * events backend if it is available.
 */
class PluginEventsService implements EventsService {
  constructor(
    private readonly pluginId: string,
    private readonly localBus: LocalEventBus,
    private readonly logger: LoggerService,
    private readonly mode: EventBusMode,
    private client?: DefaultApiClient,
    private readonly auth?: AuthService,
  ) {}

  async publish(params: EventParams): Promise<void> {
    const lock = this.#getShutdownLock();
    if (!lock) {
      throw new Error('Service is shutting down');
    }
    try {
      const { notifiedSubscribers } = await this.localBus.publish(params);

      const client = this.client;
      if (!client) {
        return;
      }
      const token = await this.#getToken();
      if (!token) {
        return;
      }
      const res = await client.postEvent(
        {
          body: {
            event: { payload: params.eventPayload, topic: params.topic },
            notifiedSubscribers,
          },
        },
        { token },
      );

      if (!res.ok) {
        if (res.status === 404 && this.mode !== 'always') {
          this.logger.warn(
            `Event publish request failed with status 404, events backend not found. Future events will not be persisted.`,
          );
          delete this.client;
          return;
        }
        throw await ResponseError.fromResponse(res);
      }
    } finally {
      lock.release();
    }
  }

  async subscribe(options: EventsServiceSubscribeOptions): Promise<void> {
    const subscriptionId = `${this.pluginId}.${options.id}`;

    await this.localBus.subscribe({
      id: subscriptionId,
      topics: options.topics,
      onEvent: options.onEvent,
    });

    if (!this.client) {
      return;
    }

    this.#startPolling(subscriptionId, options.topics, options.onEvent);
  }

  #startPolling(
    subscriptionId: string,
    topics: string[],
    onEvent: EventsServiceSubscribeOptions['onEvent'],
  ) {
    let hasSubscription = false;
    let backoffMs = POLL_BACKOFF_START_MS;
    const poll = async () => {
      const client = this.client;
      if (!client) {
        return;
      }
      const lock = this.#getShutdownLock();
      if (!lock) {
        return; // shutting down
      }
      try {
        const token = await this.#getToken();
        if (!token) {
          return;
        }

        if (hasSubscription) {
          const res = await client.getSubscriptionEvents(
            {
              path: { subscriptionId },
            },
            { token },
          );

          if (res.status === 202) {
            // 202 means there were no immediately available events, but the
            // response will block until either new events are available or the
            // request times out. In both cases we should should try to read events
            // immediately again

            lock.release();

            const notifyTimeoutHeader = res.headers.get(
              EVENTS_NOTIFY_TIMEOUT_HEADER,
            );

            // Add 1s to the timeout to allow the server to potentially timeout first
            const notifyTimeoutMs =
              notifyTimeoutHeader && !isNaN(parseInt(notifyTimeoutHeader, 10))
                ? Number(notifyTimeoutHeader) + 1_000
                : null;

            await Promise.race(
              [
                // We don't actually expect any response body here, but waiting for
                // an empty body to be returned has been more reliable that waiting
                // for the response body stream to close.
                res.text(),
                notifyTimeoutMs
                  ? new Promise(resolve => setTimeout(resolve, notifyTimeoutMs))
                  : null,
              ].filter(Boolean),
            );
          } else if (res.status === 200) {
            const data = await res.json();
            if (data) {
              for (const event of data.events ?? []) {
                try {
                  await onEvent({
                    topic: event.topic,
                    eventPayload: event.payload,
                  });
                } catch (error) {
                  this.logger.warn(
                    `Subscriber "${subscriptionId}" failed to process event for topic "${event.topic}"`,
                    error,
                  );
                }
              }
            }
          } else {
            if (res.status === 404) {
              this.logger.info(
                `Polling event subscription resulted in a 404, recreating subscription`,
              );
              hasSubscription = false;
            } else {
              throw await ResponseError.fromResponse(res);
            }
          }
        }

        // If we haven't yet created the subscription, or if it was removed, create a new one
        if (!hasSubscription) {
          const res = await client.putSubscription(
            {
              path: { subscriptionId },
              body: { topics },
            },
            { token },
          );
          hasSubscription = true;
          if (!res.ok) {
            if (res.status === 404 && this.mode !== 'always') {
              this.logger.warn(
                `Event subscribe request failed with status 404, events backend not found. Will only receive events that were sent locally on this process.`,
              );
              // Events backend is not present and not configured to always be used, bail out and stop polling
              delete this.client;
              return;
            }
            throw await ResponseError.fromResponse(res);
          }
        }

        // No errors, reset backoff
        backoffMs = POLL_BACKOFF_START_MS;

        process.nextTick(poll);
      } catch (error) {
        this.logger.warn(
          `Poll failed for subscription "${subscriptionId}", retrying in ${backoffMs.toFixed(
            0,
          )}ms`,
          error,
        );
        setTimeout(poll, backoffMs);
        backoffMs = Math.min(
          backoffMs * POLL_BACKOFF_FACTOR,
          POLL_BACKOFF_MAX_MS,
        );
      } finally {
        lock.release();
      }
    };
    poll();
  }

  async #getToken() {
    if (!this.auth) {
      throw new Error('Auth service not available');
    }

    try {
      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'events',
      });
      return token;
    } catch (error) {
      // This is a bit hacky, but handles the case where new auth is used
      // without legacy auth fallback, and the events backend is not installed
      if (
        String(error).includes('Unable to generate legacy token') &&
        this.mode !== 'always'
      ) {
        this.logger.warn(
          `The events backend is not available and neither is legacy auth. Future events will not be persisted.`,
        );
        delete this.client;
        return undefined;
      }
      throw error;
    }
  }

  async shutdown() {
    this.#isShuttingDown = true;
    await Promise.all(this.#shutdownLocks);
  }

  #isShuttingDown = false;
  #shutdownLocks = new Set<Promise<void>>();

  // This locking mechanism helps ensure that we are either idle or waiting for
  // a blocked events call before shutting down. It increases out changes of
  // never dropping any events on shutdown.
  #getShutdownLock(): { release(): void } | undefined {
    if (this.#isShuttingDown) {
      return undefined;
    }

    let release: () => void;

    const lock = new Promise<void>(resolve => {
      release = () => {
        resolve();
        this.#shutdownLocks.delete(lock);
      };
    });
    this.#shutdownLocks.add(lock);
    return { release: release! };
  }
}

/**
 * In-process event broker which will pass the event to all registered subscribers
 * interested in it.
 * Events will not be persisted in any form.
 * Events will not be passed to subscribers at other instances of the same cluster.
 *
 * @public
 */
// TODO(pjungermann): add opentelemetry? (see plugins/catalog-backend/src/util/opentelemetry.ts, etc.)
export class DefaultEventsService implements EventsService {
  private constructor(
    private readonly logger: LoggerService,
    private readonly localBus: LocalEventBus,
    private readonly mode: EventBusMode,
  ) {}

  static create(options: {
    logger: LoggerService;
    config?: RootConfigService;
    useEventBus?: EventBusMode;
  }): DefaultEventsService {
    const eventBusMode =
      options.useEventBus ??
      ((options.config?.getOptionalString('events.useEventBus') ??
        'auto') as EventBusMode);
    if (!EVENT_BUS_MODES.includes(eventBusMode)) {
      throw new Error(
        `Invalid events.useEventBus config, must be one of ${EVENT_BUS_MODES.join(
          ', ',
        )}, got '${eventBusMode}'`,
      );
    }

    return new DefaultEventsService(
      options.logger,
      new LocalEventBus(options.logger),
      eventBusMode,
    );
  }

  /**
   * Returns a plugin-scoped context of the `EventService`
   * that ensures to prefix subscriber IDs with the plugin ID.
   *
   * @param pluginId - The plugin that the `EventService` should be created for.
   */
  forPlugin(
    pluginId: string,
    options?: {
      discovery: DiscoveryService;
      logger: LoggerService;
      auth: AuthService;
      lifecycle: LifecycleService;
    },
  ): EventsService {
    const client =
      options && this.mode !== 'never'
        ? new DefaultApiClient({
            discoveryApi: options.discovery,
            fetchApi: { fetch }, // use native node fetch
          })
        : undefined;
    const logger = options?.logger ?? this.logger;
    const service = new PluginEventsService(
      pluginId,
      this.localBus,
      logger,
      this.mode,
      client,
      options?.auth,
    );
    options?.lifecycle.addShutdownHook(async () => {
      await service.shutdown();
    });
    return service;
  }

  async publish(params: EventParams): Promise<void> {
    await this.localBus.publish(params);
  }

  async subscribe(options: EventsServiceSubscribeOptions): Promise<void> {
    this.localBus.subscribe(options);
  }
}
