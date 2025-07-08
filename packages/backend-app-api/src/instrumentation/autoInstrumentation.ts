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
import { InstrumentationConfig } from '@opentelemetry/instrumentation';

/**
 * Returns the default instrumentation config for libraries used by Backstage core services.
 *
 * This is a subset of the default instrumentation configuration for the Node.js
 * runtime to reduce the number of dependencies that are instrumented.
 *
 * @see https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/packages/auto-instrumentations-node#default-instrumentations
 */
export const getBackstageAutoInstrumentationConfigMap =
  (): InstrumentationConfigMap => {
    const enabledInstrumentations = [
      '@opentelemetry/instrumentation-http',
      '@opentelemetry/instrumentation-router',
      '@opentelemetry/instrumentation-express',
      '@opentelemetry/instrumentation-knex',
      '@opentelemetry/instrumentation-pg',
      '@opentelemetry/instrumentation-mysql',
      '@opentelemetry/instrumentation-memcached',
      '@opentelemetry/instrumentation-redis',
      '@opentelemetry/instrumentation-winston',
    ];

    const disabledInstrumentations = ['@opentelemetry/instrumentation-fs'];
    return {
      ...enabledInstrumentations.reduce((acc, instrumentation) => {
        acc[instrumentation] = {
          enabled: true,
        };
        return acc;
      }, {} as Record<string, InstrumentationConfig>),
      ...disabledInstrumentations.reduce((acc, instrumentation) => {
        acc[instrumentation] = {
          enabled: false,
        };
        return acc;
      }, {} as Record<string, InstrumentationConfig>),
    };
  };
