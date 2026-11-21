/*
 * Copyright 2026 The Backstage Authors
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
import { Config } from '@backstage/config';
import type { JsonObject } from '@backstage/types';
import {
  DefaultRootLoggerService,
  LoggerFormat,
  LoggerTransport,
} from '@backstage/backend-defaults/rootLogger';
import { MESSAGE, stringifyLogValue } from '../rootLogger/formats';
import { DefaultAuditorService } from './DefaultAuditorService';
import { getSeverityLogLevelMappings } from './utils';

/** @public */
export const defaultFormatter: LoggerFormat = {
  transform(info) {
    const date = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');
    info.timestamp ??= `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds(),
    )}`;
    info[MESSAGE] = stringifyLogValue(info);
    return info;
  },
};

/**
 * Adds the `isAuditEvent` field to a log entry.
 *
 * @public
 */
export const auditorFieldFormat: LoggerFormat = {
  transform(info) {
    return { ...info, isAuditEvent: true };
  },
};

/**
 * Options for creating a {@link DefaultRootAuditorService}.
 * @public
 */
export type DefaultRootAuditorServiceOptions = {
  meta?: JsonObject;
  format?: LoggerFormat;
  transports?: LoggerTransport[];
};

/**
 * An implementation of the {@link @backstage/backend-plugin-api#AuditorService} that logs events using a separate logger.
 *
 * @public
 *
 * @example
 * ```ts
 * export const auditorServiceFactory = createServiceFactory({
 *   service: coreServices.auditor,
 *   deps: {
 *     auth: coreServices.auth,
 *     config: coreServices.rootConfig,
 *     httpAuth: coreServices.httpAuth,
 *     plugin: coreServices.pluginMetadata,
 *   },
 *   createRootContext() {
 *     return DefaultRootAuditorService.create();
 *   },
 *   factory(deps, root) {
 *     return root.forPlugin(deps);
 *   },
 * });
 * ```
 */
export class DefaultRootAuditorService {
  private readonly logger: DefaultRootLoggerService;

  private constructor(logger: DefaultRootLoggerService) {
    this.logger = logger;
  }

  /**
   * Creates a {@link DefaultRootAuditorService} instance.
   */
  static create(
    options?: DefaultRootAuditorServiceOptions,
  ): DefaultRootAuditorService {
    const logger = DefaultRootLoggerService.create({
      meta: {
        service: 'backstage',
        ...options?.meta,
      },
      level: 'info',
      format: {
        transform(info) {
          const formatter = options?.format ?? defaultFormatter;
          return formatter.transform(
            { ...info, isAuditEvent: true },
            formatter.options,
          );
        },
      },
      transports: options?.transports,
    });

    return new DefaultRootAuditorService(logger);
  }

  forPlugin(deps: {
    auth: AuthService;
    config: Config;
    httpAuth: HttpAuthService;
    plugin: PluginMetadataService;
  }): AuditorService {
    const severityLogLevelMappings = getSeverityLogLevelMappings(deps.config);

    return DefaultAuditorService.create(event => {
      if ('error' in event) {
        const { error, ...rest } = event;
        const childAuditLogger = this.logger.child(rest);

        childAuditLogger[severityLogLevelMappings[event.severityLevel]](
          `${event.plugin}.${event.eventId}`,
          error,
        );
      } else {
        // the else statement is required for typechecking
        this.logger[severityLogLevelMappings[event.severityLevel]](
          `${event.plugin}.${event.eventId}`,
          event,
        );
      }
    }, deps);
  }
}
