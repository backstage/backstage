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

import { Config } from '@backstage/config';
import { HttpServerOptions } from './types';

const DEFAULT_PORT = 7007;
const DEFAULT_HOST = '';

/**
 * Reads {@link HttpServerOptions} from a {@link @backstage/config#Config} object.
 *
 * @public
 * @remarks
 *
 * The provided configuration object should contain the `listen` and
 * additional keys directly.
 *
 * @example
 * ```ts
 * const opts = readHttpServerOptions(config.getConfig('backend'));
 * ```
 */
export function readHttpServerOptions(config?: Config): HttpServerOptions {
  return {
    listen: readHttpListenOptions(config),
    https: readHttpsOptions(config),
  };
}

function readHttpListenOptions(config?: Config): HttpServerOptions['listen'] {
  const listen = config?.getOptional('listen');
  if (typeof listen === 'string') {
    const parts = String(listen).split(':');
    const port = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(port)) {
      if (parts.length === 1) {
        return { port, host: DEFAULT_HOST };
      }
      if (parts.length === 2) {
        return { host: parts[0], port };
      }
    }
    throw new Error(
      `Unable to parse listen address ${listen}, expected <port> or <host>:<port>`,
    );
  }

  // Workaround to allow empty string
  const host = config?.getOptional('listen.host') ?? DEFAULT_HOST;
  if (typeof host !== 'string') {
    config?.getOptionalString('listen.host'); // will throw
    throw new Error('unreachable');
  }

  return {
    port: config?.getOptionalNumber('listen.port') ?? DEFAULT_PORT,
    host,
  };
}

function readHttpsOptions(config?: Config): HttpServerOptions['https'] {
  const https = config?.getOptional('https');
  if (https === true) {
    const baseUrl = config!.getString('baseUrl');
    let hostname;
    try {
      hostname = new URL(baseUrl).hostname;
    } catch (error) {
      throw new Error(`Invalid baseUrl "${baseUrl}"`);
    }

    return { certificate: { type: 'generated', hostname } };
  }

  const cc = config?.getOptionalConfig('https');
  if (!cc) {
    return undefined;
  }

  return {
    certificate: {
      type: 'plain',
      cert: cc.getString('certificate.cert'),
      key: cc.getString('certificate.key'),
    },
  };
}
