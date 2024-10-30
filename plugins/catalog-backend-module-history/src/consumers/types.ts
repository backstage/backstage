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

/**
 * THe options passed to {@link HistoryConsumerConnection.subscribe}.
 *
 * @public
 */
export interface SubscriptionOptions {
  /**
   * The unique ID of the subscription.
   *
   * @remarks
   *
   * It is important that this ID is unique for each subscription (not just
   * within any one given consumer) and does not change over time, since the
   * framework will track peristed metadata for each subscription, including
   * what the last consumed event ID was. If this ID changes, it will be seen as
   * completely new subscription and any previous consumption progress will be
   * lost.
   */
  subscriptionId: string;
  /**
   * Where to start the subscription from when it's new - either from the very
   * oldes known event, or starting from any events being created from this time
   * forward.
   */
  startAt: 'beginning' | 'now';
  /**
   * THe subscription receives "pages" of events, where each page is a batch
   * limited to this given size. If you only want to receive one single event at
   * a time you can set this value to 1, but be aware that this may come with a
   * performance hit.
   */
  maxPageSize?: number;
}

/**
 * A single history event, received through a consumer's subscription.
 *
 * @public
 */
export interface SubscriptionEvent {
  /** A unique identifier for this particular event */
  id: string;
  /** An ISO timestamp string for when the event happened */
  eventAt: Date;
  /** The distinct type of event */
  eventType: string;
  /** The entity ref related to the event, where applicable */
  entityRef?: string;
  /** The JSON serialized body of the entity related to the event, where applicable */
  entityJson?: string;
}

/**
 * The consumer connection passed by the framework to
 * {@link HistoryConsumer.connect}.
 *
 * @public
 */
export interface HistoryConsumerConnection {
  /**
   * Initiates a subscription to history events, with the given options.
   */
  subscribe(options: SubscriptionOptions): AsyncGenerator<SubscriptionEvent[]>;
}

/**
 * A consumer of catalog history events. These are registered with the
 * {@link historyConsumersExtensionPoint}.
 *
 * @public
 */
export interface HistoryConsumer {
  /**
   * A unique name for the consumer. This is used to identification in
   * debugging, logs etc.
   */
  getConsumerName(): string;
  /**
   * Connects the consumer. This method is called by the framework after the
   * catalog and its history module are ready to receive subscriptions.
   */
  connect(connection: HistoryConsumerConnection): void;
}
