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
import React from 'react';
import { AirbrakePage, airbrakePlugin } from './plugin';
import { renderWithEffects } from '@backstage/test-utils';
import { createApp } from '@backstage/app-defaults';
import { Route } from 'react-router';

describe('Airbrake', () => {
  it('should export plugin', () => {
    expect(airbrakePlugin).toBeDefined();
  });

  it('should render page', async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: { title: 'Test' },
            backend: { baseUrl: 'http://localhost:7000' },
            techdocs: {
              storageUrl: 'http://localhost:7000/api/techdocs/static/docs',
            },
          },
          context: 'test',
        },
      ] as any,
    };

    const app = createApp();
    const AppProvider = app.getProvider();
    const AppRouter = app.getRouter();

    const rendered = await renderWithEffects(
      <AppProvider>
        <AppRouter>
          <Route path="/airbrake" element={<AirbrakePage />} />
        </AppRouter>
      </AppProvider>,
    );
    expect(rendered.getByText('ChunkLoadError')).toBeInTheDocument();
  });
});
