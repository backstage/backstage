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

import { HumanDuration } from '@backstage/types';

export interface Config {
  events?: {
    modules?: {
      /**
       * events-backend-module-kafka plugin configuration.
       */
      kafka?: {
        /**
         * Configuration for KafkaConsumingEventPublisher
         */
        kafkaConsumingEventPublisher?: {
          /**
           * (Required) Client ID used by Backstage to identify when connecting to the Kafka cluster.
           */
          clientId: string;
          /**
           * (Required) List of brokers in the Kafka cluster to connect to.
           */
          brokers: string[];
          /**
           * Optional SSL connection parameters to connect to the cluster. Passed directly to Node tls.connect.
           * See https://nodejs.org/dist/latest-v8.x/docs/api/tls.html#tls_tls_createsecurecontext_options
           */
          ssl?:
            | {
                ca?: string[];
                /** @visibility secret */
                key?: string;
                cert?: string;
                rejectUnauthorized?: boolean;
              }
            | boolean;
          /**
           * Optional SASL connection parameters.
           */
          sasl?: {
            mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
            username: string;
            /** @visibility secret */
            password: string;
          };

          /**
           * Optional retry connection parameters.
           */
          retry: {
            /**
             * (Optional) Maximum wait time for a retry
             * Default: 30000 ms.
             */
            maxRetryTime: HumanDuration | string;

            /**
             * (Optional) Initial value used to calculate the retry (This is still randomized following the randomization factor)
             * Default: 300 ms.
             */
            initialRetryTime: HumanDuration | string;

            /**
             * (Optional) Randomization factor
             * Default: 0.2.
             */
            factor: number;

            /**
             * (Optional) Exponential factor
             * Default: 2.
             */
            multiplier: number;

            /**
             * (Optional) Max number of retries per call
             * Default: 5.
             */
            retries: number;
          };

          /**
           * (Optional) Timeout for authentication requests.
           * Default: 10000 ms.
           */
          authenticationTimeout: HumanDuration | string;

          /**
           * (Optional) Time to wait for a successful connection.
           * Default: 1000 ms.
           */
          connectionTimeout: HumanDuration | string;

          /**
           * (Optional) Time to wait for a successful request.
           * Default: 30000 ms.
           */
          requestTimeout: HumanDuration | string;

          /**
           * (Optional) The request timeout can be disabled by setting enforceRequestTimeout to false.
           * Default: true
           */
          enforceRequestTimeout: boolean;

          /**
           * Contains a object per topic for which an Kafka queue
           * should be used as source of events.
           */
          topics: Array<{
            /**
             * (Required) The Backstage topic to publish to
             */
            topic: string;
            /**
             * (Required) KafkaConsumer-related configuration.
             */
            kafka: {
              /**
               * (Required) The Kafka topics to subscribe to
               */
              topics: string[];
              /**
               * (Required) The GroupId to be used by the topic consumers
               */
              groupId: string;

              /**
               * (Optional) Timeout used to detect failures.
               * The consumer sends periodic heartbeats to indicate its liveness to the broker.
               * If no heartbeats are received by the broker before the expiration of this session timeout,
               * then the broker will remove this consumer from the group and initiate a rebalance
               * Default: 30000 ms.
               */
              sessionTimeout: HumanDuration | string;

              /**
               * (Optional) The maximum time that the coordinator will wait for each member to rejoin when rebalancing the group
               * Default: 60000 ms.
               */
              rebalanceTimeout: HumanDuration | string;

              /**
               * (Optional) The expected time between heartbeats to the consumer coordinator.
               * Heartbeats are used to ensure that the consumer's session stays active.
               * The value must be set lower than session timeout
               * Default: 3000 ms.
               */
              heartbeatInterval: HumanDuration | string;

              /**
               * (Optional) The period of time after which we force a refresh of metadata
               * even if we haven't seen any partition leadership changes to proactively discover any new brokers or partitions
               * Default: 300000 ms (5 minutes).
               */
              metadataMaxAge: HumanDuration | string;

              /**
               * (Optional) The maximum amount of data per-partition the server will return.
               * This size must be at least as large as the maximum message size the server allows
               * or else it is possible for the producer to send messages larger than the consumer can fetch.
               * If that happens, the consumer can get stuck trying to fetch a large message on a certain partition
               * Default: 1048576 (1MB)
               */
              maxBytesPerPartition: number;

              /**
               * (Optional) Minimum amount of data the server should return for a fetch request, otherwise wait up to maxWaitTime for more data to accumulate.
               * Default: 1
               */
              minBytes: number;

              /**
               * (Optional) Maximum amount of bytes to accumulate in the response. Supported by Kafka >= 0.10.1.0
               * Default: 10485760 (10MB)
               */
              maxBytes: number;

              /**
               * (Optional) The maximum amount of time the server will block before answering the fetch request
               * if there isn’t sufficient data to immediately satisfy the requirement given by minBytes
               * Default: 5000
               */
              maxWaitTime: HumanDuration | string;
            };
          }>;
        };
      };
    };
  };
}
