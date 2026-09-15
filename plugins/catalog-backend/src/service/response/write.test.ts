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

import express from 'express';
import { EventEmitter } from 'node:events';
import { setImmediate } from 'node:timers/promises';
import { mockErrorHandler } from '@backstage/backend-test-utils';
import request from 'supertest';
import { writeEntitiesResponse, writeSingleEntityResponse } from './write';
import { processRawEntitiesResult } from './process';
import { parseEntityTransformParams } from '../request/parseEntityTransformParams';
import { createEntityArrayJsonStream } from './createEntityArrayJsonStream';

describe('projected responses', () => {
  const app = express();
  app.use(express.json());
  app.post('/:mode', async (req, res, next) => {
    try {
      // Model the database rows used by production callers, not arbitrary HTTP input.
      const serializedEntities: unknown = req.body;
      if (
        !Array.isArray(serializedEntities) ||
        !serializedEntities.every(
          entity => entity === null || typeof entity === 'string',
        )
      ) {
        throw new Error('Expected an array of serialized entities or nulls');
      }
      const items = await processRawEntitiesResult(
        serializedEntities,
        parseEntityTransformParams({
          fields: [
            'metadata.name',
            'metadata.annotations.example.com/key',
            'relations',
          ],
        }),
      );
      if (req.params.mode === 'stream') {
        const stream = createEntityArrayJsonStream(res);
        // /entities streams multiple database pages, including a final empty page.
        const pages =
          items.type === 'raw-batches'
            ? [
                { ...items, batches: items.batches.slice(0, 1) },
                { ...items, batches: items.batches.slice(1) },
              ]
            : [items];
        for (const page of pages) {
          // Like the router, do not start a stream for an empty database page.
          const hasItems =
            page.type === 'raw-batches'
              ? page.batches.length > 0
              : page.entities.length > 0;
          if (hasItems) await stream.send(page);
        }
        stream.complete();
      } else {
        await writeEntitiesResponse({
          res,
          items,
          responseWrapper: entities => ({
            items: entities,
            totalItems: 42,
            pageInfo: { prevCursor: 'previous', nextCursor: 'next' },
          }),
        });
      }
    } catch (error) {
      next(error);
    }
  });
  app.use(mockErrorHandler());

  it.each(['wrapped', 'stream'])(
    'preserves empty, single, and multi-batch %s responses',
    async mode => {
      for (const count of [0, 1, 100, 101, 202]) {
        const input = Array.from({ length: count }, (_, i) =>
          i === 99 || i === 100
            ? null
            : JSON.stringify({
                kind: 'Component',
                metadata: { name: `entity-${i}` },
                spec: { omitted: true },
              }),
        );
        const response = await request(app).post(`/${mode}`).send(input);
        const expected = Array.from({ length: count }, (_, i) =>
          i === 99 || i === 100 ? null : { metadata: { name: `entity-${i}` } },
        );
        expect(response.status).toBe(200);
        expect(mode === 'stream' ? response.body : response.body.items).toEqual(
          expected,
        );
      }
    },
  );

  it.each(['wrapped', 'stream'])(
    'preserves projected JSON in %s responses',
    async mode => {
      const response = await request(app)
        .post(`/${mode}`)
        .send([
          JSON.stringify({
            kind: 'Component',
            metadata: {
              name: 'quoted-"-☃',
              annotations: {
                'example.com/key': 'line\n\\value',
                omitted: 'hidden',
              },
            },
            spec: { description: 'not selected' },
            relations: [{ type: 'ownedBy', targetRef: 'group:default/team' }],
          }),
          null,
          '{"kind":"User","metadata":{"name":"last"}}',
        ]);
      const entities = [
        {
          metadata: {
            name: 'quoted-"-☃',
            annotations: { 'example.com/key': 'line\n\\value' },
          },
          relations: [{ type: 'ownedBy', targetRef: 'group:default/team' }],
        },
        null,
        { metadata: { name: 'last' } },
      ];
      expect(response.status).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.header['content-length']).toBeUndefined();
      expect(response.body).toEqual(
        mode === 'stream'
          ? entities
          : {
              items: entities,
              totalItems: 42,
              pageInfo: { prevCursor: 'previous', nextCursor: 'next' },
            },
      );
    },
  );

  it.each(['wrapped', 'stream'])(
    'rejects projection errors before writing a %s response',
    async mode => {
      const response = await request(app)
        .post(`/${mode}`)
        .send([
          '{"kind":"Component","metadata":{"name":"first"}}',
          'invalid JSON',
        ]);
      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: { name: 'SyntaxError' } });
      expect(response.body.items).toBeUndefined();
    },
  );
});

