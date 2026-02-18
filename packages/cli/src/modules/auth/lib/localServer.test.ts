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

import { startCallbackServer } from './localServer';

describe('localServer', () => {
  it('should start on port 8055, handle requests, and resolve the code', async () => {
    const { url, waitForCode, close } = await startCallbackServer({
      state: 'test-state',
    });

    expect(url).toBe('http://127.0.0.1:8055/callback');

    // 404 for non-callback paths
    const notFoundResponse = await fetch(
      url.replace('/callback', '/other-path'),
    );
    expect(notFoundResponse.status).toBe(404);

    // 400 for missing code
    const missingCodeResponse = await fetch(`${url}?state=test-state`);
    expect(missingCodeResponse.status).toBe(400);
    expect(await missingCodeResponse.text()).toBe('Missing code');

    // 200 for valid callback
    const codePromise = waitForCode();
    const specialCode = 'test-code+with/special=chars';
    const specialState = 'test-state+with/special=chars';
    const successResponse = await fetch(
      `${url}?code=${encodeURIComponent(
        specialCode,
      )}&state=${encodeURIComponent(specialState)}`,
    );
    expect(successResponse.status).toBe(200);
    expect(await successResponse.text()).toBe('You may now close this window.');
    expect(successResponse.headers.get('content-type')).toBe(
      'text/plain; charset=utf-8',
    );

    const result = await codePromise;
    expect(result.code).toBe(specialCode);
    expect(result.state).toBe(specialState);

    await close();
  });
});
