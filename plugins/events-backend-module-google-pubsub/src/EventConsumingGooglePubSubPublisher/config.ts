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
import {
  readOptionalFilterPredicateFromConfig,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import { createPatternResolver } from '../util/createPatternResolver';
import { EventContext, SubscriptionTask } from './types';

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
    const filter = readFilter(config);
    const mapToTopic = readTopicMapper(config);
    const mapToAttributes = readAttributeMapper(config);

    return {
      id: subscriptionId,
      sourceTopics: sourceTopics,
      targetTopicPattern: config.getString('targetTopicName'),
      filter,
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
 * Handles the `filter` configuration field.
 */
function readFilter(config: Config): (context: EventContext) => boolean {
  const predicate = readOptionalFilterPredicateFromConfig(config, {
    key: 'filter',
  });
  if (!predicate) {
    return () => true;
  }

  return filterPredicateToFilterFunction(predicate);
}

/**
 * Handles the `targetTopicName` configuration field.
 */
function readTopicMapper(
  config: Config,
): (context: EventContext) => { project: string; topic: string } | undefined {
  const regex = /^projects\/([^/]+)\/topics\/(.+)$/;

  const targetTopicPattern = config.getString('targetTopicName');
  let parts = targetTopicPattern.match(regex);
  if (!parts) {
    throw new InputError(
      `Expected Google Pub/Sub 'targetTopicName' to be on the form 'projects/PROJECT_ID/topics/TOPIC_ID' but got '${targetTopicPattern}'`,
    );
  }

  const patternResolver = createPatternResolver(targetTopicPattern);

  return context => {
    try {
      parts = patternResolver(context).match(regex);
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
): (context: EventContext) => Record<string, string> {
  const setters = new Array<
    (options: {
      context: EventContext;
      attributes: Record<string, string>;
    }) => void
  >();

  const eventMetadata = config.getOptionalConfig('messageAttributes');
  if (eventMetadata) {
    for (const key of eventMetadata?.keys() ?? []) {
      const valuePattern = eventMetadata.getString(key);
      const patternResolver = createPatternResolver(valuePattern);
      setters.push(({ context, attributes }) => {
        try {
          const value = patternResolver(context);
          if (value) {
            attributes[key] = value;
          }
        } catch {
          // ignore silently, keep original
        }
      });
    }
  }

  return context => {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(context.event.metadata ?? {})) {
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
      setter({ context, attributes: result });
    }
    return result;
  };
}
