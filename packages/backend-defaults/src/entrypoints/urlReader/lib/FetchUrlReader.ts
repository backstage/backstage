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

import {
  UrlReaderService,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import { ReaderFactory } from './types';
import path from 'path';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

const isInRange = (num: number, [start, end]: [number, number]) => {
  return num >= start && num <= end;
};

const parsePortRange = (port: string): [number, number] => {
  const isRange = port.includes('-');
  if (isRange) {
    const range = port
      .split('-')
      .map(v => parseInt(v, 10))
      .filter(Boolean) as [number, number];
    if (range.length !== 2) throw new Error(`Port range is not valid: ${port}`);
    const [start, end] = range;
    if (start <= 0 || end <= 0 || start > end)
      throw new Error(`Port range is not valid: [${start}, ${end}]`);
    return range;
  }
  const parsedPort = parseInt(port, 10);
  return [parsedPort, parsedPort];
};

const parsePortPredicate = (port: string | undefined) => {
  if (port) {
    const range = parsePortRange(port);
    return (url: URL) => {
      if (url.port) return isInRange(parseInt(url.port, 10), range);

      if (url.protocol === 'http:') return isInRange(80, range);
      if (url.protocol === 'https:') return isInRange(443, range);
      return false;
    };
  }
  return (url: URL) => !url.port;
};

/**
 * A {@link @backstage/backend-plugin-api#UrlReaderService} that does a plain fetch of the URL.
 *
 * @public
 */
export class FetchUrlReader implements UrlReaderService {
  /**
   * The factory creates a single reader that will be used for reading any URL that's listed
   * in configuration at `backend.reading.allow`. The allow list contains a list of objects describing
   * targets to allow, containing the following fields:
   *
   * `host`:
   *   Either full hostnames to match, or subdomain wildcard matchers with a leading '*'.
   *   For example 'example.com' and '*.example.com' are valid values, 'prod.*.example.com' is not.
   *
   * `paths`:
   *   An optional list of paths which are allowed. If the list is omitted all paths are allowed.
   */
  static factory: ReaderFactory = ({ config }) => {
    const predicates =
      config
        .getOptionalConfigArray('backend.reading.allow')
        ?.map(allowConfig => {
          const paths = allowConfig.getOptionalStringArray('paths');
          const checkPath = paths
            ? (url: URL) => {
                const targetPath = path.posix.normalize(url.pathname);
                return paths.some(allowedPath =>
                  targetPath.startsWith(allowedPath),
                );
              }
            : (_url: URL) => true;
          const host = allowConfig.getString('host');
          const [hostname, port] = host.split(':');

          const checkPort = parsePortPredicate(port);

          if (hostname.startsWith('*.')) {
            const suffix = hostname.slice(1);
            return (url: URL) =>
              url.hostname.endsWith(suffix) && checkPath(url) && checkPort(url);
          }
          return (url: URL) =>
            url.hostname === hostname && checkPath(url) && checkPort(url);
        }) ?? [];

    const reader = new FetchUrlReader();
    const predicate = (url: URL) => predicates.some(p => p(url));
    return [{ reader, predicate }];
  };

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          ...(options?.etag && { 'If-None-Match': options.etag }),
          ...(options?.lastModifiedAfter && {
            'If-Modified-Since': options.lastModifiedAfter.toUTCString(),
          }),
          ...(options?.token && { Authorization: `Bearer ${options.token}` }),
        },
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can
        // be removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        signal: options?.signal as any,
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.ok) {
      return ReadUrlResponseFactory.fromResponse(response);
    }

    const message = `could not read ${url}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(): Promise<UrlReaderServiceReadTreeResponse> {
    throw new Error('FetchUrlReader does not implement readTree');
  }

  async search(): Promise<UrlReaderServiceSearchResponse> {
    throw new Error('FetchUrlReader does not implement search');
  }

  toString() {
    return 'fetch{}';
  }
}
