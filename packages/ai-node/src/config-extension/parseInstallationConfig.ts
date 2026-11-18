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

import type { Config, JsonValue } from '@backstage/config';
import type { AnyModel, ModelInputModality } from '@earendil-works/pi-ai';
import type { ConfigAtPath } from '../contracts';
import { MCP_RESERVED_PREFIX } from '../credentials/identifiers';
import type {
  AiConfigCredentialScopes,
  AiTokenEndpoint,
  AiCredentialsPrecedence,
  AiInstallationConfig,
  AiInstallationCredentials,
} from './types';

const PRECEDENCES: readonly AiCredentialsPrecedence[] = [
  'user-first',
  'org-first',
];

const INPUT_MODALITIES: readonly ModelInputModality[] = ['text', 'image'];

const MODEL_FIELDS = [
  'provider',
  'modelId',
  'api',
  'baseUrl',
  'type',
  'contextWindow',
  'maxTokens',
  'name',
  'reasoning',
  'input',
  'cost',
] as const;

const COST_FIELDS = ['input', 'output', 'cacheRead', 'cacheWrite'] as const;

/** Required length of the personal-credential encryption key, in bytes. */
const ENCRYPTION_KEY_BYTES = 32;

/** Upper bound for identifiers used in config and in permission names. */
const IDENTIFIER_MAX_LENGTH = 256;

function configError(path: string, message: string): Error {
  return new Error(
    `Invalid AI installation configuration at '${path}': ${message}`,
  );
}

function fieldError(path: string, field: string, guidance: string): Error {
  return configError(path, `the field '${field}' is invalid. ${guidance}`);
}

function rejectUnknownKeys(
  section: Config,
  path: string,
  accepted: readonly string[],
): void {
  for (const key of section.keys()) {
    if (!accepted.includes(key)) {
      throw configError(
        path,
        `the field '${key}' is not part of the AI installation configuration schema. Remove it; the accepted fields are ${accepted
          .map(name => `'${name}'`)
          .join(', ')}`,
      );
    }
  }
}

function assertIdentifier(value: string, path: string, field: string): string {
  if (
    value.length === 0 ||
    value.length > IDENTIFIER_MAX_LENGTH ||
    value !== value.trim() ||
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw fieldError(
      path,
      field,
      `Expected a non-empty identifier of at most ${IDENTIFIER_MAX_LENGTH} characters without control characters or surrounding whitespace`,
    );
  }
  return value;
}

/**
 * Parses and validates the AI installation configuration at the supplied
 * path.
 *
 * @remarks
 *
 * The whole section is optional: an installation with no AI configuration
 * keeps the fail-closed default in which every model dispatch is denied with
 * an actionable reason. When present, the section is validated strictly —
 * unknown fields, malformed model entries, duplicate models, user credential
 * scopes and unusable key material all reject with the exact configuration
 * path, the offending field and corrective guidance.
 *
 * Credential entries are opaque here: the credential kind and its fields are
 * interpreted by the credential stores that consume them, so this schema does
 * not encode provider semantics.
 *
 * @alpha
 */
export function parseAiInstallationConfig(
  source: ConfigAtPath,
): AiInstallationConfig {
  const section = source.root.getOptionalConfig(source.path);
  if (section === undefined) {
    return { models: [] };
  }

  rejectUnknownKeys(section, source.path, ['credentials', 'models']);

  const models = parseModels(section, source.path);
  const credentialsSection = section.getOptionalConfig('credentials');
  const credentials =
    credentialsSection === undefined
      ? undefined
      : parseCredentials(credentialsSection, `${source.path}.credentials`);

  return {
    ...(credentials === undefined ? {} : { credentials }),
    models,
  };
}

