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

import { UrlReaderPredicateMux } from './UrlReaderPredicateMux';

describe('UrlReaderPredicateMux', () => {
  it('forwards methods based on predicate', async () => {
    const fooReader = {
      read: jest.fn(),
      readUrl: jest.fn(),
      readTree: jest.fn(),
      search: jest.fn(),
    };
    const barReader = {
      read: jest.fn(),
      readUrl: jest.fn(),
      readTree: jest.fn(),
      search: jest.fn(),
    };

    const mux = new UrlReaderPredicateMux();
    mux.register({
      predicate: url => url.hostname === 'foo',
      reader: fooReader,
    });
    mux.register({
      predicate: url => url.hostname === 'bar',
      reader: barReader,
    });

    await mux.readUrl('http://foo/1');
    expect(fooReader.readUrl).toHaveBeenCalledWith('http://foo/1', undefined);
    await mux.readUrl('http://foo/2');
    expect(fooReader.readUrl).toHaveBeenCalledWith('http://foo/2', undefined);
    await mux.readTree('http://foo/3');
    expect(fooReader.readTree).toHaveBeenCalledWith('http://foo/3', undefined);
    await mux.search('http://foo/4');
    expect(fooReader.search).toHaveBeenCalledWith('http://foo/4', undefined);

    await mux.readUrl('http://bar/1');
    expect(barReader.readUrl).toHaveBeenCalledWith('http://bar/1', undefined);
    await mux.readUrl('http://bar/2');
    expect(barReader.readUrl).toHaveBeenCalledWith('http://bar/2', undefined);
    await mux.readTree('http://bar/3');
    expect(barReader.readTree).toHaveBeenCalledWith('http://bar/3', undefined);
    await mux.search('http://bar/4');
    expect(barReader.search).toHaveBeenCalledWith('http://bar/4', undefined);
  });

  it('throws an error if no predicate matches', async () => {
    const mux = new UrlReaderPredicateMux();

    await expect(mux.readUrl('http://foo/1')).rejects.toThrow(
      /^Reading from 'http:\/\/foo\/1' is not allowed. You may/,
    );

    mux.register({
      predicate: url => url.hostname === 'foo',
      reader: {
        readUrl: jest.fn(),
        readTree: jest.fn(),
        search: jest.fn(),
      },
    });

    await expect(mux.readUrl('http://foo/1')).resolves.toBeUndefined();

    await expect(mux.readUrl('http://bar/1')).rejects.toThrow(
      /^Reading from 'http:\/\/bar\/1' is not allowed. You may/,
    );
  });
});
