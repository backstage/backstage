/*
 * Copyright 2024 The Backstage Authors
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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import * as winston from 'winston';
import { defaultConsoleTransport } from '../../lib/defaultConsoleTransport';
import {
  DefaultRootAuditorService,
  auditorFieldFormat,
  defaultProdFormat,
} from './Auditor';

const transports = {
  auditorConsole: (config?: Config) => {
    if (!config?.getOptionalBoolean('console.enabled')) {
      return [];
    }
    return [defaultConsoleTransport];
  },
};

/**
 * Plugin-level auditing.
 *
 * See {@link @backstage/code-plugin-api#AuditorService}
 * and {@link https://backstage.io/docs/backend-system/core-services/auditor | the service docs}
 * for more information.
 *
 * @public
 */
export const auditorServiceFactory = createServiceFactory({
  service: coreServices.auditor,
  deps: {
    config: coreServices.rootConfig,
    auth: coreServices.auth,
    httpAuth: coreServices.httpAuth,
    plugin: coreServices.pluginMetadata,
  },
  async createRootContext({ config }) {
    const auditorConfig = config.getOptionalConfig('backend.auditor');

    const auditor = DefaultRootAuditorService.create({
      meta: {
        service: 'backstage',
      },
      format: winston.format.combine(
        auditorFieldFormat,
        process.env.NODE_ENV === 'production'
          ? defaultProdFormat
          : DefaultRootAuditorService.colorFormat(),
      ),
      transports: [...transports.auditorConsole(auditorConfig)],
    });

    return auditor;
  },
  factory({ plugin, auth, httpAuth }, rootAuditor) {
    return rootAuditor.forPlugin({ auth, httpAuth, plugin });
  },
});