function parseCredentials(
  section: Config,
  path: string,
): AiInstallationCredentials {
  rejectUnknownKeys(section, path, [
    'encryptionKey',
    'rotation',
    'precedence',
    'scopes',
    'tokenEndpoints',
  ]);

  const rawKey = section.getOptionalString('encryptionKey');
  if (rawKey === undefined) {
    throw configError(
      path,
      `the required field 'encryptionKey' is missing. Set it to the installation's personal-credential encryption key: the standard base64 encoding of exactly ${ENCRYPTION_KEY_BYTES} raw bytes, supplied through an app-config environment variable rather than committed to the file`,
    );
  }
  const encryptionKey = decodeEncryptionKey(rawKey, path, 'encryptionKey');
  const rotation = section.getOptionalConfig('rotation');
  let previousEncryptionKey: Uint8Array | undefined;
  if (rotation !== undefined) {
    const rotationPath = `${path}.rotation`;
    rejectUnknownKeys(rotation, rotationPath, ['previousEncryptionKey']);
    const previous = rotation.getOptionalString('previousEncryptionKey');
    if (previous === undefined) {
      throw configError(
        rotationPath,
        "the required field 'previousEncryptionKey' is missing",
      );
    }
    previousEncryptionKey = decodeEncryptionKey(
      previous,
      rotationPath,
      'previousEncryptionKey',
    );
  }

  const rawPrecedence = section.getOptionalString('precedence');
  if (
    rawPrecedence !== undefined &&
    !PRECEDENCES.includes(rawPrecedence as AiCredentialsPrecedence)
  ) {
    throw fieldError(
      path,
      'precedence',
      `Expected one of ${PRECEDENCES.map(p => `'${p}'`).join(
        ', ',
      )}, but got '${rawPrecedence}'`,
    );
  }
  const precedence =
    (rawPrecedence as AiCredentialsPrecedence | undefined) ?? 'user-first';

  const scopesSection = section.getOptionalConfig('scopes');
  const scopes =
    scopesSection === undefined
      ? new Map<string, ReadonlyMap<string, JsonValue>>()
      : parseScopes(scopesSection, `${path}.scopes`);

  const tokenEndpoints = parseTokenEndpoints(section, path);

  return {
    encryptionKey,
    ...(previousEncryptionKey === undefined ? {} : { previousEncryptionKey }),
    precedence,
    scopes,
    tokenEndpoints,
  };
}

/**
 * Trusted OAuth token endpoints for guarded auth operations. Every entry must
 * be an absolute https (or localhost http) URL on one of the journal-owned
 * token routes: those are the only authentication destinations an attempt may
 * record, so a configured endpoint outside them could never be audited.
 */
