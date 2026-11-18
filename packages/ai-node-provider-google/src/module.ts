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

import type { AnyModel } from '@earendil-works/pi-ai';
import type { DestinationTemplate } from '@backstage/ai-node/modules';
import type {
  AiProviderModule,
  ProviderAdapter,
  ProviderEnvelope,
} from '@backstage/ai-node/modules';
import { runGoogleStream } from './runtime';

const CHAT = ['stream', 'complete', 'streamSimple', 'completeSimple'] as const;
const MAX_BODY = 16 * 1024 * 1024;

/**
 * The first provider module family shaped like a third-party one: Gemini and
 * Vertex dispatch through a dedicated isolated worker whose global fetch is
 * shimmed for the worker's lifetime, because the pinned Google SDK has no
 * request-scoped transport hook. Authority is bound per async stream through
 * the job's own message port, never worker-global; see `runtime.ts` and the
 * module TSDoc in `types.ts` for the trust boundary.
 *
 * Host registration (no core edits): pass
 * `createProviderRegistry([...googleProviderModules])`
 * as the `providers` option of the AI service integration.
 *
 * Certified configurations: API-key credentials only. `google-vertex` with
 * ADC (`GOOGLE_APPLICATION_CREDENTIALS`) is not certified and fails closed;
 * regional Vertex routes (`GOOGLE_CLOUD_PROJECT`/`GOOGLE_CLOUD_LOCATION`)
 * combined with an API key silently switch the SDK to the Express endpoint
 * and are denied by destination mismatch. Certified route versions are
 * Gemini `/v1beta` and Vertex `/v1`; the dynamic model, project and location
 * segments are digested by the destination templates.
 *
 * @internal
 */

/** Mirrors the SDK's own model-string validation, applied at binding time. */
function assertModelId(model: AnyModel): string {
  const id = (model as { id?: unknown }).id;
  if (
    typeof id !== 'string' ||
    !id ||
    id.includes('/') ||
    id.includes('?') ||
    id.includes('&') ||
    id.includes('..')
  ) {
    throw new Error('unsupported Google model identifier');
  }
  return id;
}

function trimBase(url: unknown): string | undefined {
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  return trimmed ? trimmed.replace(/\/+$/, '') : undefined;
}

/** Mirrors the pinned adapters' version-in-base-URL detection. */
function includesVersion(baseUrl: string): boolean {
  try {
    return new URL(baseUrl).pathname
      .split('/')
      .some(part => /^v\d+(?:beta\d*)?$/.test(part));
  } catch {
    return /(?:^|\/)v\d+(?:beta\d*)?(?:\/|$)/.test(baseUrl);
  }
}

function vertexProjectAndLocation(env: Record<string, string> | undefined): {
  project: string;
  location: string;
} {
  const project = env?.GOOGLE_CLOUD_PROJECT || env?.GCLOUD_PROJECT || undefined;
  const location = env?.GOOGLE_CLOUD_LOCATION || undefined;
  if (!project || !location) {
    throw new Error(
      'google-vertex requires GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION, or a custom model baseUrl',
    );
  }
  return { project, location };
}

