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
import { getSeverityLogLevelMappings } from './utils';

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

    const severityLogLevelMappings = getSeverityLogLevelMappings(config);

    return DefaultAuditorService.create(
      event => {
        if ('error' in event) {
          const { error, ...rest } = event;
          const childAuditLogger = auditLogger.child(rest);

          childAuditLogger[severityLogLevelMappings[event.severityLevel]](
            `${event.plugin}.${event.eventId}`,
            error,
          );
        } else {
          // the else statement is required for typechecking
          auditLogger[severityLogLevelMappings[event.severityLevel]](
            `${event.plugin}.${event.eventId}`,
            event,
          );
        }
      },
      { plugin, auth, httpAuth },
    );
  },
});
