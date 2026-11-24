/*
 * Copyright 2022 The Backstage Authors
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

import express from 'express';
import { createServer, IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { PassThrough } from 'node:stream';
import { mockServices } from '@backstage/backend-test-utils';
import request from 'supertest';
import { DefaultRootHttpRouter } from './DefaultRootHttpRouter';
import { BackendLifecycleImpl } from '../rootLifecycle/rootLifecycleServiceFactory';

describe('DefaultRootHttpRouter', () => {
  it('validates WebSocket registrations and leaves legacy upgrade listeners untouched', async () => {
    const server = createServer();
    const logger = mockServices.logger.mock();
    const lifecycle = new BackendLifecycleImpl(mockServices.rootLogger());
    const router = DefaultRootHttpRouter.create({ server, lifecycle, logger });
    const handler = jest.fn();
    expect(() =>
      DefaultRootHttpRouter.create().addWebSocketHandler({
        path: '/events',
        handler,
      }),
    ).toThrow('requires an HTTP server');
    expect(() => DefaultRootHttpRouter.create({ server })).toThrow(
      'requires a root lifecycle',
    );
    expect(server.listenerCount('upgrade')).toBe(0);
    for (const path of [
      '',
      'events',
      '//host/events',
      '/events?x=1',
      '/events#x',
      '/a/../events',
      '/a/\\events',
    ]) {
      expect(() =>
        router.addWebSocketHandler({ path: path, handler: handler }),
      ).toThrow('absolute pathname');
    }
    expect(server.listenerCount('upgrade')).toBe(0);
    const legacy = jest.fn();
    server.on('upgrade', legacy);
    router.addWebSocketHandler({ path: '/events', handler });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(server.listeners('upgrade')).toContain(legacy);
    expect(server.listenerCount('upgrade')).toBe(2);
    server.off('upgrade', legacy);
    router.addWebSocketHandler({ path: '/other', handler: handler });
    expect(server.listenerCount('upgrade')).toBe(1);
    expect(() =>
      router.addWebSocketHandler({ path: '/events', handler: handler }),
    ).toThrow('already registered');
    await lifecycle.shutdown();
    expect(() =>
      router.addWebSocketHandler({ path: '/new', handler: handler }),
    ).toThrow('after shutdown');
  });

  it('leaves unmatched upgrades to late listeners and only tracks its own sockets', async () => {
    const server = createServer();
    const logger = mockServices.logger.mock();
    const lifecycle = new BackendLifecycleImpl(mockServices.rootLogger());
    const router = DefaultRootHttpRouter.create({ server, lifecycle, logger });
    const handler = jest.fn();
    router.addWebSocketHandler({ path: '/events', handler });
    expect(logger.warn).not.toHaveBeenCalled();
    const legacy = jest.fn();
    server.on('upgrade', legacy);
    const head = Buffer.from('buffered');
    const sockets = ['/legacy', '/events'].map(path => {
      const socket = new PassThrough();
      const req = new IncomingMessage(new Socket());
      req.url = path;
      req.headers.upgrade = 'websocket';
      server.emit('upgrade', req, socket, head);
      return socket;
    });
    await Promise.resolve();
    expect(legacy).toHaveBeenCalledTimes(2);
    expect(legacy.mock.calls[0][1]).toBe(sockets[0]);
    expect(legacy.mock.calls[0][2]).toBe(head);
    expect(sockets[0].read()).toBeNull();
    expect(sockets[0].listenerCount('error')).toBe(0);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ socket: sockets[1], head }),
    );
    expect(logger.warn).toHaveBeenCalledTimes(1);
    server.off('upgrade', legacy);
    const req = new IncomingMessage(new Socket());
    req.url = '/legacy';
    req.headers.upgrade = 'websocket';
    const rejected = new PassThrough();
    const end = jest.spyOn(rejected, 'end');
    server.emit('upgrade', req, rejected, Buffer.alloc(0));
    expect(end).toHaveBeenCalledWith(
      expect.stringContaining('404 Not Found'),
      expect.any(Function),
    );
    await lifecycle.shutdown();
    expect(sockets.map(socket => socket.destroyed)).toEqual([false, true]);
    sockets[0].destroy();
    rejected.destroy();
  });

  it('closes failed upgrades and destroys active sockets at shutdown', async () => {
    const server = createServer();
    const logger = mockServices.logger.mock();
    const lifecycle = new BackendLifecycleImpl(mockServices.rootLogger());
    const router = DefaultRootHttpRouter.create({ server, lifecycle, logger });
    router.addWebSocketHandler({
      path: '/throws',
      handler: () => {
        throw new Error('sync failure');
      },
    });
    router.addWebSocketHandler({
      path: '/rejects',
      handler: async () => {
        throw new Error('async failure');
      },
    });
    router.addWebSocketHandler({ path: '/active', handler: () => {} });
    const sockets = ['/throws', '/rejects', '/active'].map(path => {
      const socket = new PassThrough();
      const req = new IncomingMessage(new Socket());
      req.url = path;
      req.headers.upgrade = 'websocket';
      server.emit('upgrade', req, socket, Buffer.alloc(0));
      return socket;
    });
    await new Promise(resolve => setImmediate(resolve));
    expect(sockets.map(socket => socket.destroyed)).toEqual([
      true,
      true,
      false,
    ]);
    expect(logger.warn).toHaveBeenCalledTimes(2);
    const dropped = new PassThrough();
    const req = new IncomingMessage(new Socket());
    req.url = '/active';
    req.headers.upgrade = 'websocket';
    server.emit('upgrade', req, dropped, Buffer.alloc(0));
    await new Promise(resolve => setImmediate(resolve));
    dropped.emit('error', new Error('ECONNRESET'));
    expect(dropped.destroyed).toBe(true);
    expect(logger.warn).toHaveBeenCalledTimes(2);
    await lifecycle.shutdown();
    expect(sockets.every(socket => socket.destroyed)).toBe(true);
  });

  it.each([
    [['/b'], '/a'],
    [['/a'], '/aa/b'],
    [['/aa'], '/a/b'],
    [['/a/b'], '/aa'],
    [['/b/a'], '/a'],
    [['/a'], '/aa'],
  ])(`with existing paths %s, adds %s without conflict`, (existing, added) => {
    const router = DefaultRootHttpRouter.create();
    for (const path of existing) {
      router.use(path, () => {});
    }
    expect(() => router.use(added, () => {})).not.toThrow();
  });

  it.each([
    [['/a'], '/a', '/a'],
    [['/a'], '/a/b', '/a'],
    [['/a/b'], '/a', '/a/b'],
    [['/api/Catalog'], '/api/catalog', '/api/Catalog'],
  ])(
    `find conflict when existing paths %s, adds %s`,
    (existing, added, conflict) => {
      const router = DefaultRootHttpRouter.create();
      for (const path of existing) {
        router.use(path, () => {});
      }
      expect(() => router.use(added, () => {})).toThrow(
        `Path ${added} conflicts with the existing path ${conflict}`,
      );
    },
  );

  it('should not be possible to supply an empty indexPath', () => {
    expect(() => DefaultRootHttpRouter.create({ indexPath: '' })).toThrow(
      'indexPath option may not be an empty string',
    );
  });

  it('will always prioritize non-index paths', async () => {
    const router = DefaultRootHttpRouter.create({ indexPath: '/x' });
    const app = express();
    app.use(router.handler());

    const routerX = express.Router();
    routerX.get('/a', (_req, res) => res.status(201).end());

    const routerY = express.Router();
    routerY.get('/a', (_req, res) => res.status(202).end());

    await request(app).get('/').expect(404);
    await request(app).get('/a').expect(404);
    await request(app).get('/x/a').expect(404);
    await request(app).get('/y/a').expect(404);

    router.use('/x', routerX);

    await request(app).get('/').expect(404);
    await request(app).get('/a').expect(201);
    await request(app).get('/x/a').expect(201);
    await request(app).get('/y/a').expect(404);

    router.use('/y', routerY);

    await request(app).get('/').expect(404);
    await request(app).get('/a').expect(201);
    await request(app).get('/x/a').expect(201);
    await request(app).get('/y/a').expect(202);

    expect('test').toBe('test');
  });

  it('should treat unknown /api/ routes as 404', async () => {
    const router = DefaultRootHttpRouter.create();
    const app = express();
    app.use(router.handler());

    router.use('/api/app', (_req, res) => res.status(201).end());
    router.use('/api/catalog', (_req, res) => res.status(202).end());

    await request(app).get('/').expect(201);
    await request(app).get('/api/catalog').expect(202);
    await request(app).get('/unknown').expect(201);
    await request(app).get('/api/unknown').expect(404);

    expect('test').toBe('test');
  });

  it('should treat unknown /api/ routes as 404 without an index path', async () => {
    const router = DefaultRootHttpRouter.create({ indexPath: false });
    const app = express();
    app.use(router.handler());

    router.use('/api/app', (_req, res) => res.status(201).end());
    router.use('/api/catalog', (_req, res) => res.status(202).end());

    await request(app).get('/').expect(404);
    await request(app).get('/api/catalog').expect(202);
    await request(app).get('/unknown').expect(404);
    await request(app).get('/api/unknown').expect(404);

    expect('test').toBe('test');
  });
});
