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

import { HumanDuration } from '@backstage/types';

export interface Config {
  events?: {
    modules?: {
      /**
       * events-backend-module-aws-sqs plugin configuration.
       */
      awsSqs?: {
        /**
         * Configuration for AwsSqsConsumingEventPublisher.
         */
        awsSqsConsumingEventPublisher?: {
          /**
           * Contains a record per topic for which an AWS SQS queue
           * should be used as source of events.
           */
          topics: Record<
            string,
            {
              /**
               * (Required) Queue-related configuration.
               */
              queue: {
                /**
                 * (Required) The region of the AWS SQS queue.
                 */
                region: string;
                /**
                 * (Required) The absolute URL for the AWS SQS queue to be used.
                 */
                url: string;
                /**
                 * (Optional) Visibility timeout for messages in flight.
                 */
                visibilityTimeout: HumanDuration;
                /**
                 * (Optional) Wait time when polling for available messages.
                 * Default: 20 seconds.
                 */
                waitTime: HumanDuration;
              };
              /**
               * (Optional) Timeout for the task execution which includes polling for messages
               * and publishing the events to the event broker
               * and the wait time after empty receives.
               *
               * Must be greater than `queue.waitTime` + `waitTimeAfterEmptyReceive`.
               */
              timeout: HumanDuration;
              /**
               * (Optional) Wait time before polling again if no message was received.
               * Default: 1 minute.
               */
              waitTimeAfterEmptyReceive: HumanDuration;
            }
          >;
        };
      };
    };
  };
}
