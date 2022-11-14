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

import { Config } from '@backstage/config';
import { HumanDuration, JsonObject } from '@backstage/types';
import { Duration } from 'luxon';

const CONFIG_PREFIX_MODULE = 'events.modules.awsSqs.';
const CONFIG_PREFIX_PUBLISHER = `${CONFIG_PREFIX_MODULE}awsSqsConsumingEventPublisher.`;
const DEFAULT_WAIT_TIME_AFTER_EMPTY_RECEIVE = { minutes: 1 };
const MAX_WAIT_SECONDS = 20;

export interface AwsSqsEventSourceConfig {
  pollingWaitTime: Duration;
  queueUrl: string;
  region: string;
  timeout: Duration;
  topic: string;
  visibilityTimeout?: Duration;
  waitTimeAfterEmptyReceive: Duration;
}

// TODO(pjungermann): validation could be improved similar to `convertToHumanDuration` at @backstage/backend-tasks
function readOptionalHumanDuration(
  config: Config,
  key: string,
): HumanDuration | undefined {
  return config.getOptional<JsonObject>(key) as HumanDuration;
}

function readOptionalDuration(
  config: Config,
  key: string,
): Duration | undefined {
  const duration = readOptionalHumanDuration(config, key);
  return duration ? Duration.fromObject(duration) : undefined;
}

export function readConfig(config: Config): AwsSqsEventSourceConfig[] {
  const key = `${CONFIG_PREFIX_PUBLISHER}topics`;
  const topics = config.getOptionalConfig(key);

  return (
    topics?.keys()?.map(topic => {
      const topicConfig = topics.getConfig(topic);
      const keyPrefix = `${key}.${topic}.`;

      // queue config:
      const pollingWaitTime = Duration.fromObject(
        readOptionalHumanDuration(topicConfig, 'queue.waitTime') ?? {
          seconds: MAX_WAIT_SECONDS,
        },
      );
      if (
        pollingWaitTime.valueOf() < 0 ||
        pollingWaitTime.as('seconds') > MAX_WAIT_SECONDS
      ) {
        throw new Error(
          `${keyPrefix}queue.waitTime must be within 0..${MAX_WAIT_SECONDS} seconds.`,
        );
      }
      const queueUrl = topicConfig.getString('queue.url');
      const region = topicConfig.getString('queue.region');
      const visibilityTimeout = readOptionalDuration(
        topicConfig,
        'queue.visibilityTimeout',
      );

      // task:
      const waitTimeAfterEmptyReceive = Duration.fromObject(
        readOptionalHumanDuration(topicConfig, 'waitTimeAfterEmptyReceive') ??
          DEFAULT_WAIT_TIME_AFTER_EMPTY_RECEIVE,
      );
      if (waitTimeAfterEmptyReceive.valueOf() < 0) {
        throw new Error(
          `The ${keyPrefix}waitTimeAfterEmptyReceive must not be negative.`,
        );
      }
      const timeout =
        readOptionalDuration(topicConfig, 'timeout') ??
        pollingWaitTime
          .plus(waitTimeAfterEmptyReceive)
          .plus(Duration.fromObject({ seconds: 180 }));
      if (
        timeout.valueOf() <=
        pollingWaitTime.valueOf() + waitTimeAfterEmptyReceive.valueOf()
      ) {
        throw new Error(
          `The ${keyPrefix}timeout must be greater than ${keyPrefix}queue.waitTime + ${keyPrefix}waitTimeAfterEmptyReceive.`,
        );
      }

      return {
        pollingWaitTime,
        queueUrl,
        region,
        timeout,
        topic,
        visibilityTimeout,
        waitTimeAfterEmptyReceive,
      };
    }) ?? []
  );
}
