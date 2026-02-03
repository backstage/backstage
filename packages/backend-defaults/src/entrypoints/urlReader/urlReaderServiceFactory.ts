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

import { ReaderFactory } from './lib';
import { UrlReaders } from './lib/UrlReaders';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';

/**
 * @public
 * A non-singleton reference to URL Reader factory services.
 *
 * @example
 * Creating a service factory implementation for a Custom URL Reader.
 * ```ts
 * createServiceFactory({
 *   service: urlReaderFactoriesServiceRef,
 *   deps: {},
 *   async factory() {
 *     return CustomUrlReader.factory;
 *   },
 * });
 * ```
 */
export const urlReaderFactoriesServiceRef = createServiceRef<ReaderFactory>({
  id: 'core.urlReader.factories',
  scope: 'plugin',
  multiton: true,
});

/**
 * Reading content from external systems.
 *
 * See {@link @backstage/code-plugin-api#UrlReaderService}
 * and {@link https://backstage.io/docs/backend-system/core-services/url-reader | the service docs}
 * for more information.
 *
 * @public
 */
export const urlReaderServiceFactory = createServiceFactory({
  service: coreServices.urlReader,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.logger,
    factories: urlReaderFactoriesServiceRef,
  },
  async factory({ config, logger, factories }) {
    return UrlReaders.default({
      config,
      logger,
      factories,
    });
  },
});
