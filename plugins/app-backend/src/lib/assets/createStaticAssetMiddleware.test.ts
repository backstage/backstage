/*
 * Copyright 2021 The Backstage Authors
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
import request from 'supertest';
import { createStaticAssetMiddleware } from './createStaticAssetMiddleware';
import { StaticAssetsStore } from './StaticAssetsStore';

const mockStore = {
  getAsset: jest.fn(),
} as unknown as jest.Mocked<StaticAssetsStore>;

describe('createStaticAssetMiddleware', () => {
  const app = express();
  app.use(createStaticAssetMiddleware(mockStore));
  app.use((_req, res) => {
    res.status(404).end('Not Found');
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should respond with an asset', async () => {
    const now = new Date();
    mockStore.getAsset.mockResolvedValueOnce({
      path: 'foo.js',
      lastModifiedAt: now,
      content: Buffer.from('foo'),
    });

    const res = await request(app).get('/foo.js');

    expect(res.status).toBe(200);
    expect(res.text).toBe('foo');
    expect(res.get('Content-Type')).toBe(
      'application/javascript; charset=utf-8',
    );
    expect(res.get('Content-Length')).toBe('3');
    expect(res.get('Cache-Control')).toBe('public, max-age=1209600');
    expect(res.get('Last-Modified')).toBe(now.toUTCString());

    expect(mockStore.getAsset).toHaveBeenCalledTimes(1);
    expect(mockStore.getAsset).toHaveBeenCalledWith('foo.js');
  });

  mockStore.getAsset.mockResolvedValueOnce(undefined);

  it('should respond with not found', async () => {
    const res = await request(app).get('/foo.js');

    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');

    expect(mockStore.getAsset).toHaveBeenCalledTimes(1);
    expect(mockStore.getAsset).toHaveBeenCalledWith('foo.js');
  });

  it('should handle other content type', async () => {
    mockStore.getAsset.mockResolvedValueOnce({
      path: 'foo.css',
      lastModifiedAt: new Date(),
      content: Buffer.from('foo'),
    });

    const res = await request(app).get('/foo.css');

    expect(res.status).toBe(200);
    expect(res.text).toBe('foo');
    expect(res.get('Content-Type')).toBe('text/css; charset=utf-8');
    expect(res.get('Content-Length')).toBe('3');

    expect(mockStore.getAsset).toHaveBeenCalledTimes(1);
    expect(mockStore.getAsset).toHaveBeenLastCalledWith('foo.css');
  });

  it('should handle unknown content types', async () => {
    mockStore.getAsset.mockResolvedValueOnce({
      path: 'foo.notavalidextension',
      lastModifiedAt: new Date(),
      content: Buffer.from('foo'),
    });

    const res = await request(app).get('/foo.notavalidextension');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(Buffer.from('foo'));
    expect(res.get('Content-Type')).toBe('application/octet-stream');
    expect(res.get('Content-Length')).toBe('3');

    expect(mockStore.getAsset).toHaveBeenCalledTimes(1);
    expect(mockStore.getAsset).toHaveBeenLastCalledWith(
      'foo.notavalidextension',
    );
  });
});
