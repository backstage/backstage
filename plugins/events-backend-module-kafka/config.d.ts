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
         *
         * Supports either:
         * 1. Single configuration object (legacy format)
         * 2. Multiple named instances as a record where each key is a unique name for the Kafka instance
         */
        kafkaConsumingEventPublisher?:
          | {
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
              retry?: {
                /**
                 * (Optional) Maximum wait time for a retry
                 * Default: 30000 ms.
                 */
                maxRetryTime?: HumanDuration | string;

                /**
                 * (Optional) Initial value used to calculate the retry (This is still randomized following the randomization factor)
                 * Default: 300 ms.
                 */
                initialRetryTime?: HumanDuration | string;

                /**
                 * (Optional) Randomization factor
                 * Default: 0.2.
                 */
                factor?: number;

                /**
                 * (Optional) Exponential factor
                 * Default: 2.
                 */
                multiplier?: number;

                /**
                 * (Optional) Max number of retries per call
                 * Default: 5.
                 */
                retries?: number;
              };

              /**
               * (Optional) Timeout for authentication requests.
               * Default: 10000 ms.
               */
              authenticationTimeout?: HumanDuration | string;

              /**
               * (Optional) Time to wait for a successful connection.
               * Default: 1000 ms.
               */
              connectionTimeout?: HumanDuration | string;

              /**
               * (Optional) Time to wait for a successful request.
               * Default: 30000 ms.
               */
              requestTimeout?: HumanDuration | string;

              /**
               * (Optional) The request timeout can be disabled by setting enforceRequestTimeout to false.
               * Default: true
               */
              enforceRequestTimeout?: boolean;

              /**
               * Contains an object per topic for which a Kafka queue
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
                  sessionTimeout?: HumanDuration | string;

                  /**
                   * (Optional) The maximum time that the coordinator will wait for each member to rejoin when rebalancing the group
                   * Default: 60000 ms.
                   */
                  rebalanceTimeout?: HumanDuration | string;

                  /**
                   * (Optional) The expected time between heartbeats to the consumer coordinator.
                   * Heartbeats are used to ensure that the consumer's session stays active.
                   * The value must be set lower than session timeout
                   * Default: 3000 ms.
                   */
                  heartbeatInterval?: HumanDuration | string;

                  /**
                   * (Optional) The period of time after which we force a refresh of metadata
                   * even if we haven't seen any partition leadership changes to proactively discover any new brokers or partitions
                   * Default: 300000 ms (5 minutes).
                   */
                  metadataMaxAge?: HumanDuration | string;

                  /**
                   * (Optional) The maximum amount of data per-partition the server will return.
                   * This size must be at least as large as the maximum message size the server allows
                   * or else it is possible for the producer to send messages larger than the consumer can fetch.
                   * If that happens, the consumer can get stuck trying to fetch a large message on a certain partition
                   * Default: 1048576 (1MB)
                   */
                  maxBytesPerPartition?: number;

                  /**
                   * (Optional) Minimum amount of data the server should return for a fetch request, otherwise wait up to maxWaitTime for more data to accumulate.
                   * Default: 1
                   */
                  minBytes?: number;

                  /**
                   * (Optional) Maximum amount of bytes to accumulate in the response. Supported by Kafka >= 0.10.1.0
                   * Default: 10485760 (10MB)
                   */
                  maxBytes?: number;

                  /**
                   * (Optional) The maximum amount of time the server will block before answering the fetch request
                   * if there isn't sufficient data to immediately satisfy the requirement given by minBytes
                   * Default: 5000
                   */
                  maxWaitTime?: HumanDuration | string;

                  /**
                   * (Optional) If true, the consumer group will start from the earliest offset when no committed offset is found.
                   * If false or not specified, it will start from the latest offset.
                   * Default: undefined (start from latest)
                   */
                  fromBeginning?: boolean;

                  /**
                   * (Optional) Enable auto-commit of offsets.
                   * When true (default), offsets are automatically committed at regular intervals (at-most-once delivery).
                   * When false, offsets are only committed after successful message processing (at-least-once delivery).
                   * Default: true (auto-commit enabled for backward compatibility)
                   */
                  autoCommit?: boolean;

                  /**
                   * (Optional) When true, the consumer will pause on error and stop processing messages.
                   * When false (default), the consumer will skip failed messages and continue processing.
                   * Note: When pauseOnError is false and autoCommit is also false, failed messages will still have their offsets committed.
                   * Default: false (skip errors for backward compatibility)
                   */
                  pauseOnError?: boolean;
                };
              }>;
            }
          | {
              [name: string]: {
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
                retry?: {
                  /**
                   * (Optional) Maximum wait time for a retry
                   * Default: 30000 ms.
                   */
                  maxRetryTime?: HumanDuration | string;

                  /**
                   * (Optional) Initial value used to calculate the retry (This is still randomized following the randomization factor)
                   * Default: 300 ms.
                   */
                  initialRetryTime?: HumanDuration | string;

                  /**
                   * (Optional) Randomization factor
                   * Default: 0.2.
                   */
                  factor?: number;

                  /**
                   * (Optional) Exponential factor
                   * Default: 2.
                   */
                  multiplier?: number;

                  /**
                   * (Optional) Max number of retries per call
                   * Default: 5.
                   */
                  retries?: number;
                };

                /**
                 * (Optional) Timeout for authentication requests.
                 * Default: 10000 ms.
                 */
                authenticationTimeout?: HumanDuration | string;

                /**
                 * (Optional) Time to wait for a successful connection.
                 * Default: 1000 ms.
                 */
                connectionTimeout?: HumanDuration | string;

                /**
                 * (Optional) Time to wait for a successful request.
                 * Default: 30000 ms.
                 */
                requestTimeout?: HumanDuration | string;

                /**
                 * (Optional) The request timeout can be disabled by setting enforceRequestTimeout to false.
                 * Default: true
                 */
                enforceRequestTimeout?: boolean;

                /**
                 * Contains an object per topic for which a Kafka queue
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
                    sessionTimeout?: HumanDuration | string;

                    /**
                     * (Optional) The maximum time that the coordinator will wait for each member to rejoin when rebalancing the group
                     * Default: 60000 ms.
                     */
                    rebalanceTimeout?: HumanDuration | string;

                    /**
                     * (Optional) The expected time between heartbeats to the consumer coordinator.
                     * Heartbeats are used to ensure that the consumer's session stays active.
                     * The value must be set lower than session timeout
                     * Default: 3000 ms.
                     */
                    heartbeatInterval?: HumanDuration | string;

                    /**
                     * (Optional) The period of time after which we force a refresh of metadata
                     * even if we haven't seen any partition leadership changes to proactively discover any new brokers or partitions
                     * Default: 300000 ms (5 minutes).
                     */
                    metadataMaxAge?: HumanDuration | string;

                    /**
                     * (Optional) The maximum amount of data per-partition the server will return.
                     * This size must be at least as large as the maximum message size the server allows
                     * or else it is possible for the producer to send messages larger than the consumer can fetch.
                     * If that happens, the consumer can get stuck trying to fetch a large message on a certain partition
                     * Default: 1048576 (1MB)
                     */
                    maxBytesPerPartition?: number;

                    /**
                     * (Optional) Minimum amount of data the server should return for a fetch request, otherwise wait up to maxWaitTime for more data to accumulate.
                     * Default: 1
                     */
                    minBytes?: number;

                    /**
                     * (Optional) Maximum amount of bytes to accumulate in the response. Supported by Kafka >= 0.10.1.0
                     * Default: 10485760 (10MB)
                     */
                    maxBytes?: number;

                    /**
                     * (Optional) The maximum amount of time the server will block before answering the fetch request
                     * if there isn't sufficient data to immediately satisfy the requirement given by minBytes
                     * Default: 5000
                     */
                    maxWaitTime?: HumanDuration | string;

                    /**
                     * (Optional) If true, the consumer group will start from the earliest offset when no committed offset is found.
                     * If false or not specified, it will start from the latest offset.
                     * Default: undefined (start from latest)
                     */
                    fromBeginning?: boolean;

                    /**
                     * (Optional) Enable auto-commit of offsets.
                     * When true (default), offsets are automatically committed at regular intervals (at-most-once delivery).
                     * When false, offsets are only committed after successful message processing (at-least-once delivery).
                     * Default: true (auto-commit enabled for backward compatibility)
                     */
                    autoCommit?: boolean;

                    /**
                     * (Optional) When true, the consumer will pause on error and stop processing messages.
                     * When false (default), the consumer will skip failed messages and continue processing.
                     * Note: When pauseOnError is false and autoCommit is also false, failed messages will still have their offsets committed.
                     * Default: false (skip errors for backward compatibility)
                     */
                    pauseOnError?: boolean;
                  };
                }>;
              };
            };

        /**
         * Configuration for KafkaPublishingEventConsumer
         *
         * Supports multiple named instances as a record where each key is a unique name
         * for the Kafka producer configuration.
         */
        kafkaPublishingEventConsumer?: {
          [name: string]: {
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
            retry?: {
              /**
               * (Optional) Maximum wait time for a retry
               * Default: 30000 ms.
               */
              maxRetryTime?: HumanDuration | string;

              /**
               * (Optional) Initial value used to calculate the retry (This is still randomized following the randomization factor)
               * Default: 300 ms.
               */
              initialRetryTime?: HumanDuration | string;

              /**
               * (Optional) Randomization factor
               * Default: 0.2.
               */
              factor?: number;

              /**
               * (Optional) Exponential factor
               * Default: 2.
               */
              multiplier?: number;

              /**
               * (Optional) Max number of retries per call
               * Default: 5.
               */
              retries?: number;
            };

            /**
             * (Optional) Timeout for authentication requests.
             * Default: 10000 ms.
             */
            authenticationTimeout?: HumanDuration | string;

            /**
             * (Optional) Time to wait for a successful connection.
             * Default: 1000 ms.
             */
            connectionTimeout?: HumanDuration | string;

            /**
             * (Optional) Time to wait for a successful request.
             * Default: 30000 ms.
             */
            requestTimeout?: HumanDuration | string;

            /**
             * (Optional) The request timeout can be disabled by setting enforceRequestTimeout to false.
             * Default: true
             */
            enforceRequestTimeout?: boolean;

            /**
             * Contains an object per topic for which a Kafka queue
             * should be used as destination for events.
             */
            topics: Array<{
              /**
               * (Required) The Backstage topic to consume from
               */
              topic: string;
              /**
               * (Required) KafkaProducer-related configuration.
               */
              kafka: {
                /**
                 * (Required) The Kafka topic to publish to
                 */
                topic: string;

                /**
                 * (Optional) Allow topic creation when querying metadata for non-existent topics.
                 * Default: true
                 */
                allowAutoTopicCreation?: boolean;

                /**
                 * (Optional) The period of time after which we force a refresh of metadata
                 * even if we haven't seen any partition leadership changes to proactively discover any new brokers or partitions
                 * Default: 300000 ms (5 minutes).
                 */
                metadataMaxAge?: HumanDuration | string;

                /**
                 * (Optional) The maximum amount of time in ms that the transaction coordinator will wait for a transaction status update
                 * from the producer before proactively aborting the ongoing transaction.
                 * If this value is larger than the `transaction.max.timeout.ms`` setting in the broker, the request will fail with a `InvalidTransactionTimeout` error
                 * Default: 60000 ms.
                 */
                transactionTimeout?: HumanDuration | string;

                /**
                 * (Optional) Experimental. If enabled producer will ensure each message is written exactly once. Acks must be set to -1 ("all").
                 * Retries will default to MAX_SAFE_INTEGER.
                 * Default: false.
                 */
                idempotent?: boolean;

                /**
                 * (Optional) Max number of requests that may be in progress at any time. If falsey then no limit.
                 * Default: null.
                 */
                maxInFlightRequests?: number;

                /**
                 * Optional retry connection parameters.
                 */
                retry?: {
                  /**
                   * (Optional) Maximum wait time for a retry
                   * Default: 30000 ms.
                   */
                  maxRetryTime?: HumanDuration | string;

                  /**
                   * (Optional) Initial value used to calculate the retry (This is still randomized following the randomization factor)
                   * Default: 300 ms.
                   */
                  initialRetryTime?: HumanDuration | string;

                  /**
                   * (Optional) Randomization factor
                   * Default: 0.2.
                   */
                  factor?: number;

                  /**
                   * (Optional) Exponential factor
                   * Default: 2.
                   */
                  multiplier?: number;

                  /**
                   * (Optional) Max number of retries per call
                   * Default: 5.
                   */
                  retries?: number;
                };
                /**
                 * (Optional) Forward Backstage event metadata as Kafka headers.
                 * Defaults to not forwarding unless enabled. When forwarding is enabled,
                 * the Authorization header is excluded by default unless a whitelist is provided.
                 */
                headers?: {
                  /** Enable forwarding metadata as headers */
                  forward?: boolean;
                  /** Only include these header keys (case-insensitive). If set, blacklist is ignored. */
                  whitelist?: string[];
                  /** Exclude these header keys (case-insensitive). Default: ['authorization'] */
                  blacklist?: string[];
                };
              };
            }>;
          };
        };
      };
    };
  };
}
