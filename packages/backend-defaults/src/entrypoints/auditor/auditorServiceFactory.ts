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
import 'winston-daily-rotate-file';
import { defaultConsoleTransport } from '../../lib/defaultConsoleTransport';
import { createConfigSecretEnumerator } from '../rootConfig/createConfigSecretEnumerator';
import { Auditor, auditorFieldFormat, defaultProdFormat } from './Auditor';

const transports = {
  auditorConsole: (config?: Config) => {
    if (!config?.getOptionalBoolean('console.enabled')) {
      return [];
    }
    return [defaultConsoleTransport];
  },
  auditorFile: (config?: Config) => {
    if (!config?.getOptionalBoolean('rotateFile.enabled')) {
      return [];
    }
    return [
      new winston.transports.DailyRotateFile({
        format: defaultProdFormat,
        dirname:
          config?.getOptionalString('rotateFile.logFileDirPath') ??
          '/var/log/backstage/audit',
        filename:
          config?.getOptionalString('rotateFile.logFileName') ??
          'backstage-audit-%DATE%.log',
        datePattern: config?.getOptionalString('rotateFile.dateFormat'),
        frequency: config?.getOptionalString('rotateFile.frequency'),
        zippedArchive: config?.getOptionalBoolean('rotateFile.zippedArchive'),
        utc: config?.getOptionalBoolean('rotateFile.utc'),
        maxSize: config?.getOptionalString('rotateFile.maxSize'),
        maxFiles: config?.getOptional('rotateFile.maxFilesOrDays'),
      }),
    ];
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

    const auditor = Auditor.create({
      meta: {
        service: 'backstage',
      },
      format: winston.format.combine(
        auditorFieldFormat,
        process.env.NODE_ENV === 'production'
          ? defaultProdFormat
          : Auditor.colorFormat(),
      ),
      transports: [
        ...transports.auditorConsole(auditorConfig),
        ...transports.auditorFile(auditorConfig),
      ],
    });

    const secretEnumerator = await createConfigSecretEnumerator({
      auditor,
    });
    auditor.addRedactions(secretEnumerator(config));
    config.subscribe?.(() => auditor.addRedactions(secretEnumerator(config)));

    return auditor;
  },
  factory({ plugin, auth, httpAuth }, rootAuditor) {
    return rootAuditor.child(
      { plugin: plugin.getId() },
      { auth, httpAuth, plugin },
    );
  },
});
