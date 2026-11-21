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

import type { AuditSink } from '@backstage/backend-plugin-api';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { getSeverityLogLevelMappings } from './utils';
import { createWinstonAuditSink } from './winstonAuditSink';

/**
 * A non-singleton reference to audit sink services. Every registered sink
 * receives every audit event; a failing sink never blocks the others.
 *
 * @example
 * Adding a custom audit sink from a backend module.
 * ```ts
 * export const myAuditSinkModule = createBackendModule({
 *   pluginId: 'app',
 *   register(reg) {
 *     reg.registerService(
 *       createServiceFactory({
 *         service: auditSinksServiceRef,
 *         deps: {},
 *         async factory() {
 *           return {
 *             write: async event => {
 *               await persistEvent(event);
 *             },
 *           };
 *         },
 *       }),
 *     );
 *   },
 * });
 * ```
 *
 * @public
 */
export const auditSinksServiceRef = createServiceRef<AuditSink>({
  id: 'core.audit.sinks',
  scope: 'root',
  multiton: true,
});

/**
 * The default audit sink, writing events to the root logger with
 * `isAuditEvent` markers and severity-to-log-level mappings from
 * configuration.
 *
 * @public
 */
export const defaultAuditSinksServiceFactory = createServiceFactory({
  service: auditSinksServiceRef,
  deps: {
    config: coreServices.rootConfig,
    rootLogger: coreServices.rootLogger,
  },
  async factory({ config, rootLogger }) {
    return createWinstonAuditSink(
      rootLogger,
      getSeverityLogLevelMappings(config),
    );
  },
});
