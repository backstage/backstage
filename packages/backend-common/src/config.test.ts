/*
 * Copyright 2023 The Backstage Authors
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

import { transports } from 'winston';
import { loadBackendConfig } from './config';
import { getRootLogger } from './logging';

describe('config', () => {
  describe('loadBackendConfig', () => {
    const env = process.env;
    afterEach(() => {
      jest.resetModules();
      process.env = env;
    });

    it('also hide secret config values coming from additional schemas', async () => {
      const additionalConfigs = [
        {
          context: 'test',
          data: {
            secretValue: 'shouldBeHidden',
          },
        },
      ];

      const additionalSchemas = {
        test: {
          type: 'object',
          properties: {
            secretValue: {
              type: 'string',
              visibility: 'secret',
            },
          },
        },
      };

      const logs: string[] = [];
      jest
        .spyOn(transports.Console.prototype, 'log')
        .mockImplementation((s: any, next: any) => {
          logs.push(s.message);
          if (next) {
            next();
          }
          return undefined;
        });

      process.env.LOG_LEVEL = 'info';
      const logger = getRootLogger();
      await loadBackendConfig({
        logger,
        argv: [],
        additionalConfigs,
        additionalSchemas,
      });
      logger.info('test');
      logger.info('shouldBeHidden');
      logger.end();
      await new Promise(resolve => {
        logger.on('finish', resolve);
      });

      expect(logs[0]).toMatch(
        /Found \d+ new secrets in config that will be redacted/,
      );
      expect(logs[1]).toEqual('test');
      expect(logs[2]).toEqual('[REDACTED]');
    }, 30000);
  });
});
