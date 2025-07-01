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

import { renderInTestApp } from '@backstage/test-utils';
import { ResponseErrorPanel } from './ResponseErrorPanel';
import { ResponseError } from '@backstage/errors';

describe('<ResponseErrorPanel />', () => {
  it('renders generic error using ErrorPanel', async () => {
    const error = new Error('Something went wrong');
    const { getByText } = await renderInTestApp(
      <ResponseErrorPanel error={error} />,
    );
    expect(getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders ResponseError with request and JSON', async () => {
    const error = await ResponseError.fromResponse({
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      json: async () => ({}),
      text: async () => JSON.stringify({}),
      clone() {
        return this;
      },
      ok: false,
      redirected: false,
      type: 'basic',
      url: 'https://api.example.com/data',
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
    } as unknown as Response);
    // Patch error.cause.name and error.cause.stack for coverage
    error.cause.name = 'NotFoundError';
    error.cause.stack = 'stacktrace';

    const { getByText, getByRole } = await renderInTestApp(
      <ResponseErrorPanel error={error} />,
    );
    expect(getByText('404: NotFoundError')).toBeInTheDocument();
    expect(getByText('Full Error as JSON')).toBeInTheDocument();
  });

  it('renders ResponseError without request', async () => {
    // Create a mock Response object with minimal properties
    const mockResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers(),
      json: async () => ({}),
      text: async () => JSON.stringify({}),
      clone() {
        return this;
      },
      ok: false,
      redirected: false,
      type: 'basic',
      url: '',
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
    } as unknown as Response;

    const error = await ResponseError.fromResponse(mockResponse);
    error.cause.name = 'ServerError';
    error.cause.stack = 'stacktrace';

    const { getByText } = await renderInTestApp(
      <ResponseErrorPanel error={error} />,
    );
    expect(getByText('500: ServerError')).toBeInTheDocument();
    expect(getByText('Full Error as JSON')).toBeInTheDocument();
  });
});
