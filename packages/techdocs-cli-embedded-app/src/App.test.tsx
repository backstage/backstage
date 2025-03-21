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

import React from 'react';
import { renderWithEffects } from '@backstage/test-utils';
import App from './App';

jest.mock('./config', () => ({
  configLoader: async () => [
    {
      data: {
        app: { title: 'Test' },
        backend: { baseUrl: 'http://localhost:7007' },
        techdocs: {
          storageUrl: 'http://localhost:7007/api/techdocs/static/docs',
        },
      },
      context: 'test',
    },
  ],
}));

describe('App', () => {
  it('should render', async () => {
    const rendered = await renderWithEffects(<App />);
    expect(rendered.getByText('Docs Preview')).toBeInTheDocument();
  });
});
