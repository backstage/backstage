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

function normalizeLookupHost(host: string, protocol?: string): string {
  if (protocol) {
    return new URL(`${protocol}//${host}/`).host;
  }
  // An explicit lookup host has no scheme, and the API endpoint may differ.
  // HTTP drops port 80 and HTTPS drops port 443; using both preserves either
  // explicit port while canonicalising hostname, IPv6 and numeric spelling.
  const http = new URL(`http://${host}/`);
  const https = new URL(`https://${host}/`);
  const port = http.port || https.port;
  return `${http.hostname}${port ? `:${port}` : ''}`;
}

/**
 * Fills missing host/baseUrl fields without replacing explicit endpoints.
 * A host-only configuration uses an HTTPS root. Types with provider-specific
 * endpoint defaults should supply those explicitly instead.
 */
export function withConnectionBaseUrl<
  TShape extends z.ZodRawShape & {
    host: z.ZodType<string | undefined>;
    baseUrl: z.ZodType<string | undefined>;
  },
>(schema: z.ZodObject<TShape>) {
  return schema.transform((config, ctx) => {
    // The object schema has already applied field defaults and transforms.
    const { host, baseUrl } = config as { host?: string; baseUrl?: string };
    if (host === undefined && baseUrl === undefined) {
      ctx.addIssue({ code: 'custom', message: 'Provide a host or baseUrl' });
      return z.NEVER;
    }

    // Only derived values need parsing here. Reusing each field's schema keeps
    // provider restrictions and transforms without parsing supplied values twice.
    function parseDerivedField(field: 'host' | 'baseUrl', value: string) {
      const result = schema.shape[field].safeParse(value);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue({ ...issue, path: [field, ...issue.path] });
        }
        return undefined;
      }
      if (result.data === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `Expected ${field} to resolve to a string`,
        });
      }
      return result.data;
    }

    const candidate =
      baseUrl ?? parseDerivedField('baseUrl', `https://${host}/`);
    if (candidate === undefined) {
      return z.NEVER;
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
    const resolvedHost =
      host ?? parseDerivedField('host', new URL(root.data).host);
    if (resolvedHost === undefined) {
      return z.NEVER;
    }
    // Use a synthetic URL only to validate host syntax, not to choose its scheme.
    if (
      resolvedHost.includes('/') ||
      !connectionBaseUrlSchema.safeParse(`https://${resolvedHost}/`).success
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['host'],
        message: 'Expected a host with an optional port',
      });
      return z.NEVER;
    }
    // The lookup scheme is known only when deriving one field from the other.
    // With both explicit, the API URL's scheme says nothing about lookup URLs.
    let lookupProtocol: string | undefined;
    if (host === undefined) {
      lookupProtocol = new URL(root.data).protocol;
    } else if (baseUrl === undefined) {
      lookupProtocol = 'https:';
    }
    return {
      ...config,
      host: normalizeLookupHost(resolvedHost, lookupProtocol),
      baseUrl: root.data,
    };
  });
}
