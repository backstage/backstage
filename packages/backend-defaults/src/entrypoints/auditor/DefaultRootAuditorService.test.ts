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

import { mockServices } from '@backstage/backend-test-utils';
import { format } from 'logform';
import Transport from 'winston-transport';
import { DefaultRootAuditorService } from './DefaultRootAuditorService';
import { WinstonRootAuditorServiceOptions } from './WinstonRootAuditorService';
import { MESSAGE } from '../rootLogger/formats';

describe('DefaultRootAuditorService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('writes JSON audit events with metadata, severity mappings, timestamps and error details', async () => {
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const auditor = DefaultRootAuditorService.create({
      meta: { deployment: 'test' },
    }).forPlugin({
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      plugin: { getId: () => 'catalog' },
      config: mockServices.rootConfig({
        data: {
          backend: { auditor: { severityLogLevelMappings: { high: 'warn' } } },
        },
      }),
    });
    await auditor.createEvent({ eventId: 'filtered', severityLevel: 'low' });
    const event = await auditor.createEvent({
      eventId: 'entity-%s-update',
      severityLevel: 'high',
      meta: { initial: true },
    });
    await event.success({ meta: { succeeded: true } });
    const error = new Error('update failed');
    await event.fail({ error, meta: { failed: true } });

    const records = stdout.mock.calls.map(([line]) => JSON.parse(String(line)));
    expect(records).toHaveLength(3);
    expect(records.map(record => record.status)).toEqual([
      'initiated',
      'succeeded',
      'failed',
    ]);
    for (const record of records) {
      expect(record).toMatchObject({
        service: 'backstage',
        deployment: 'test',
        plugin: 'catalog',
        eventId: 'entity-%s-update',
        level: 'warn',
        isAuditEvent: true,
        timestamp: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
        ),
      });
    }
    expect(records[1]).toMatchObject({
      meta: { initial: true, succeeded: true },
    });
    expect(records[2]).toMatchObject({
      message: 'catalog.entity-%s-update update failed',
      stack: error.stack,
      meta: { initial: true, failed: true },
    });
  });

  it('accepts Winston transport formats and custom logform formats, including filtering', async () => {
    const log = jest.fn((_info, next) => next());
    const options: WinstonRootAuditorServiceOptions = {
      format: format.combine(
        format(info => (info.status === 'initiated' ? false : info))(),
        format.label({ label: 'audit' }),
        format.json(),
      ),
      transports: [new Transport({ log, level: 'info' })],
    };
    expect(options.transports![0].level).toBe('info');
    const auditor = DefaultRootAuditorService.create(options).forPlugin({
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      plugin: { getId: () => 'catalog' },
      config: mockServices.rootConfig(),
    });
    const event = await auditor.createEvent({
      eventId: 'custom',
      severityLevel: 'medium',
    });
    await event.success();
    expect(log).toHaveBeenCalledTimes(1);
    expect(JSON.parse(log.mock.calls[0][0][MESSAGE])).toMatchObject({
      isAuditEvent: true,
      label: 'audit',
      status: 'succeeded',
      message: 'catalog.custom',
    });
  });
});
