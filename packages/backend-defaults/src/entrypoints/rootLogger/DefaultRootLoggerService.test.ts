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

import { once } from 'node:events';
import { PassThrough, Writable } from 'node:stream';
import { stripVTControlCharacters } from 'node:util';
import { format } from 'logform';
import { createLogger, transports } from 'winston';
import Transport from 'winston-transport';
import { DefaultRootLoggerService } from './DefaultRootLoggerService';
import { WinstonLogger, WinstonLoggerOptions } from './WinstonLogger';
import { LoggerInfo } from './types';
import { LEVEL, MESSAGE } from './formats';

describe('DefaultRootLoggerService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('uses the same class for the deprecated alias and compatible format helpers', () => {
    expect(WinstonLogger).toBe(DefaultRootLoggerService);
    expect(WinstonLogger.create({})).toBeInstanceOf(DefaultRootLoggerService);

    const redacter = DefaultRootLoggerService.redacter();
    redacter.add(['secret']);
    const formatter = format.combine(
      DefaultRootLoggerService.logLevelFilter('info').format,
      DefaultRootLoggerService.colorFormat(),
      redacter.format,
    );
    const result = formatter.transform(
      {
        level: 'info',
        message: 'a secret',
        service: 'backstage',
      },
      formatter.options,
    ) as LoggerInfo;
    expect(stripVTControlCharacters(String(result[MESSAGE]))).toMatch(
      /backstage info a \*\*\* /,
    );
  });

  it('writes native timestamped JSON, with environment level precedence and safe metadata', () => {
    jest.replaceProperty(process, 'env', {
      ...process.env,
      NODE_ENV: 'production',
      LOG_LEVEL: 'warn',
    });
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const shared = { value: 1 };
    const circular: any = { value: BigInt(42), shared };
    circular.self = circular;
    const logger = DefaultRootLoggerService.create({ level: 'debug' });
    logger.info('filtered');
    logger.warn('kept', { circular, shared });

    expect(stdout).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(stdout.mock.calls[0][0]))).toEqual({
      level: 'warn',
      message: 'kept',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      circular: { value: '42', shared, self: '[Circular]' },
      shared,
    });
    expect(String(stdout.mock.calls[0][0])).toMatch(/\n$/);
    expect(circular.self).toBe(circular);
  });

  it('shares live filters and redactions across nested children without changing metadata', () => {
    jest.replaceProperty(process, 'env', { NODE_ENV: 'production' });
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const rootMeta = { service: 'backstage', plugin: 'root', source: 'root' };
    const callMeta = { source: 'call', nested: { value: 'a secret' } };
    const logger = DefaultRootLoggerService.create({
      meta: rootMeta,
      level: 'warn',
    });
    const child = logger
      .child({ plugin: 'catalog', source: 'child' })
      .child({ nestedChild: true });
    child.info('filtered');
    logger.setLevelOverrides([
      { matchers: { plugin: 'catalog' }, level: 'debug' },
    ]);
    logger.addRedactions(['  secret  ', '', 'x']);
    child.debug('secret', callMeta);
    logger.setLevelOverrides([]);
    child.debug('filtered again');
    logger.addRedactions(['another']);
    child.error('another secret', new Error('secret failure'));

    expect(stdout).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(stdout.mock.calls[0][0]))).toMatchObject({
      service: 'backstage',
      plugin: 'catalog',
      source: 'call',
      nestedChild: true,
      level: 'debug',
      message: '***',
      nested: { value: 'a ***' },
    });
    expect(JSON.parse(String(stdout.mock.calls[1][0]))).toMatchObject({
      level: 'error',
      message: '*** *** *** failure',
      stack: expect.stringContaining('*** failure'),
    });
    expect(rootMeta.plugin).toBe('root');
    expect(callMeta.nested.value).toBe('a secret');
  });

  it('preserves Winston metadata, error and custom format filtering behavior', () => {
    const nativeEntries: LoggerInfo[] = [];
    const winstonEntries: LoggerInfo[] = [];
    const formatter = () =>
      format.combine(
        format(info => (info.message === 'filtered' ? false : info))(),
        format.json(),
      );
    const makeTransport = (entries: LoggerInfo[]) =>
      new Transport({
        log(info, next) {
          entries.push({ ...info });
          next();
        },
      });
    const native = DefaultRootLoggerService.create({
      meta: { service: 'backstage' },
      format: formatter(),
      transports: [makeTransport(nativeEntries)],
    }).child({ plugin: 'catalog' });
    const winston = createLogger({
      format: formatter(),
      transports: [makeTransport(winstonEntries)],
    })
      .child({ service: 'backstage' })
      .child({ plugin: 'catalog' });
    const error = new Error('failure', { cause: 'reason' });
    for (const logger of [native, winston]) {
      logger.info('filtered');
      logger.info('metadata', { field: 42, message: 'suffix' });
      logger.error('failed', error);
    }
    expect(nativeEntries).toHaveLength(2);
    expect(
      nativeEntries.map(info => JSON.parse(String(info[MESSAGE]))),
    ).toEqual(winstonEntries.map(info => JSON.parse(String(info[MESSAGE]))));
  });

  it('keeps placeholders literal and includes metadata with custom splat formats', () => {
    const entries: LoggerInfo[] = [];
    const logger = DefaultRootLoggerService.create({
      format: format.combine(format.splat(), format.json()),
      transports: [
        new Transport({
          log(info, next) {
            entries.push(info);
            next();
          },
        }),
      ],
    });
    const error = new Error('failure', { cause: 'reason' });
    logger.info('value: %s', { field: 42 });
    logger.warn('progress: %d%%', { progress: 50 });
    logger.error('failed: %s', error);

    expect(entries.map(info => JSON.parse(String(info[MESSAGE])))).toEqual([
      { level: 'info', message: 'value: %s', field: 42 },
      { level: 'warn', message: 'progress: %d%%', progress: 50 },
      {
        level: 'error',
        message: 'failed: %s failure',
        stack: error.stack,
        cause: 'reason',
      },
    ]);
    expect(entries.every(info => !(Symbol.for('splat') in info))).toBe(true);
  });

  it('supports transport levels, transport formats, silent transports and built-in Winston transports', () => {
    const entries: LoggerInfo[] = [];
    const capture = new Writable({
      objectMode: true,
      write(info, _encoding, next) {
        entries.push(info);
        next();
      },
    });
    const ignored = jest.fn();
    const options: WinstonLoggerOptions = {
      level: 'debug',
      transports: [
        new Transport({ silent: true, log: ignored }),
        new transports.Stream({
          stream: capture,
          level: 'warn',
          format: format.combine(
            format.label({ label: 'custom' }),
            format.json(),
          ),
        }),
      ],
    };
    const transport = options.transports![1];
    const log = transport.log!.bind(transport);
    transport.log = (info, next) => {
      const message: string = info.message;
      expect(message).toBe('kept');
      return log(info, next);
    };
    const logger = DefaultRootLoggerService.create(options);
    logger.info('filtered by transport');
    logger.error('kept');
    expect(ignored).not.toHaveBeenCalled();
    expect(entries).toHaveLength(1);
    expect(entries[0][LEVEL]).toBe('error');
    expect(JSON.parse(String(entries[0][MESSAGE]))).toMatchObject({
      label: 'custom',
      message: 'kept',
    });
  });

  it('buffers slow transports in order and drains them when their parent ends', async () => {
    const entries: string[] = [];
    const slow = new Transport({
      highWaterMark: 1,
      log(info, next) {
        setImmediate(() => {
          entries.push(String(info.message));
          next();
        });
      },
    } as ConstructorParameters<typeof Transport>[0]);
    let parent: PassThrough | undefined;
    slow.once('pipe', source => {
      parent = source as PassThrough;
    });
    const logger = DefaultRootLoggerService.create({ transports: [slow] });
    for (let i = 0; i < 50; i++) {
      logger.info(`message ${i}`);
    }
    const finished = once(slow, 'finish');
    parent!.end();
    await finished;
    expect(entries).toEqual(
      Array.from({ length: 50 }, (_, i) => `message ${i}`),
    );
  });

  it('leaves handled transport errors with the transport and keeps other transports working', async () => {
    const failure = new Error('output unavailable');
    const broken = new Writable({
      objectMode: true,
      write(_info, _encoding, next) {
        next(failure);
      },
    });
    const failed = once(broken, 'error');
    const log = jest.fn((_info, next) => next());
    const healthy = new Transport({ log });
    let parent: PassThrough | undefined;
    healthy.once('pipe', source => {
      parent = source as PassThrough;
    });
    const logger = DefaultRootLoggerService.create({
      transports: [broken, healthy],
    });
    logger.info('first');
    expect(await failed).toEqual([failure]);
    logger.info('second');
    const finished = once(healthy, 'finish');
    parent!.end();
    await finished;
    expect(log).toHaveBeenCalledTimes(2);
  });

  it('honors custom format options, falsey filtering, and explicitly disabled output', () => {
    const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    DefaultRootLoggerService.create({ transports: [] }).info('disabled');
    expect(() =>
      DefaultRootLoggerService.create({ transports: [new Writable()] }),
    ).toThrow('Logger transports must be writable streams in object mode');
    const log = jest.fn((_info, next) => next());
    const formatter = format((info, options) => {
      if (info.message === 'discard') return false;
      return Object.assign({}, info, options);
    })({ label: 'custom' });
    const logger = DefaultRootLoggerService.create({
      format: formatter,
      transports: [new Transport({ log })],
    });
    logger.info('discard');
    logger.info('kept');
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatchObject({
      label: 'custom',
      message: 'kept',
    });
    expect(stdout).not.toHaveBeenCalled();
  });
});
