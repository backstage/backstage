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

import type {
  AuditorService,
  AuthService,
  HttpAuthService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import type { JsonObject } from '@backstage/types';
import type { Format } from 'logform';
import * as winston from 'winston';
import { WinstonLogger } from '../rootLogger';
import { DefaultAuditorService } from './DefaultAuditorService';

/** @public */
export const defaultFormatter = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

/**
 * Adds `isAuditEvent` field
 *
 * @public
 */
export const auditorFieldFormat = winston.format(info => {
  return { ...info, isAuditEvent: true };
})();

/**
 * Options for creating a {@link WinstonRootAuditorService}.
 * @public
 */
export type WinstonRootAuditorServiceOptions = {
  meta?: JsonObject;
  format?: Format;
  transports?: winston.transport[];
};

/**
 * An implementation of the {@link @backstage/backend-plugin-api#AuditorService} that logs events using a separate winston logger.
 *
 * @public
 *
 * @example
 * ```ts
 * export const auditorServiceFactory = createServiceFactory({
 *   service: coreServices.auditor,
 *   deps: {
 *     auth: coreServices.auth,
 *     httpAuth: coreServices.httpAuth,
 *     plugin: coreServices.pluginMetadata,
 *   },
 *   createRootContext() {
 *     return WinstonRootAuditorService.create();
 *   },
 *   factory({ plugin, auth, httpAuth }, root) {
 *     return root.forPlugin({ plugin, auth, httpAuth });
 *   },
 * });
 * ```
 */
export class WinstonRootAuditorService {
  private constructor(private readonly winstonLogger: WinstonLogger) {}

  /**
   * Creates a {@link WinstonRootAuditorService} instance.
   */
  static create(
    options?: WinstonRootAuditorServiceOptions,
  ): WinstonRootAuditorService {
    let winstonLogger = WinstonLogger.create({
      meta: {
        service: 'backstage',
      },
      level: 'info',
      format: winston.format.combine(
        auditorFieldFormat,
        options?.format ?? defaultFormatter,
      ),
      transports: options?.transports,
    });

    if (options?.meta) {
      winstonLogger = winstonLogger.child(options.meta) as WinstonLogger;
    }

    return new WinstonRootAuditorService(winstonLogger);
  }

  forPlugin(deps: {
    auth: AuthService;
    httpAuth: HttpAuthService;
    plugin: PluginMetadataService;
  }): AuditorService {
    return DefaultAuditorService.create(
      e => this.winstonLogger.info(`${e.plugin}.${e.eventId}`, e),
      deps,
    );
  }
}
