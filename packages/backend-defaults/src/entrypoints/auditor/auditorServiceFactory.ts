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
import { auditSinksServiceRef } from './auditSinks';
import { DefaultAuditorService } from './DefaultAuditorService';
import { createFanOutAuditSink } from './pipeline';
import {
  getAuditorSampling,
  getMaxMetaStringLength,
  getRedactMetaKeys,
  getSanitizeRequestQuery,
} from './utils';

/**
 * Plugin-level auditing.
 *
 * Events are written to every audit sink registered through
 * {@link auditSinksServiceRef}, fanned out in parallel with per-sink failure
 * isolation.
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
    sinks: auditSinksServiceRef,
  },
  async factory({ config, logger, plugin, auth, httpAuth, sinks }) {
    const onError = (error: Error) => {
      logger.error(`Failed to emit audit event, ${error}`);
    };

    return DefaultAuditorService.create(createFanOutAuditSink(sinks, onError), {
      plugin,
      auth,
      httpAuth,
      onError,
      sanitizeRequestQuery: getSanitizeRequestQuery(config),
      maxMetaStringLength: getMaxMetaStringLength(config),
      redactMetaKeys: getRedactMetaKeys(config),
      sampling: getAuditorSampling(config),
    });
  },
});