function parseTokenEndpoints(
  section: Config,
  path: string,
): Readonly<Record<string, AiTokenEndpoint>> {
  const sectionMap = section.getOptionalConfig('tokenEndpoints');
  if (sectionMap === undefined) {
    return {};
  }
  const endpoints: Record<string, AiTokenEndpoint> = {};
  const providers = sectionMap.keys();
  if (providers.length === 0) {
    throw fieldError(
      path,
      'tokenEndpoints',
      'Expected at least one provider endpoint, or omit the field entirely to perform no guarded auth operations',
    );
  }
  for (const providerId of providers) {
    const field = `tokenEndpoints.${providerId}`;
    if (
      providerId.length === 0 ||
      providerId.length > IDENTIFIER_MAX_LENGTH ||
      providerId !== providerId.trim() ||
      // eslint-disable-next-line no-control-regex
      /[\u0000-\u001f\u007f]/.test(providerId)
    ) {
      throw fieldError(
        field,
        'tokenEndpoints',
        'Expected each entry to be keyed by a provider ID',
      );
    }
    const entry = sectionMap.getOptionalConfig(providerId);
    if (entry === undefined) {
      throw fieldError(
        field,
        'tokenEndpoints',
        "Expected the provider's trusted token endpoint as an object with 'url' and 'clientId'",
      );
    }
    rejectUnknownKeys(entry, field, ['url', 'clientId']);
    const value = entry.getOptionalString('url');
    if (value === undefined) {
      throw fieldError(
        field,
        'url',
        "Expected the provider's trusted token endpoint URL",
      );
    }
    const clientId = entry.getOptionalString('clientId');
    if (clientId === undefined || clientId.trim() !== clientId || !clientId) {
      throw fieldError(
        field,
        'clientId',
        'Expected the public OAuth client ID of this provider family. It is public by contract and never a secret, so it belongs in configuration',
      );
    }
    let url: URL | undefined;
    try {
      url = new URL(value);
    } catch {
      url = undefined;
    }
    const isLocalTestOrigin =
      url !== undefined &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (
      url === undefined ||
      value !== value.trim() ||
      value.includes('?') ||
      value.includes('#') ||
      url.search.length > 0 ||
      url.hash.length > 0 ||
      url.username.length > 0 ||
      url.password.length > 0 ||
      (url.protocol !== 'https:' && !isLocalTestOrigin)
    ) {
      throw fieldError(
        field,
        'tokenEndpoints',
        `Expected an absolute https URL (http is accepted only for localhost test origins) without query, fragment or userinfo, but got '${value}'`,
      );
    }
    if (url.pathname !== '/oauth/token' && url.pathname !== '/v1/oauth/token') {
      throw fieldError(
        field,
        'tokenEndpoints',
        `Expected the reserved token route '/oauth/token' or '/v1/oauth/token', but got '${url.pathname}'. Model and authorization routes are not valid token endpoints`,
      );
    }
    const canonical = `${url.protocol}//${url.host}${url.pathname}`;
    if (Object.values(endpoints).some(known => known.url === canonical)) {
      throw fieldError(
        field,
        'tokenEndpoints',
        `The token endpoint '${canonical}' is configured for more than one provider`,
      );
    }
    endpoints[providerId] = Object.freeze({ url: canonical, clientId });
  }
  return endpoints;
}
function decodeEncryptionKey(
  raw: string,
  path: string,
  field: string,
): Uint8Array {
  const value = raw.trim();
  const canonical = Buffer.from(value, 'base64');
  const isBase64 =
    value.length > 0 &&
    /^[A-Za-z0-9+/]+={0,2}$/.test(value) &&
    canonical.toString('base64') === value;
  if (!isBase64) {
    throw fieldError(
      path,
      field,
      `Expected the standard base64 encoding of exactly ${ENCRYPTION_KEY_BYTES} raw bytes (as produced by 'openssl rand -base64 ${ENCRYPTION_KEY_BYTES}'), but the value is not canonical base64. The key material itself is never echoed in this error`,
    );
  }
  if (canonical.length !== ENCRYPTION_KEY_BYTES) {
    throw fieldError(
      path,
      field,
      `Expected exactly ${ENCRYPTION_KEY_BYTES} raw bytes, but the configured value decodes to ${canonical.length}. Generate ${ENCRYPTION_KEY_BYTES} bytes, base64-encode them, and keep the result in an app-config secret`,
    );
  }
  return new Uint8Array(canonical);
}

function parseScopes(section: Config, path: string): AiConfigCredentialScopes {
  const scopes = new Map<string, ReadonlyMap<string, JsonValue>>();
  for (const scopeKey of section.keys()) {
    const scopePath = `${path}.${scopeKey}`;
    // Scope keys are matched exactly, so a key like 'org:extra' can never pass
    // this schema and be rejected only by a store constructor downstream.
    if (scopeKey === 'org') {
      scopes.set('org', parseScope(section, scopeKey, scopePath));
      continue;
    }
    if (scopeKey === 'user' || scopeKey.startsWith('user:')) {
      throw configError(
        scopePath,
        `personal credentials are never supplied through installation config. Remove '${scopeKey}': user-scoped provider credentials are stored by the encrypted personal credential store, which is written by the login flow and read by the service`,
      );
    }
    if (scopeKey.startsWith('service:')) {
      const serviceId = assertIdentifier(
        scopeKey.slice('service:'.length),
        scopePath,
        'service scope id',
      );
      scopes.set(
        `service:${serviceId}`,
        parseScope(section, scopeKey, scopePath),
      );
      continue;
    }
    throw configError(
      scopePath,
      `the scope '${scopeKey}' is not supported. Use exactly 'org', or 'service:<plugin-id>' to scope credentials to one consuming plugin's service identity`,
    );
  }
  return scopes;
}

