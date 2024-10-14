/*
 * Copyright 2023 The Backstage Authors
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

import { startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';
import searchPlugin from './plugin';

describe('searchPlugin', () => {
  it('should serve search results on query endpoint', async () => {
    const { server } = await startTestBackend({
      features: [searchPlugin],
    });

    const response = await request(server).get('/api/search/query');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ numberOfResults: 0, results: [] });
  });
});
