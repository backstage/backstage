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
import { mockErrorHandler } from '@backstage/backend-test-utils';
import request from 'supertest';
import { writeEntitiesResponse, writeSingleEntityResponse } from './write';

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
      alwaysUseObjectMode: Boolean(req.query.object),
    });
  });
  app.get('/wrapped', (req, res) => {
    writeEntitiesResponse({
      res,
      items: req.body,
      alwaysUseObjectMode: Boolean(req.query.object),
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
        items: expect.objectContaining({ length: 300 }),
        totalItems: 1337,
      });
    });
  });

  describe('in raw form forced to object', () => {
    it('should return empty list', async () => {
      const res = await request(app).get('/echo?object=true').send({
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
        .get('/echo?object=true')
        .send({
          type: 'raw',
          entities: ['{"kind":"Component"}', null, '{"kind":"User"}', null],
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
        .get('/wrapped?object=true')
        .send({ type: 'raw', entities: [] });

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
        .get('/wrapped?object=true')
        .send({
          type: 'raw',
          entities: ['{"kind":"Component"}', null, '{"kind":"User"}', null],
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
        .get('/wrapped?object=true')
        .send({
          type: 'raw',
          entities: Array(300).fill(entityMock),
        });

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.header['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(res.header['content-length']).toBeDefined();
      expect(res.body).toEqual({
        page: 1,
        items: expect.objectContaining({ length: 300 }),
        totalItems: 1337,
      });
    });
  });
});