function parseScope(
  section: Config,
  scopeKey: string,
  path: string,
): ReadonlyMap<string, JsonValue> {
  const scope = section.getConfig(scopeKey);
  const providers = new Map<string, JsonValue>();
  for (const providerId of scope.keys()) {
    assertIdentifier(providerId, path, 'provider ID');
    // Opaque: the credential store constructor validates the entry's shape and
    // kind, so provider semantics stay out of this schema.
    providers.set(providerId, scope.get(providerId));
  }
  return providers;
}

function parseModels(section: Config, path: string): readonly AnyModel[] {
  const entries = section.getOptionalConfigArray('models');
  if (entries === undefined) {
    return [];
  }
  if (entries.length === 0) {
    throw configError(
      `${path}.models`,
      'the catalog is empty. Remove it, or list at least one canonical model entry with provider, modelId, api and baseUrl (plus the size fields its type requires: chat needs contextWindow and maxTokens, classifier needs contextWindow, image carries no context window)',
    );
  }

  const models: AnyModel[] = [];
  const seen = new Set<string>();
  entries.forEach((entry, index) => {
    const entryPath = `${path}.models[${index}]`;
    rejectUnknownKeys(entry, entryPath, MODEL_FIELDS);

    const provider = assertIdentifier(
      requireString(entry, 'provider', entryPath),
      entryPath,
      'provider',
    );
    if (provider.startsWith(MCP_RESERVED_PREFIX)) {
      throw fieldError(
        entryPath,
        'provider',
        `the '${MCP_RESERVED_PREFIX}' prefix is reserved for MCP tool server credentials and can never be a model provider id; configure an actual model provider`,
      );
    }
    const modelId = assertIdentifier(
      requireString(entry, 'modelId', entryPath),
      entryPath,
      'modelId',
    );
    const api = requireString(entry, 'api', entryPath);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(api)) {
      throw fieldError(
        entryPath,
        'api',
        `Expected the adapter identifier of a provider module (lowercase letters, digits and dashes, for example 'openai-responses'), but got '${api}'. Certification is decided by the model operation guard at dispatch: an adapter it has not certified is denied, never dispatched`,
      );
    }
    const baseUrl = requireString(entry, 'baseUrl', entryPath);
    let parsedUrl: URL | undefined;
    try {
      parsedUrl = new URL(baseUrl);
    } catch {
      parsedUrl = undefined;
    }
    if (
      parsedUrl === undefined ||
      (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:')
    ) {
      throw fieldError(
        entryPath,
        'baseUrl',
        `Expected an absolute http or https URL — the canonical destination of the provider adapter — but got '${baseUrl}'`,
      );
    }
    // Model type follows the pinned pi-ai catalog shapes: chat and
    // classifier models carry a context window, image models do not, and
    // only chat requires the output limit.
    const type = entry.getOptionalString('type') ?? 'chat';
    if (type !== 'chat' && type !== 'classifier' && type !== 'image') {
      throw fieldError(
        entryPath,
        'type',
        `Expected 'chat', 'classifier', or 'image', but got '${type}'`,
      );
    }
    let contextWindow: number | undefined;
    if (type === 'image') {
      if (entry.getOptionalNumber('contextWindow') !== undefined) {
        throw fieldError(
          entryPath,
          'contextWindow',
          "Image models carry no context window; remove the field or configure the entry as 'chat' or 'classifier'",
        );
      }
    } else {
      contextWindow = requirePositiveInteger(entry, 'contextWindow', entryPath);
    }
    const maxTokens =
      type === 'chat'
        ? requirePositiveInteger(entry, 'maxTokens', entryPath)
        : optionalPositiveInteger(entry, 'maxTokens', entryPath);

    const name = entry.getOptionalString('name') ?? modelId;
    assertIdentifier(name, entryPath, 'name');
    const reasoning = entry.getOptionalBoolean('reasoning') ?? false;
    const input = parseInput(entry, entryPath);
    const cost = parseCost(entry, entryPath);

    const identity = `${provider}\u0000${modelId}`;
    if (seen.has(identity)) {
      throw configError(
        entryPath,
        `the model '${provider}/${modelId}' is configured more than once. Keep exactly one entry per canonical model, because the catalog is keyed by provider and model identifier`,
      );
    }
    seen.add(identity);

    models.push({
      type,
      id: modelId,
      name,
      provider,
      api,
      baseUrl,
      input,
      cost,
      reasoning,
      ...(contextWindow === undefined ? {} : { contextWindow }),
      ...(maxTokens === undefined ? {} : { maxTokens }),
    } as unknown as AnyModel);
  });
  return models;
}

