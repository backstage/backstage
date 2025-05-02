/*
 * Copyright 2022 The Backstage Authors
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

export interface Config {
  events?: {
    modules?: {
      /**
       * events-backend-module-google-pubsub configuration.
       */
      googlePubSub?: {
        /**
         * Configuration for `GooglePubSubConsumingEventPublisher`, which
         * consumes messages from a Google Pub/Sub subscription and forwards
         * them into the Backstage events system.
         */
        googlePubSubConsumingEventPublisher?: {
          /**
           * Generally contains a record per subscription to consume.
           */
          subscriptions: {
            /**
             * The name can be anything, but it is recommended to use only
             * letters, numbers, and hyphens for this identifier since it will
             * appear in logs and metric names etc.
             */
            [name: string]: {
              /**
               * The complete name of the Pub/Sub subscription to be used, on the
               * form
               * `projects/PROJECT_ID/subscriptions/SUBSCRIPTION_ID`.
               */
              subscriptionName: string;

              /**
               * The name of the events backend topic to which the messages are
               * to be forwarded.
               *
               * @remarks
               *
               * The value can contain placeholders on the form `{{ message.attributes.foo }}`,
               * to mirror attribute `foo` as the whole or part of the topic name.
               *
               * @example
               *
               * This example expects the Pub/Sub topic to contain GitHub
               * webhook events where the HTTP headers were mapped into
               * message attributes. The outcome should be that messages
               * end up on event topics such as `github.push`,
               * `github.repository` etc which matches the [`@backstage/plugin-events-backend-module-github`](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github) structure.
               *
               * ```yaml
               * targetTopic: 'github.{{ message.attributes.x-github-event }}'
               * ```
               */
              targetTopic: string;

              /**
               * Pub/Sub message attributes are by default copied to the event
               * metadata field. This setting allows you to override or amend
               * that metadata.
               *
               * @remarks
               *
               * The values can contain placeholders on the form `{{ message.attributes.foo }}`,
               * to mirror attribute `foo` as the whole or part of a metadata value.
               *
               * @example
               *
               * ```yaml
               * eventMetadata:
               *   x-gitHub-event: '{{ message.attributes.event }}'
               * ```
               */
              eventMetadata?: {
                [key: string]: string;
              };
            };
          };
        };
      };
    };
  };
}