function geminiDestination(model: AnyModel): string {
  const id = assertModelId(model);
  const custom = trimBase(model.baseUrl);
  if (custom) {
    // The pinned mldev adapter disables the SDK apiVersion whenever a
    // custom base is set, versioned or not: the route is exactly
    // `${base}/models/...` with nothing inserted.
    return `${custom}/models/${id}:streamGenerateContent?alt=sse`;
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/${id}:streamGenerateContent?alt=sse`;
}

function vertexDestination(
  model: AnyModel,
  env: Record<string, string> | undefined,
): string {
  const id = assertModelId(model);
  const custom = trimBase(model.baseUrl);
  if (custom && !custom.includes('{location}')) {
    const version = includesVersion(custom) ? '' : '/v1';
    return `${custom}${version}/publishers/google/models/${id}:streamGenerateContent?alt=sse`;
  }
  const { project, location } = vertexProjectAndLocation(env);
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${id}:streamGenerateContent?alt=sse`;
}

const GEMINI_TEMPLATES: readonly DestinationTemplate[] = [
  [
    { literal: '/v1beta/models/' },
    { digest: 'model' },
    { literal: ':streamGenerateContent' },
  ],
  [
    { literal: '/models/' },
    { digest: 'model' },
    { literal: ':streamGenerateContent' },
  ],
];

const VERTEX_TEMPLATES: readonly DestinationTemplate[] = [
  [
    { literal: '/v1/projects/' },
    { digest: 'project' },
    { literal: '/locations/' },
    { digest: 'location' },
    { literal: '/publishers/google/models/' },
    { digest: 'model' },
    { literal: ':streamGenerateContent' },
  ],
  [
    { literal: '/v1/publishers/google/models/' },
    { digest: 'model' },
    { literal: ':streamGenerateContent' },
  ],
];

function assertUniqueTopLevelKeys(json: string): void {
  const seen = new Set<string>();
  let depth = 0;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (ch === '"') {
      const start = i++;
      while (i < json.length && json[i] !== '"') {
        if (json[i] === '\\') i++;
        i++;
      }
      const end = i;
      let next = i + 1;
      while (/\s/.test(json[next] ?? '') && next < json.length) next++;
      if (depth === 1 && json[next] === ':') {
        const key: string = JSON.parse(json.slice(start, end + 1));
        if (seen.has(key)) throw new Error('Duplicate request field');
        seen.add(key);
      }
    } else if (ch === '{' || ch === '[') {
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
    }
  }
}

/**
 * Google envelope validation. Model identity rides in the URL path
 * (`models/{id}:streamGenerateContent`), not the body, so the path segment
 * is the model-identity check. The SDK's only query parameter on this route
 * is `alt=sse`; anything else fails closed. The body must be a JSON object
 * with unique top-level keys, or it is uninspectable.
 */
async function validateGoogleEnvelope(
  operation: ProviderEnvelope,
  request: Request,
): Promise<'model'> {
  const url = new URL(request.url);
  const params = [...url.searchParams.entries()];
  if (params.length !== 1 || params[0][0] !== 'alt' || params[0][1] !== 'sse') {
    throw new Error('Unexpected SDK query parameter');
  }
  if (request.method !== 'POST') {
    throw new Error('Unexpected model destination or method');
  }
  if (
    !url.pathname.endsWith(
      `/models/${operation.resolvedModel}:streamGenerateContent`,
    )
  ) {
    throw new Error('Request model does not match authorized model');
  }
  const contentType = request.headers
    .get('content-type')
    ?.split(';', 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== 'application/json') {
    throw new Error('Uninspectable model request');
  }
  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.byteLength > MAX_BODY) {
    throw new Error('Request body exceeds validation limit');
  }
  const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const payload: unknown = JSON.parse(json);
  assertUniqueTopLevelKeys(json);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Uninspectable model request');
  }
  return 'model';
}

function workerAdapter(
  api: 'google-generative-ai' | 'google-vertex',
): ProviderAdapter {
  return {
    kind: 'stream',
    stream: (model, context, options) =>
      runGoogleStream(api, model as never, context, options, false),
    streamSimple: (model, context, options) =>
      runGoogleStream(api, model as never, context, options, true),
  };
}

/**
 * Google Gemini through the generative-language API: API-key credentials,
 * dispatched through the isolated worker runtime.
 *
 * @alpha
 */
export const googleGenerativeAi: AiProviderModule = {
  id: 'google-generative-ai',
  adapter: workerAdapter('google-generative-ai'),
  certifiedOperations: CHAT,
  destinationTemplates: GEMINI_TEMPLATES,
  destination: model => geminiDestination(model),
  validateEnvelope: validateGoogleEnvelope,
};

/**
 * Google Vertex AI: application-default or API-key credentials with a
 * project/location binding, dispatched through the isolated worker runtime.
 *
 * @alpha
 */
export const googleVertex: AiProviderModule = {
  id: 'google-vertex',
  adapter: workerAdapter('google-vertex'),
  certifiedOperations: CHAT,
  destinationTemplates: VERTEX_TEMPLATES,
  destination: (model, env) => vertexDestination(model, env),
  validateEnvelope: validateGoogleEnvelope,
};

/**
 * The Google provider modules, for host registration alongside the built-ins:
 * `createProviderRegistry([...googleProviderModules])`.
 *
 * @alpha
 */
export const googleProviderModules: readonly AiProviderModule[] = Object.freeze(
  [googleGenerativeAi, googleVertex],
);
