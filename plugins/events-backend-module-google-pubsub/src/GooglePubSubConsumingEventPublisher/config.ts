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
import { MessageContext, SubscriptionTask } from './types';

export function readSubscriptionTasksFromConfig(
  rootConfig: RootConfigService,
): SubscriptionTask[] {
  const subscriptionsConfig = rootConfig.getOptionalConfig(
    'events.modules.googlePubSub.googlePubSubConsumingEventPublisher.subscriptions',
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
    const { project, subscription } = readSubscriptionName(config);
    const filter = readFilter(config);
    const mapToTopic = readTopicMapper(config);
    const mapToMetadata = readMetadataMapper(config);

    return {
      id: subscriptionId,
      project,
      subscription,
      filter,
      mapToTopic,
      mapToMetadata,
    };
  });
}

function readFilter(config: Config): (message: MessageContext) => boolean {
  const predicate = readOptionalFilterPredicateFromConfig(config, {
    key: 'filter',
  });
  if (!predicate) {
    return () => true;
  }

  return filterPredicateToFilterFunction(predicate);
}

function readSubscriptionName(config: Config): {
  project: string;
  subscription: string;
} {
  const subscriptionName = config.getString('subscriptionName');
  const parts = subscriptionName.match(
    /^projects\/([^/]+)\/subscriptions\/(.+)$/,
  );
  if (!parts) {
    throw new InputError(
      `Expected Google Pub/Sub 'subscriptionName' to be on the form 'projects/PROJECT_ID/subscriptions/SUBSCRIPTION_ID' but got '${subscriptionName}'`,
    );
  }
  return {
    project: parts[1],
    subscription: parts[2],
  };
}

/**
 * Handles the `targetTopic` configuration field.
 */
function readTopicMapper(
  config: Config,
): (message: MessageContext) => string | undefined {
  const targetTopicPattern = config.getString('targetTopic');
  const patternResolver = createPatternResolver(targetTopicPattern);
  return message => {
    try {
      return patternResolver(message);
    } catch {
      // could not map to a topic
      return undefined;
    }
  };
}

/**
 * Handles the `eventMetadata` configuration field.
 */
function readMetadataMapper(
  config: Config,
): (message: MessageContext) => Record<string, string> {
  const setters = new Array<
    (options: {
      context: MessageContext;
      metadata: Record<string, string>;
    }) => void
  >();

  const eventMetadata = config.getOptionalConfig('eventMetadata');
  if (eventMetadata) {
    for (const key of eventMetadata?.keys() ?? []) {
      const valuePattern = eventMetadata.getString(key);
      const patternResolver = createPatternResolver(valuePattern);
      setters.push(({ context, metadata }) => {
        try {
          const value = patternResolver(context);
          if (value) {
            metadata[key] = value;
          }
        } catch {
          // ignore silently, keep original
        }
      });
    }
  }

  return context => {
    const result: Record<string, string> = {
      ...context.message.attributes,
    };
    for (const setter of setters) {
      setter({ context, metadata: result });
    }
    return result;
  };
}