describe('serialized batches', () => {
  it.each([
    { batches: [], status: 404, name: 'no batches' },
    {
      batches: ['[null,{"kind":"User"}]'],
      status: 404,
      name: 'first entity missing',
    },
    {
      batches: ['[{"kind":"Component"},null]', '[{"kind":"User"}]'],
      status: 200,
      name: 'first entity present',
    },
  ])('writes a single entity with $name', async ({ batches, status }) => {
    const app = express();
    app.get('/', (_req, res) => {
      writeSingleEntityResponse(
        res,
        { type: 'raw-batches', batches },
        'not found',
      );
    });
    app.use(mockErrorHandler());
    const response = await request(app).get('/');
    expect(response.status).toBe(status);
    expect(response.body).toMatchObject(
      status === 200
        ? { kind: 'Component' }
        : { error: { name: 'NotFoundError' } },
    );
  });

  it.each(['wrapped', 'stream'])(
    'honors backpressure and disconnects between %s batches',
    async mode => {
      const writes: string[] = [];
      let ended = false;
      const res = Object.assign(new EventEmitter(), {
        closed: false,
        setHeader() {},
        status() {},
        flushHeaders() {},
        write(data: string) {
          writes.push(data);
          return false;
        },
        end() {
          ended = true;
        },
      });
      const response = res as unknown as express.Response;
      const items = {
        type: 'raw-batches' as const,
        batches: [
          '[{"kind":"Component"},null]',
          '[{"kind":"User"}]',
          '[{"kind":"Resource"}]',
        ],
      };
      const pending =
        mode === 'stream'
          ? createEntityArrayJsonStream(response).send(items)
          : writeEntitiesResponse({ res: response, items });
      await setImmediate();
      expect(writes).toEqual(['[{"kind":"Component"},null']);
      res.emit('drain');
      await setImmediate();
      expect(writes).toEqual([
        '[{"kind":"Component"},null',
        ',{"kind":"User"}',
      ]);
      res.closed = true;
      res.emit('close');
      await pending;
      expect(writes).toHaveLength(2);
      expect(ended).toBe(false);
    },
  );
});

describe('writeSingleEntityResponse', () => {
  const app = express();
  app.use(express.json());
  app.get('/echo', (req, res) => {
    writeSingleEntityResponse(res, req.body, 'not found');
  });
  app.use(mockErrorHandler());

  describe('in object form', () => {
    it('should write a single entity', async () => {
      const res = await request(app)
        .get('/echo')
        .send({
          type: 'object',
          entities: [{ kind: 'Component' }, { kind: 'User' }],
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.body).toEqual({ kind: 'Component' });
    });

    it('should write a missing entity', async () => {
      const res = await request(app)
        .get('/echo')
        .send({ type: 'object', entities: [null] });

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.body).toMatchObject({
        error: { name: 'NotFoundError', message: 'not found' },
      });
    });

    it('should write no entities', async () => {
      const res = await request(app)
        .get('/echo')
        .send({ type: 'object', entities: [] });

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.body).toMatchObject({
        error: { name: 'NotFoundError', message: 'not found' },
      });
    });
  });

  describe('in raw form', () => {
    it('should write a single entity', async () => {
      const res = await request(app)
        .get('/echo')
        .send({
          type: 'raw',
          entities: ['{"kind":"Component"}', '{"kind":"User"}'],
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.body).toEqual({ kind: 'Component' });
    });

    it('should write a missing entity', async () => {
      const res = await request(app)
        .get('/echo')
        .send({ type: 'raw', entities: [null] });

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.body).toMatchObject({
        error: { name: 'NotFoundError', message: 'not found' },
      });
    });

    it('should write no entities', async () => {
      const res = await request(app)
        .get('/echo')
        .send({ type: 'raw', entities: [] });

      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.body).toMatchObject({
        error: { name: 'NotFoundError', message: 'not found' },
      });
    });
  });
});

