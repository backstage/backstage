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
import { z } from 'zod/v4';
import { connectionBaseUrlSchema } from './connectionBaseUrlSchema';

function normalizeLookupHost(host: string): string {
  // An explicit lookup host has no scheme, and the API endpoint may differ.
  // HTTP drops port 80 and HTTPS drops port 443; using both preserves either
  // explicit port while canonicalising hostname, IPv6 and numeric spelling.
  const http = new URL(`http://${host}/`);
  const https = new URL(`https://${host}/`);
  const port = http.port || https.port;
  return `${http.hostname}${port ? `:${port}` : ''}`;
}

/**
 * Defaults a missing baseUrl to an HTTPS root for the required lookup host.
 * Explicit endpoints are preserved. Opt in only when a same-host HTTPS root
 * is an appropriate default for the connection type.
 */
export function withConnectionBaseUrl<
  TShape extends z.ZodRawShape & {
    host: z.ZodType<string, string>;
    baseUrl: z.ZodType<string | undefined>;
  },
>(schema: z.ZodObject<TShape>) {
  return schema.transform((config, ctx) => {
    // The object schema has already applied field defaults and transforms.
    const { host, baseUrl } = config as { host: string; baseUrl?: string };
    // Use a synthetic URL only to validate host syntax. The lookup identity has
    // no scheme and must stay independent of the configured API endpoint.
    if (
      host.includes('/') ||
      !connectionBaseUrlSchema.safeParse(`https://${host}/`).success
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['host'],
        message: 'Expected a host with an optional port',
      });
      return z.NEVER;
    }
    let candidate = baseUrl;
    if (candidate === undefined) {
      // Apply the baseUrl field's own restrictions and transforms to the default.
      // Supplied values have already been parsed and must not be parsed twice.
      const result = schema.shape.baseUrl.safeParse(`https://${host}/`);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue({ ...issue, path: ['baseUrl', ...issue.path] });
        }
        return z.NEVER;
      }
      candidate = result.data;
    }
    // A field transform may have changed the URL. Check the final root and add
    // its trailing slash without rewriting context paths or encoded content.
    const root = connectionBaseUrlSchema.safeParse(candidate);
    if (!root.success) {
      for (const issue of root.error.issues) {
        ctx.addIssue({ ...issue, path: ['baseUrl', ...issue.path] });
      }
      return z.NEVER;
    }
    return {
      ...config,
      host: normalizeLookupHost(host),
      baseUrl: root.data,
    };
  });
}
