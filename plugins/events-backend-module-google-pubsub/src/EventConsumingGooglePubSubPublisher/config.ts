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

import { RootConfigService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { EventParams } from '@backstage/plugin-events-node';
import { createPatternResolver } from '../util/createPatternResolver';
import { SubscriptionTask } from './types';

export function readSubscriptionTasksFromConfig(
  rootConfig: RootConfigService,
): SubscriptionTask[] {
  const subscriptionsConfig = rootConfig.getOptionalConfig(
    'events.modules.googlePubSub.eventConsumingGooglePubSubPublisher.subscriptions',
  );
  if (!subscriptionsConfig) {
    return [];
  }

  return subscriptionsConfig.keys().map(subscriptionId => {
    if (!subscriptionId.match(/^[-_\w]+$/)) {
      throw new InputError(
        `Expected Google Pub/Sub subscription ID to consist of letters, numbers, dashes and underscores, but got '${subscriptionId}'`,
      );
    }

    const config = subscriptionsConfig.getConfig(subscriptionId);
    const sourceTopics = readSourceTopics(config);
    const mapToTopic = readTopicMapper(config);
    const mapToAttributes = readAttributeMapper(config);

    return {
      id: subscriptionId,
      sourceTopics: sourceTopics,
      targetTopicPattern: config.getString('targetTopicName'),
      mapToTopic,
      mapToAttributes,
    };
  });
}

function readSourceTopics(config: Config): string[] {
  if (Array.isArray(config.getOptional('sourceTopic'))) {
    return config.getStringArray('sourceTopic');
  }
  return [config.getString('sourceTopic')];
}

/**
 * Handles the `targetTopicName` configuration field.
 */
function readTopicMapper(
  config: Config,
): (event: EventParams) => { project: string; topic: string } | undefined {
  const regex = /^projects\/([^/]+)\/topics\/(.+)$/;

  const targetTopicPattern = config.getString('targetTopicName');
  let parts = targetTopicPattern.match(regex);
  if (!parts) {
    throw new InputError(
      `Expected Google Pub/Sub 'targetTopicName' to be on the form 'projects/PROJECT_ID/topics/TOPIC_ID' but got '${targetTopicPattern}'`,
    );
  }

  const patternResolver = createPatternResolver(targetTopicPattern);

  return event => {
    try {
      parts = patternResolver({ event }).match(regex);
      if (!parts) {
        return undefined;
      }
      return {
        project: parts[1],
        topic: parts[2],
      };
    } catch {
      // could not map to a topic
      return undefined;
    }
  };
}

/**
 * Handles the `messageAttributes` configuration field.
 */
function readAttributeMapper(
  config: Config,
): (event: EventParams) => Record<string, string> {
  const setters = new Array<
    (options: {
      event: EventParams;
      attributes: Record<string, string>;
    }) => void
  >();

  const eventMetadata = config.getOptionalConfig('messageAttributes');
  if (eventMetadata) {
    for (const key of eventMetadata?.keys() ?? []) {
      const valuePattern = eventMetadata.getString(key);
      const patternResolver = createPatternResolver(valuePattern);
      setters.push(({ event, attributes }) => {
        try {
          const value = patternResolver({ event });
          if (value) {
            attributes[key] = value;
          }
        } catch {
          // ignore silently, keep original
        }
      });
    }
  }

  return event => {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(event.metadata ?? {})) {
      if (value) {
        if (typeof value === 'string') {
          result[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          // Google Pub/Sub does not support array values
          result[key] = value.join(',');
        }
      }
    }
    for (const setter of setters) {
      setter({ event, attributes: result });
    }
    return result;
  };
}
