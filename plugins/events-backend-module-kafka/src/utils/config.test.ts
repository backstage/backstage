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
import { ConfigReader } from '@backstage/config';
import { readRetryConfig, readKafkaConfig } from './config';

describe('readRetryConfig', () => {
  it('should return empty object when config is undefined', () => {
    const result = readRetryConfig(undefined);
    expect(result).toEqual({});
  });

  it('should return empty object when config is empty', () => {
    const config = new ConfigReader({});
    const result = readRetryConfig(config);
    expect(result).toEqual({});
  });

  it('should read retry configuration with milliseconds', () => {
    const config = new ConfigReader({
      maxRetryTime: { milliseconds: 20000 },
      initialRetryTime: { milliseconds: 200 },
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });

    const result = readRetryConfig(config);

    expect(result).toEqual({
      maxRetryTime: 20000,
      initialRetryTime: 200,
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });
  });

  it('should read retry configuration with string values', () => {
    const config = new ConfigReader({
      maxRetryTime: { seconds: 20 },
      initialRetryTime: { minutes: 1 },
      factor: '0.4',
      multiplier: '4',
      retries: '10',
    });

    const result = readRetryConfig(config);

    expect(result).toEqual({
      maxRetryTime: 20000,
      initialRetryTime: 60000,
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });
  });

  it('should handle HumanDuration values', () => {
    const config = new ConfigReader({
      maxRetryTime: { hours: 1 },
      initialRetryTime: { days: 1 },
    });

    const result = readRetryConfig(config);

    expect(result).toEqual({
      maxRetryTime: 3600000,
      initialRetryTime: 86400000,
      factor: undefined,
      multiplier: undefined,
      retries: undefined,
    });
  });

  it('should handle partial configuration', () => {
    const config = new ConfigReader({
      maxRetryTime: { milliseconds: 15000 },
      retries: 5,
    });

    const result = readRetryConfig(config);

    expect(result).toEqual({
      maxRetryTime: 15000,
      initialRetryTime: undefined,
      factor: undefined,
      multiplier: undefined,
      retries: 5,
    });
  });
});

describe('readKafkaConfig', () => {
  it('should read minimal kafka configuration', () => {
    const config = new ConfigReader({
      clientId: 'test-client',
      brokers: ['kafka1:9092', 'kafka2:9092'],
    });

    const result = readKafkaConfig(config);

    expect(result).toEqual({
      clientId: 'test-client',
      brokers: ['kafka1:9092', 'kafka2:9092'],
      authenticationTimeout: undefined,
      connectionTimeout: undefined,
      requestTimeout: undefined,
      enforceRequestTimeout: undefined,
      ssl: undefined,
      sasl: undefined,
      retry: {},
    });
  });

  it('should read full kafka configuration with all optional fields', () => {
    const config = new ConfigReader({
      clientId: 'backstage-events',
      brokers: ['kafka1:9092', 'kafka2:9092'],
      authenticationTimeout: { milliseconds: 20000 },
      connectionTimeout: { milliseconds: 1500 },
      requestTimeout: { milliseconds: 20000 },
      enforceRequestTimeout: false,
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: 'username',
        password: 'password',
      },
      retry: {
        maxRetryTime: { milliseconds: 20000 },
        initialRetryTime: { milliseconds: 200 },
        factor: 0.4,
        multiplier: 4,
        retries: 10,
      },
    });

    const result = readKafkaConfig(config);

    expect(result).toEqual({
      clientId: 'backstage-events',
      brokers: ['kafka1:9092', 'kafka2:9092'],
      authenticationTimeout: 20000,
      connectionTimeout: 1500,
      requestTimeout: 20000,
      enforceRequestTimeout: false,
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: 'username',
        password: 'password',
      },
      retry: {
        maxRetryTime: 20000,
        initialRetryTime: 200,
        factor: 0.4,
        multiplier: 4,
        retries: 10,
      },
    });
  });

  it('should handle HumanDuration values for timeouts', () => {
    const config = new ConfigReader({
      clientId: 'test-client',
      brokers: ['kafka:9092'],
      authenticationTimeout: { hours: 1 },
      connectionTimeout: { days: 1 },
      requestTimeout: { minutes: 5 },
    });

    const result = readKafkaConfig(config);

    expect(result.authenticationTimeout).toBe(3600000);
    expect(result.connectionTimeout).toBe(86400000);
    expect(result.requestTimeout).toBe(300000);
  });

  it('should handle complex SSL configuration', () => {
    const config = new ConfigReader({
      clientId: 'secure-client',
      brokers: ['secure-kafka:9093'],
      ssl: {
        rejectUnauthorized: false,
        ca: 'ca-certificate',
        key: 'client-key',
        cert: 'client-cert',
      },
    });

    const result = readKafkaConfig(config);

    expect(result.ssl).toEqual({
      rejectUnauthorized: false,
      ca: 'ca-certificate',
      key: 'client-key',
      cert: 'client-cert',
    });
  });

  it('should handle complex SASL configuration', () => {
    const config = new ConfigReader({
      clientId: 'sasl-client',
      brokers: ['sasl-kafka:9094'],
      sasl: {
        mechanism: 'scram-sha-256',
        username: 'kafka-user',
        password: 'kafka-password',
        authorizationIdentity: 'authz-user',
      },
    });

    const result = readKafkaConfig(config);

    expect(result.sasl).toEqual({
      mechanism: 'scram-sha-256',
      username: 'kafka-user',
      password: 'kafka-password',
      authorizationIdentity: 'authz-user',
    });
  });
});
