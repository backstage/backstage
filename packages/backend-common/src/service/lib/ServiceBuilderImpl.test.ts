/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import request from 'supertest';
import { applyCspDirectives, ServiceBuilderImpl } from './ServiceBuilderImpl';

describe('ServiceBuilderImpl', () => {
  describe('applyCspDirectives', () => {
    it('copies actual values', () => {
      const result = applyCspDirectives({ key: ['value'] });
      expect(result).toEqual(
        expect.objectContaining({
          'default-src': ["'self'"],
          key: ['value'],
        }),
      );
    });

    it('removes false value keys', () => {
      const result = applyCspDirectives({ 'upgrade-insecure-requests': false });
      expect(result!['upgrade-insecure-requests']).toBeUndefined();
    });
  });

  describe('updateCorsOptions', () => {
    it('enable cors with options', async () => {
      const app = new ServiceBuilderImpl(module)
        .updateCorsOptions({ origin: '*' })
        .getApp();

      const { header } = await request(app).options('/');

      expect(header['access-control-allow-origin']).toBe('*');
    });
  });

  it('updates existent options', async () => {
    const config = new ConfigReader({
      backend: {
        listen: {
          port: 7001,
        },
        cors: {
          origin: '-',
        },
      },
    });
    const app = new ServiceBuilderImpl(module)
      .loadConfig(config)
      .updateCorsOptions({ origin: '*' })
      .getApp();

    const { header } = await request(app).options('/');

    expect(header['access-control-allow-origin']).toBe('*');
  });

  it('merge new options', async () => {
    const config = new ConfigReader({
      backend: {
        listen: {
          port: 7001,
        },
        cors: {
          origin: '-',
        },
      },
    });
    const app = new ServiceBuilderImpl(module)
      .loadConfig(config)
      .updateCorsOptions({ methods: 'GET' })
      .getApp();

    const { header } = await request(app).options('/');

    expect(header['access-control-allow-origin']).toBe('-');

    expect(header['access-control-allow-methods']).toBe('GET');
  });

  it('enableCors removes all the existent options', async () => {
    const config = new ConfigReader({
      backend: {
        listen: {
          port: 7001,
        },
        cors: {
          origin: '-',
        },
      },
    });
    const app = new ServiceBuilderImpl(module)
      .loadConfig(config)
      .updateCorsOptions({ methods: 'GET' })
      .enableCors({ allowedHeaders: 'X-header' })
      .getApp();

    const { header } = await request(app).options('/');

    expect(header['access-control-allow-origin']).toBe('*'); // default value
    expect(header['access-control-allow-methods']).toBe(
      'GET,HEAD,PUT,PATCH,POST,DELETE', // default value
    );
    expect(header['access-control-allow-headers']).toBe('X-header');
  });
});
