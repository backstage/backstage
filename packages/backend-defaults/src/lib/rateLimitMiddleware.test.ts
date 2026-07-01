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

import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import { rateLimitMiddleware } from './rateLimitMiddleware';

function createApp(config: ConfigReader) {
  const app = express();
  // Mimic a backend running behind a proxy so that the X-Forwarded-For header
  // is used to populate `req.ip`, allowing us to exercise IPv6 client handling.
  app.set('trust proxy', true);
  app.use(rateLimitMiddleware({ config }));
  app.get('/', (_req, res) => {
    res.status(200).send('ok');
  });
  return app;
}

describe('rateLimitMiddleware', () => {
  it('limits requests per client and handles IPv6 addresses without key generator validation errors', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const app = createApp(
      new ConfigReader({ incomingRequestLimit: 2, ipAllowList: [] }),
    );
    const agent = request(app);
    const ipv6 = '2001:db8::1';

    const first = await agent.get('/').set('X-Forwarded-For', ipv6);
    const second = await agent.get('/').set('X-Forwarded-For', ipv6);
    const third = await agent.get('/').set('X-Forwarded-For', ipv6);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    expect(third.body).toEqual({
      error: {
        name: 'Error',
        message: 'Too many requests, please try again later',
      },
      response: { statusCode: 429 },
    });

    // express-rate-limit 8.x rejects key generators that reference `req.ip`
    // without using its `ipKeyGenerator` helper, reporting an ERR_ERL_KEY_GEN_IPV6
    // validation error. Make sure our key generator does not trip that check.
    const logs = [...errorSpy.mock.calls, ...warnSpy.mock.calls]
      .flat()
      .map(arg =>
        arg instanceof Error
          ? `${arg.message} ${(arg as { code?: string }).code ?? ''}`
          : String(arg),
      )
      .join('\n');
    expect(logs).not.toMatch(/IPV6|ipKeyGenerator/i);

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('does not rate limit addresses on the allow list', async () => {
    const app = createApp(
      new ConfigReader({
        incomingRequestLimit: 1,
        ipAllowList: ['2001:db8::5'],
      }),
    );
    const agent = request(app);

    for (let i = 0; i < 3; i++) {
      const response = await agent
        .get('/')
        .set('X-Forwarded-For', '2001:db8::5');
      expect(response.status).toBe(200);
    }
  });
});
