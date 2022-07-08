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

import { UrlReaders } from '@backstage/backend-common';
import {
  configServiceRef,
  createServiceFactory,
  loggerServiceRef,
  loggerToWinstonLogger,
  urlReaderServiceRef,
} from '@backstage/backend-plugin-api';

export const urlReaderFactory = createServiceFactory({
  service: urlReaderServiceRef,
  deps: {
    configFactory: configServiceRef,
    loggerFactory: loggerServiceRef,
  },
  factory: async ({ configFactory, loggerFactory }) => {
    return async (pluginId: string) => {
      const logger = await loggerFactory(pluginId);
      return UrlReaders.default({
        logger: loggerToWinstonLogger(logger),
        config: await configFactory(pluginId),
      });
    };
  },
});
