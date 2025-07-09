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
import { InstrumentationConfigMap } from '@opentelemetry/auto-instrumentations-node';
import { IncomingMessage } from 'http';

/**
 * Disables all instrumentations by default to reduce noise and dependencies
 */
const disabledByDefault: InstrumentationConfigMap = {
  '@opentelemetry/instrumentation-amqplib': { enabled: false },
  '@opentelemetry/instrumentation-aws-lambda': { enabled: false },
  '@opentelemetry/instrumentation-aws-sdk': { enabled: false },
  '@opentelemetry/instrumentation-bunyan': { enabled: false },
  '@opentelemetry/instrumentation-cassandra-driver': { enabled: false },
  '@opentelemetry/instrumentation-connect': { enabled: false },
  '@opentelemetry/instrumentation-cucumber': { enabled: false },
  '@opentelemetry/instrumentation-dataloader': { enabled: false },
  '@opentelemetry/instrumentation-dns': { enabled: false },
  '@opentelemetry/instrumentation-express': { enabled: false },
  '@opentelemetry/instrumentation-fastify': { enabled: false },
  '@opentelemetry/instrumentation-fs': { enabled: false },
  '@opentelemetry/instrumentation-generic-pool': { enabled: false },
  '@opentelemetry/instrumentation-graphql': { enabled: false },
  '@opentelemetry/instrumentation-grpc': { enabled: false },
  '@opentelemetry/instrumentation-hapi': { enabled: false },
  '@opentelemetry/instrumentation-http': { enabled: false },
  '@opentelemetry/instrumentation-ioredis': { enabled: false },
  '@opentelemetry/instrumentation-kafkajs': { enabled: false },
  '@opentelemetry/instrumentation-knex': { enabled: false },
  '@opentelemetry/instrumentation-koa': { enabled: false },
  '@opentelemetry/instrumentation-lru-memoizer': { enabled: false },
  '@opentelemetry/instrumentation-memcached': { enabled: false },
  '@opentelemetry/instrumentation-mongodb': { enabled: false },
  '@opentelemetry/instrumentation-mongoose': { enabled: false },
  '@opentelemetry/instrumentation-mysql2': { enabled: false },
  '@opentelemetry/instrumentation-mysql': { enabled: false },
  '@opentelemetry/instrumentation-nestjs-core': { enabled: false },
  '@opentelemetry/instrumentation-net': { enabled: false },
  '@opentelemetry/instrumentation-oracledb': { enabled: false },
  '@opentelemetry/instrumentation-pg': { enabled: false },
  '@opentelemetry/instrumentation-pino': { enabled: false },
  '@opentelemetry/instrumentation-redis': { enabled: false },
  '@opentelemetry/instrumentation-restify': { enabled: false },
  '@opentelemetry/instrumentation-router': { enabled: false },
  '@opentelemetry/instrumentation-runtime-node': { enabled: false },
  '@opentelemetry/instrumentation-socket.io': { enabled: false },
  '@opentelemetry/instrumentation-tedious': { enabled: false },
  '@opentelemetry/instrumentation-undici': { enabled: false },
  '@opentelemetry/instrumentation-winston': { enabled: false },
};

const coreServiceInstrumentations: InstrumentationConfigMap = {
  '@opentelemetry/instrumentation-router': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-express': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-knex': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-pg': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-mysql': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-memcached': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-redis': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-winston': {
    enabled: true,
  },
  '@opentelemetry/instrumentation-http': {
    enabled: true,
    // Ignore health and metrics endpoints
    ignoreIncomingRequestHook: (incomingRequest: IncomingMessage) =>
      Boolean(
        incomingRequest.url?.startsWith('/.backstage/health') ||
          incomingRequest.url?.startsWith('/metrics'),
      ),
  },
};

/**
 * Returns the default instrumentation config for libraries used by Backstage core services.
 *
 * This disables all instrumentations by default and only enables specific ones
 * to reduce the number of dependencies that are instrumented and minimize noise.
 *
 * @see https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/packages/auto-instrumentations-node#default-instrumentations
 */
export async function getBackstageNodeAutoInstrumentationConfigMap(): Promise<InstrumentationConfigMap> {
  return {
    ...disabledByDefault,
    ...coreServiceInstrumentations,
  };
}
