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
import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { KafkaConfig, RetryOptions } from 'kafkajs';

/**
 * Reads an optional HumanDuration from the config and returns the value in milliseconds if the key is defined.
 *
 * @param config - The configuration object to read from.
 * @param key - The key to look up in the configuration.
 * @returns The duration in milliseconds, or undefined if the key is not defined.
 */
export const readOptionalHumanDurationInMs = (
  config: Config,
  key: string,
): number | undefined => {
  const humanDuration = config.has(key)
    ? readDurationFromConfig(config, { key })
    : undefined;

  if (!humanDuration) return undefined;

  return durationToMilliseconds(humanDuration);
};

/**
 * Reads retry configuration options from the provided config object.
 *
 * @param config - The configuration object to read retry options from, or undefined.
 * @returns A RetryOptions object with optional retry settings, or an empty object if config is undefined.
 */
export const readRetryConfig = (config: Config | undefined): RetryOptions => {
  if (!config) {
    return {};
  }

  return {
    maxRetryTime: readOptionalHumanDurationInMs(config, 'maxRetryTime'),
    initialRetryTime: readOptionalHumanDurationInMs(config, 'initialRetryTime'),
    factor: config.getOptionalNumber('factor'),
    multiplier: config.getOptionalNumber('multiplier'),
    retries: config.getOptionalNumber('retries'),
  };
};

/**
 * Reads Kafka configuration from the provided config object.
 *
 * @param config - The configuration object containing Kafka settings.
 * @returns A KafkaConfig object with all necessary Kafka connection and authentication settings.
 */
export const readKafkaConfig = (config: Config): KafkaConfig => {
  return {
    clientId: config.getString('clientId'),
    brokers: config.getStringArray('brokers'),
    authenticationTimeout: readOptionalHumanDurationInMs(
      config,
      'authenticationTimeout',
    ),
    connectionTimeout: readOptionalHumanDurationInMs(
      config,
      'connectionTimeout',
    ),
    requestTimeout: readOptionalHumanDurationInMs(config, 'requestTimeout'),
    enforceRequestTimeout: config.getOptionalBoolean('enforceRequestTimeout'),
    ssl: config.getOptional('ssl') as KafkaConfig['ssl'],
    sasl: config.getOptional('sasl') as KafkaConfig['sasl'],
    retry: readRetryConfig(config.getOptionalConfig('retry')),
  };
};