describe('writeEntitiesResponse', () => {
  const app = express();
  app.use(express.json());
  app.get('/echo', (req, res) => {
    writeEntitiesResponse({
      res,
      items: req.body,
    });
  });
  app.get('/wrapped', (req, res) => {
    writeEntitiesResponse({
      res,
      items: req.body,
      responseWrapper: entities => ({
        page: 1,
        items: entities,
        totalItems: 1337,
      }),
    });
  });
  app.use(mockErrorHandler());

  describe('in object form', () => {
    it('should return empty list', async () => {
      const res = await request(app).get('/echo').send({
        type: 'object',
        entities: [],
      });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).toBeDefined();
      expect(res.body).toEqual([]);
    });

    it('should return mixed objects', async () => {
      const res = await request(app)
        .get('/echo')
        .send({
          type: 'object',
          entities: [{ kind: 'Component' }, null, { kind: 'User' }, null],
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).toBeDefined();
      expect(res.body).toEqual([
        { kind: 'Component' },
        null,
        { kind: 'User' },
        null,
      ]);
    });

    it('should wrap response of empty list', async () => {
      const res = await request(app)
        .get('/wrapped')
        .send({ type: 'object', entities: [] });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).toBeDefined();
      expect(res.body).toEqual({ page: 1, items: [], totalItems: 1337 });
    });

    it('should wrap response of mixed list', async () => {
      const res = await request(app)
        .get('/wrapped')
        .send({
          type: 'object',
          entities: [{ kind: 'Component' }, null, { kind: 'User' }, null],
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).toBeDefined();
      expect(res.body).toEqual({
        page: 1,
        items: [{ kind: 'Component' }, null, { kind: 'User' }, null],
        totalItems: 1337,
      });
    });
  });

  describe('in raw form', () => {
    it('should return empty list', async () => {
      const res = await request(app).get('/echo').send({
        type: 'raw',
        entities: [],
      });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).toBeDefined();
      expect(res.body).toEqual([]);
    });

    it('should return mixed objects', async () => {
      const res = await request(app)
        .get('/echo')
        .send({
          type: 'raw',
          entities: ['{"kind":"Component"}', null, '{"kind":"User"}', null],
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).not.toBeDefined();
      expect(res.body).toEqual([
        { kind: 'Component' },
        null,
        { kind: 'User' },
        null,
      ]);
    });

    it('should wrap response of empty list', async () => {
      const res = await request(app)
        .get('/wrapped')
        .send({ type: 'raw', entities: [] });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).not.toBeDefined();
      expect(res.body).toEqual({ page: 1, items: [], totalItems: 1337 });
    });

    it('should wrap response of mixed list', async () => {
      const res = await request(app)
        .get('/wrapped')
        .send({
          type: 'raw',
          entities: ['{"kind":"Component"}', null, '{"kind":"User"}', null],
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).not.toBeDefined();
      expect(res.body).toEqual({
        page: 1,
        items: [{ kind: 'Component' }, null, { kind: 'User' }, null],
        totalItems: 1337,
      });
    });

    it('should write a large wrapped response', async () => {
      const entityMock = JSON.stringify({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          namespace: 'default',
          annotations: {
            'backstage.io/managed-by-location': 'url:https://example.com',
          },
        },
        spec: {
          type: 'service',
          owner: 'me',
          lifecycle: 'production',
        },
      });
      const res = await request(app)
        .get('/wrapped')
        .send({
          type: 'raw',
          entities: Array(300).fill(entityMock),
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).not.toBeDefined();
      expect(res.body).toEqual({
        page: 1,
        items: expect.any(Array),
        totalItems: 1337,
      });
      expect(res.body.items).toHaveLength(300);
    });
  });
});