function requireString(entry: Config, field: string, path: string): string {
  const value = entry.getOptionalString(field);
  if (value === undefined || value.length === 0) {
    throw fieldError(
      path,
      field,
      `The required field '${field}' is missing or empty. Every canonical catalog entry needs the actual provider and model identifiers, the certified adapter identifier, the canonical base URL, and the model's context window and output limit`,
    );
  }
  return value;
}

/** Optional positive integer: absent is fine, present must be valid. */
function optionalPositiveInteger(
  entry: Config,
  field: string,
  path: string,
): number | undefined {
  const value = entry.getOptionalNumber(field);
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw fieldError(
      path,
      field,
      `Expected a positive integer number of tokens, but got '${value}'`,
    );
  }
  return value;
}

function requirePositiveInteger(
  entry: Config,
  field: string,
  path: string,
): number {
  const value = entry.getOptionalNumber(field);
  if (value === undefined) {
    throw fieldError(
      path,
      field,
      `The required field '${field}' is missing. Set it to the model's ${field} in tokens; the engine derives sizing and compaction from it, so this schema never invents a value`,
    );
  }
  if (!Number.isInteger(value) || value <= 0) {
    throw fieldError(
      path,
      field,
      `Expected a positive integer count of tokens, but got '${value}'`,
    );
  }
  return value;
}

function parseInput(entry: Config, path: string): ModelInputModality[] {
  const values = entry.getOptionalStringArray('input');
  if (values === undefined) {
    return ['text'];
  }
  if (values.length === 0) {
    throw fieldError(
      path,
      'input',
      "Expected at least one input modality: 'text', 'image'",
    );
  }
  for (const value of values) {
    if (!INPUT_MODALITIES.includes(value as ModelInputModality)) {
      throw fieldError(
        path,
        'input',
        `Expected only ${INPUT_MODALITIES.map(m => `'${m}'`).join(
          ', ',
        )}, but got '${value}'`,
      );
    }
  }
  if (new Set(values).size !== values.length) {
    throw fieldError(path, 'input', 'Expected each modality at most once');
  }
  return values as ModelInputModality[];
}

function parseCost(
  entry: Config,
  path: string,
): Record<(typeof COST_FIELDS)[number], number> {
  const costSection = entry.getOptionalConfig('cost');
  const cost: Record<(typeof COST_FIELDS)[number], number> = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
  };
  if (costSection === undefined) {
    return cost;
  }
  rejectUnknownKeys(costSection, `${path}.cost`, COST_FIELDS);
  for (const field of COST_FIELDS) {
    const value = costSection.getOptionalNumber(field);
    if (value === undefined) {
      continue;
    }
    if (!Number.isFinite(value) || value < 0) {
      throw fieldError(
        `${path}.cost`,
        field,
        `Expected a non-negative cost in USD per million tokens, but got '${value}'`,
      );
    }
    cost[field] = value;
  }
  return cost;
}
