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

import {
  createServiceFactory,
  coreServices,
} from '@backstage/backend-plugin-api';
import { transports, format } from 'winston';
import { WinstonLogger } from '../rootLogger/WinstonLogger';

/**
 * Root-level logging.
 *
 * See {@link @backstage/code-plugin-api#RootLoggerService}
 * and {@link https://backstage.io/docs/backend-system/core-services/root-logger | the service docs}
 * for more information.
 *
 * @public
 */
export const rootLoggerServiceFactory = createServiceFactory({
  service: coreServices.rootLogger,
  deps: {
    redactions: coreServices.redactions,
  },
  async factory({ redactions }) {
    return WinstonLogger.create({
      redactions,
      meta: {
        service: 'backstage',
      },
      level: process.env.LOG_LEVEL || 'info',
      format:
        process.env.NODE_ENV === 'production'
          ? format.json()
          : WinstonLogger.colorFormat(),
      transports: [new transports.Console()],
    });
  },
});
