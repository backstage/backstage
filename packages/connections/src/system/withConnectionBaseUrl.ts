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
import type { ConnectionLookupIdentity } from '../api/ConnectionType';
import { connectionBaseUrlSchema } from './connectionBaseUrlSchema';

/**
 * Defines URL-based connection data with host identity derived from the instance URL.
 * Spread the result into createConnectionType. The API root defaults to the
 * instance root; explicit API overrides may use an internal endpoint.
 */
export function withConnectionBaseUrl<
  TShape extends z.ZodRawShape & {
    baseUrl: z.ZodType<string, string>;
    apiBaseUrl: z.ZodOptional<z.ZodType<string, string>>;
    host?: never;
  },
>(schema: z.ZodObject<TShape>) {
  // Defer API validation until the base URL is parsed and its fallback is known.
  // Keep the provider's portable input constraints on the deferred string field.
  const apiInputSchema = schema.shape.apiBaseUrl.toJSONSchema({
    target: 'draft-07',
    io: 'input',
  });
  delete apiInputSchema.$schema;
  const inputSchema = schema.clone({
    ...schema.def,
    shape: {
      ...schema.shape,
      apiBaseUrl: z.string().optional().meta(apiInputSchema),
    },
    checks: [],
  });
  const resolvedSchema = inputSchema.strict().transform((config, ctx) => {
    const { baseUrl, apiBaseUrl } = config as {
      baseUrl: string;
      apiBaseUrl?: string;
    };
    // The base/provider fields have already parsed once. The API field is still
    // raw, so its complete schema sees only the resolved fallback or override.
    const base = connectionBaseUrlSchema.safeParse(baseUrl);
    if (!base.success) {
      for (const issue of base.error.issues) {
        ctx.addIssue({ ...issue, path: ['baseUrl', ...issue.path] });
      }
      return z.NEVER;
    }
    const resolved = schema.shape.apiBaseUrl.safeParse(apiBaseUrl ?? base.data);
    if (!resolved.success) {
      for (const issue of resolved.error.issues) {
        ctx.addIssue({ ...issue, path: ['apiBaseUrl', ...issue.path] });
      }
      return z.NEVER;
    }
    const api = connectionBaseUrlSchema.safeParse(resolved.data);
    if (!api.success) {
      for (const issue of api.error.issues) {
        ctx.addIssue({ ...issue, path: ['apiBaseUrl', ...issue.path] });
      }
      return z.NEVER;
    }
    if (apiBaseUrl === undefined && api.data !== base.data) {
      ctx.addIssue({
        code: 'custom',
        path: ['apiBaseUrl'],
        message:
          'API URL transforms must preserve the baseUrl fallback; configure apiBaseUrl explicitly to use another endpoint',
      });
      return z.NEVER;
    }
    return { ...config, baseUrl: base.data, apiBaseUrl: api.data };
  });
  // Object-level checks must see the resolved API value too, without reparsing
  // provider fields or running their transforms a second time.
  const configSchema = resolvedSchema.clone({
    ...resolvedSchema.def,
    checks: schema.def.checks,
  });
  return {
    configSchema,
    getLookupIdentity: (config: {
      baseUrl: string;
    }): ConnectionLookupIdentity => ({
      key: 'host',
      value: new URL(config.baseUrl).host,
    }),
  };
}
