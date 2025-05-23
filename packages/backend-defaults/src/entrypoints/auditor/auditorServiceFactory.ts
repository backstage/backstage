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
import { DefaultAuditorService } from './DefaultAuditorService';
import { z } from 'zod';
import { InputError } from '@backstage/errors';

const CONFIG_ROOT_KEY = 'backend.auditor';

const severityLogLevelMappingsSchema = z.record(
  z.enum(['low', 'medium', 'high', 'critical']),
  z.enum(['debug', 'info', 'warn', 'error']),
);

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
    logger: coreServices.logger,
    auth: coreServices.auth,
    httpAuth: coreServices.httpAuth,
    plugin: coreServices.pluginMetadata,
  },
  factory({ config, logger, plugin, auth, httpAuth }) {
    const auditLogger = logger.child({ isAuditEvent: true });
    const auditorConfig = config.getOptionalConfig(CONFIG_ROOT_KEY);

    const severityLogLevelMappings = {
      low:
        auditorConfig?.getOptionalString('severityLogLevelMappings.low') ??
        'debug',
      medium:
        auditorConfig?.getOptionalString('severityLogLevelMappings.medium') ??
        'info',
      high:
        auditorConfig?.getOptionalString('severityLogLevelMappings.high') ??
        'info',
      critical:
        auditorConfig?.getOptionalString('severityLogLevelMappings.critical') ??
        'info',
    } as Required<z.infer<typeof severityLogLevelMappingsSchema>>;

    const res = severityLogLevelMappingsSchema.safeParse(
      severityLogLevelMappings,
    );
    if (!res.success) {
      const key = res.error.issues.at(0)?.path.at(0) as string;
      const value = (
        res.error.issues.at(0) as unknown as Record<PropertyKey, unknown>
      ).received as string;
      const validKeys = (
        res.error.issues.at(0) as unknown as Record<PropertyKey, unknown>
      ).options as string[];
      throw new InputError(
        `The configuration value for 'backend.auditor.severityLogLevelMappings.${key}' was given an invalid value: '${value}'. Expected one of the following valid values: '${validKeys.join(
          ', ',
        )}'.`,
      );
    }

    return DefaultAuditorService.create(
      event => {
        auditLogger[severityLogLevelMappings[event.severityLevel]](
          `${event.plugin}.${event.eventId}`,
          event,
        );
      },
      { plugin, auth, httpAuth },
    );
  },
});
