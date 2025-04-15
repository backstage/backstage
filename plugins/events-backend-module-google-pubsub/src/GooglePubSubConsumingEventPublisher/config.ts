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
import { Message } from '@google-cloud/pubsub';
import { SubscriptionTask } from './types';
import lodash from 'lodash';

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
        `Expected Googoe Pub/Sub subscription ID to consist of letters, numbers, dashes and lodashes, but got '${subscriptionId}'`,
      );
    }

    const config = subscriptionsConfig.getConfig(subscriptionId);
    const { project, subscription } = readSubscriptionName(config);
    const mapToTopic = readTopicMapper(config);
    const mapToMetadata = readMetadataMapper(config);

    return {
      id: subscriptionId,
      project,
      subscription,
      mapToTopic,
      mapToMetadata,
    };
  });
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
      `Expected Googoe Pub/Sub 'subscriptionName' to be on the form 'projects/PROJECT_ID/subscriptions/SUBSCRIPTION_ID' but got '${subscriptionName}'`,
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
): (message: Message) => string | undefined {
  const targetTopicPattern = config.getString('targetTopic');
  const patternResolver = createPatternResolver(targetTopicPattern);
  return message => {
    try {
      return patternResolver({ message });
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
): (message: Message) => Record<string, string> {
  const setters = new Array<
    (options: { message: Message; metadata: Record<string, string> }) => void
  >();

  const eventMetadata = config.getOptionalConfig('eventMetadata');
  if (eventMetadata) {
    for (const key of eventMetadata?.keys() ?? []) {
      const valuePattern = eventMetadata.getString(key);
      const patternResolver = createPatternResolver(valuePattern);
      setters.push(({ message, metadata }) => {
        try {
          const value = patternResolver({ message });
          if (value) {
            metadata[key] = value;
          }
        } catch {
          // ignore silently, keep original unchanged
        }
      });
    }
  }

  return message => {
    const result: Record<string, string> = {
      ...message.attributes,
    };
    for (const setter of setters) {
      setter({ message, metadata: result });
    }
    return result;
  };
}

/**
 * Takes a pattern string that may contain `{{ path.to.value }}` placeholders,
 * and returns a function that accepts a context object and returns strings that
 * have had its placeholders filled in by using `lodash.get` accordingly on the
 * context.
 */
export function createPatternResolver(
  pattern: string,
): (context: unknown) => string {
  // This split results in an array where even elements are static strings
  // between placeholders, and odd elements are the contents inside
  // placeholders.
  //
  // For example, the pattern:
  //   "{{ foo }}-{{bar}}{{baz}}."
  // will result in:
  //   ['', 'foo', '-', 'bar', '', 'baz', .']
  const patternParts = pattern.split(/\{{\s*([\w\[\]'_.-]*)\s*}}/g);

  const resolvers = new Array<(context: unknown) => string>();

  for (let i = 0; i < patternParts.length; i += 2) {
    const staticPart = patternParts[i];
    const placeholderPart = patternParts[i + 1];

    if (staticPart) {
      resolvers.push(() => staticPart);
    }

    if (placeholderPart) {
      resolvers.push(context => {
        const value = lodash.get(context, placeholderPart);
        if (typeof value === 'string' || Number.isFinite(value)) {
          return String(value);
        } else if (!value) {
          throw new InputError(`No value for selector '${placeholderPart}'`);
        } else {
          throw new InputError(
            `Expected string or number value for selector '${placeholderPart}', got ${typeof value}`,
          );
        }
      });
    }
  }

  return context => resolvers.map(resolver => resolver(context)).join('');
}
