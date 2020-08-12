/*
 * Copyright 2020 Spotify AB
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

import { UrlReaderProcessor } from './UrlReaderProcessor';
import {
  LocationProcessorDataResult,
  LocationProcessorResult,
  LocationProcessorErrorResult,
} from './types';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe('UrlReaderProcessor', () => {
  const mockApiOrigin = 'http://localhost:23000';
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should load from url', async () => {
    const processor = new UrlReaderProcessor();
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component.yaml`,
    };

    server.use(
      rest.get(`${mockApiOrigin}/component.yaml`, (_, res, ctx) =>
        res(ctx.body('Hello')),
      ),
    );

    const generated = (await new Promise<LocationProcessorResult>(emit =>
      processor.readLocation(spec, false, emit),
    )) as LocationProcessorDataResult;

    expect(generated.type).toBe('data');
    expect(generated.location).toBe(spec);
    expect(generated.data.toString('utf8')).toBe('Hello');
  });

  it('should fail load from url with error', async () => {
    const processor = new UrlReaderProcessor();
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component-notfound.yaml`,
    };

    server.use(
      rest.get(`${mockApiOrigin}/component-notfound.yaml`, (_, res, ctx) => {
        return res(ctx.status(404));
      }),
    );

    const generated = (await new Promise<LocationProcessorResult>(emit =>
      processor.readLocation(spec, false, emit),
    )) as LocationProcessorErrorResult;

    expect(generated.type).toBe('error');
    expect(generated.location).toBe(spec);
    expect(generated.error.name).toBe('NotFoundError');
    expect(generated.error.message).toBe(
      `${mockApiOrigin}/component-notfound.yaml could not be read, 404 Not Found`,
    );
  });
});
