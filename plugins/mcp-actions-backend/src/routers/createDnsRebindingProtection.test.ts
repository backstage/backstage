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
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import express from 'express';
import request from 'supertest';
import { createDnsRebindingProtection } from './createDnsRebindingProtection';

describe('createDnsRebindingProtection', () => {
  const createApp = (data: JsonObject) => {
    const app = express();
    app.use(createDnsRebindingProtection(new ConfigReader(data)));
    app.post('/', (_req, res) => {
      res.json({ ok: true });
    });
    return app;
  };

  const baseConfig = {
    app: { baseUrl: 'http://localhost:3000' },
    backend: { baseUrl: 'http://localhost:7007' },
  };

  it('should accept requests without an Origin header or from the app and backend origins', async () => {
    const app = createApp(baseConfig);

    await request(app).post('/').expect(200);
    await request(app)
      .post('/')
      .set('Origin', 'http://localhost:3000')
      .expect(200);
    await request(app)
      .post('/')
      .set('Origin', 'http://localhost:7007')
      .expect(200);

    // The Host header is only checked when allowed hosts are configured
    await request(app).post('/').set('Host', 'evil.example.com').expect(200);
  });

  it('should reject requests from any other origin', async () => {
    const app = createApp(baseConfig);

    for (const origin of [
      'http://evil.example.com',
      'http://localhost:3001',
      'https://localhost:3000',
      'null',
      'not a url',
    ]) {
      const response = await request(app).post('/').set('Origin', origin);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Invalid Origin header' },
        id: null,
      });
    }
  });

  it('should accept additional configured origins', async () => {
    const app = createApp({
      ...baseConfig,
      mcpActions: {
        dnsRebindingProtection: {
          allowedOrigins: [
            'https://mcp-client.example.com:443',
            'http://localhost:6274',
          ],
        },
      },
    });

    await request(app)
      .post('/')
      .set('Origin', 'https://mcp-client.example.com')
      .expect(200);
    await request(app)
      .post('/')
      .set('Origin', 'http://localhost:6274')
      .expect(200);
    await request(app)
      .post('/')
      .set('Origin', 'http://localhost:3000')
      .expect(200);
    await request(app)
      .post('/')
      .set('Origin', 'http://evil.example.com')
      .expect(403);
  });

  it('should only allow configured hosts when allowed hosts are configured', async () => {
    const app = createApp({
      ...baseConfig,
      mcpActions: {
        dnsRebindingProtection: {
          allowedHosts: ['Backstage.Example.com', 'localhost:7007'],
        },
      },
    });

    await request(app)
      .post('/')
      .set('Host', 'backstage.example.com')
      .expect(200);
    await request(app)
      .post('/')
      .set('Host', 'backstage.example.com:8443')
      .expect(200);
    await request(app).post('/').set('Host', 'localhost:7007').expect(200);

    const response = await request(app)
      .post('/')
      .set('Host', 'evil.example.com');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Invalid Host header' },
      id: null,
    });
  });

  it('should throw on invalid configured origins', () => {
    expect(() =>
      createDnsRebindingProtection(
        new ConfigReader({
          mcpActions: {
            dnsRebindingProtection: { allowedOrigins: ['not a url'] },
          },
        }),
      ),
    ).toThrow(
      'Invalid origin "not a url" in mcpActions.dnsRebindingProtection.allowedOrigins',
    );
  });
});
