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
import { LoggerService } from '@backstage/backend-plugin-api';
import { LogEntry, logLevel } from 'kafkajs';

export const loggerServiceAdapter = (loggerService: LoggerService) => {
  const logMethods: Record<logLevel, (message: string, meta?: object) => void> =
    {
      [logLevel.ERROR]: loggerService.error,
      [logLevel.WARN]: loggerService.warn,
      [logLevel.INFO]: loggerService.info,
      [logLevel.DEBUG]: loggerService.debug,
      [logLevel.NOTHING]: () => {},
    };

  return (_level: logLevel) => {
    return (entry: LogEntry) => {
      const { namespace, level, log } = entry;
      const { message, ...extra } = log;

      // Use loggerService method that matches the level
      logMethods[level].call(
        loggerService,
        `Kafka ${namespace} ${log.message}`,
        {
          ...extra,
        },
      );
    };
  };
};
