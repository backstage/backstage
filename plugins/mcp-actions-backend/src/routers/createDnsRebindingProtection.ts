/*
 * Copyright 2026 The Backstage Authors
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
import { RequestHandler, Response } from 'express';

const CONFIG_KEY = 'mcpActions.dnsRebindingProtection';

function parseOrigin(value: string): string | undefined {
  try {
    const { origin } = new URL(value);
    // Non-special schemes and values such as "null" have an opaque origin
    return origin === 'null' ? undefined : origin;
  } catch {
    return undefined;
  }
}

function parseHostname(value: string): string | undefined {
  try {
    return new URL(`http://${value}`).hostname;
  } catch {
    return undefined;
  }
}

function reject(res: Response, message: string) {
  res.status(403).json({
    jsonrpc: '2.0',
    error: { code: -32000, message },
    id: null,
  });
}

/**
 * Protects the MCP endpoints against DNS rebinding, as required by the
 * Streamable HTTP transport of the MCP specification.
 *
 * Requests that carry an `Origin` header must come from the app or backend
 * origin, or from an origin configured in `allowedOrigins`. Requests without
 * an `Origin` header, which non-browser clients send, are not affected. The
 * `Host` header is only checked when `allowedHosts` is configured.
 */
export const createDnsRebindingProtection = (
  config: Config,
): RequestHandler => {
  const allowedOrigins = new Set<string>();
  for (const key of ['app.baseUrl', 'backend.baseUrl']) {
    const baseUrl = config.getOptionalString(key);
    const origin = baseUrl && parseOrigin(baseUrl);
    if (origin) {
      allowedOrigins.add(origin);
    }
  }
  for (const value of config.getOptionalStringArray(
    `${CONFIG_KEY}.allowedOrigins`,
  ) ?? []) {
    const origin = parseOrigin(value);
    if (!origin) {
      throw new Error(
        `Invalid origin "${value}" in ${CONFIG_KEY}.allowedOrigins`,
      );
    }
    allowedOrigins.add(origin);
  }

  let allowedHosts: Set<string> | undefined;
  const allowedHostsConfig = config.getOptionalStringArray(
    `${CONFIG_KEY}.allowedHosts`,
  );
  if (allowedHostsConfig) {
    allowedHosts = new Set();
    for (const value of allowedHostsConfig) {
      const hostname = parseHostname(value);
      if (!hostname) {
        throw new Error(
          `Invalid host "${value}" in ${CONFIG_KEY}.allowedHosts`,
        );
      }
      allowedHosts.add(hostname);
    }
  }

  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin !== undefined) {
      const parsedOrigin = parseOrigin(origin);
      if (!parsedOrigin || !allowedOrigins.has(parsedOrigin)) {
        reject(res, 'Invalid Origin header');
        return;
      }
    }

    if (allowedHosts) {
      const host = req.headers.host;
      const hostname = host ? parseHostname(host) : undefined;
      if (!hostname || !allowedHosts.has(hostname)) {
        reject(res, 'Invalid Host header');
        return;
      }
    }

    next();
  };
};
