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

import type { Fence } from '../contracts';
import type { AttemptOutcome, RecoveryEvent } from './types';

const MAX_TEXT_LENGTH = 512;
const MAX_LIMIT = 500;
const DEFAULT_LIMIT = 100;

/**
 * The closed vocabulary of classified operation names. An operation is a
 * classification, not free text: unknown names fail closed so an unclassified
 * code path can never reach durable audit storage.
 */
const OPERATIONS: ReadonlySet<string> = new Set([
  'models.stream',
  'models.complete',
  'models.streamSimple',
  'models.completeSimple',
  'models.streamDeferred',
  'models.fetchDeferred',
  'models.cancelDeferred',
  'models.classify',
  'models.generateImages',
  'auth.token',
  'auth.token-exchange',
]);

/**
 * Strongly identifiable credential formats: GitHub PATs, Slack tokens,
 * AWS/Google keys, JWTs, key material, and the letter-guarded short
 * OpenAI/Anthropic-style prefixes. They match wherever they occur,
 * including directly adjoining label characters: a prefixed or embedded
 * credential value must not survive by hiding behind a word boundary or an
 * encoded separator.
 */
const KNOWN_CREDENTIAL_FORMATS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{30,}/,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/,
  // The sk-/rk-/pk- prefixes are too short to match unguarded (they occur
  // inside ordinary hyphenated words like "task-"), so they are rejected
  // only when not directly preceded by a letter.
  /(?<![A-Za-z])(?:sk-(?:ant-|proj-)?|rk-|pk-)[A-Za-z0-9_-]{20,}/,
];

/**
 * Generic value shapes: assignments, bearer values, and long
 * separator-free high-entropy runs. These run both over whole fields and,
 * for destinations, over each structured component individually, so a
 * benign dictionary route is never one long run while a long single
 * component still fails closed.
 */
const GENERIC_VALUE_SHAPES = [
  /\bbearer\s+[A-Za-z0-9._~+/=-]{6,}/i,
  /\b(?:api[_-]?key|apikey|token|secret|password|passwd|credential|access[_-]?token|refresh[_-]?token|authorization)\s*[=:]\s*\S{8,}/i,
  /[A-Za-z0-9+/=_-]{48,}/,
];

/**
 * Rejects a contiguous base64/bearer-shaped value that merely contains a
 * '/' (or an encoded '%2F' decoded before this check): the candidate
 * charset includes the separator, so splitting the value across a slash
 * cannot divide it into innocent pieces. Dictionary-word routes survive
 * because a route run must also be high-entropy: at least six digits, six
 * uppercase and six lowercase characters inside one run, which ordinary
 * resource paths never have and random base64 always does.
 */
function assertNoSlashBearingHighEntropy(text: string, field: string): void {
  for (const match of text.matchAll(/[A-Za-z0-9+/=_-]{48,}/g)) {
    const run = match[0];
    if (
      countWhere(run, /[0-9]/) >= 6 &&
      countWhere(run, /[A-Z]/) >= 6 &&
      countWhere(run, /[a-z]/) >= 6
    ) {
      throw new Error(
        `Invalid ${field}: value is secret-shaped; redact it before recording a journal event`,
      );
    }
  }
}

function countWhere(text: string, pattern: RegExp): number {
  return (text.match(new RegExp(pattern.source, 'g')) ?? []).length;
}

/**
 * Validates one free-text journal field: bounded, trimmed, control-character
 * free and free of credential value shapes. Returns `undefined` only for
 * absent optional fields; anything present must pass or the append is
 * rejected.
 */
export function assertRedactedText(
  value: unknown,
  field: string,
  options: { required?: boolean } = {},
): string | undefined {
  if (value === undefined) {
    if (options.required) {
      throw new Error(`Invalid ${field}: required`);
    }
    return undefined;
  }
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_TEXT_LENGTH ||
    value !== value.trim() ||
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error(
      `Invalid ${field}: expected a non-empty string of at most ${MAX_TEXT_LENGTH} characters without control characters or surrounding whitespace`,
    );
  }
  for (const pattern of [
    ...KNOWN_CREDENTIAL_FORMATS,
    ...GENERIC_VALUE_SHAPES,
  ]) {
    if (pattern.test(value)) {
      throw new Error(
        `Invalid ${field}: value is secret-shaped; redact it before recording a journal event`,
      );
    }
  }
  assertNoSlashBearingHighEntropy(value, field);
  return value;
}

/**
 * Validates the redacted actor by NORMALIZATION, not by grammar.
 *
 * The value must be the authenticated principal exactly as Backstage
 * presents it — a user principal's `userEntityRef`, or a service
 * principal's opaque `subject` (native forms include `plugin:<id>` and
 * JWKS-issuer subjects like `external:issuer:billing-api` or
 * `external:repo:org/repo:ref:refs/heads/main`, whose `sub` may contain
 * colons and slashes). Because Backstage authenticated subjects are
 * open-ended opaque strings, no structural grammar is imposed: only length
 * bounds, control-character rejection and credential-value checks apply.
 * The identical normalization derives the reader principal in `read()`, so
 * owner equality is exact-string on this normalized form.
 */
export function assertPrincipalRef(value: unknown): string {
  return assertRedactedText(value, 'actor', { required: true })!;
}

/**
 * Rejects strongly identifiable credential formats anywhere in a decoded
 * string, separators included.
 */
function assertNoKnownFormats(text: string, field: string): void {
  for (const pattern of KNOWN_CREDENTIAL_FORMATS) {
    if (pattern.test(text)) {
      throw new Error(
        `Invalid ${field}: value is secret-shaped; redact it before recording a journal event`,
      );
    }
  }
}

/**
 * Rejects generic value shapes (assignments, bearer values, long
 * separator-free runs) in one bounded component.
 */
function assertNoGenericShapes(text: string, field: string): void {
  for (const pattern of GENERIC_VALUE_SHAPES) {
    if (pattern.test(text)) {
      throw new Error(
        `Invalid ${field}: value is secret-shaped; redact it before recording a journal event`,
      );
    }
  }
}

/**
 * Validates an operation name against the closed classification vocabulary.
 * Operations never run free-text secret checks: `auth.token` is a
 * classification the audit trail must be able to record.
 */
export function assertOperation(value: unknown): string {
  if (typeof value !== 'string' || !OPERATIONS.has(value)) {
    throw new Error(
      `Invalid operation: expected one of ${[...OPERATIONS].join(', ')}`,
    );
  }
  return value;
}

/**
 * Validates a canonical attempt destination: a bare http(s) URL consisting
 * of origin and path only, checked structurally. The path may legitimately
 * contain words like `token`; query strings, fragments, userinfo and any
 * other component fail closed.
 */
export function assertDestination(
  value: unknown,
  field = 'destination',
): string | undefined {
  if (value === undefined) return undefined;
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_TEXT_LENGTH ||
    value !== value.trim() ||
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001f\u007f\s]/.test(value)
  ) {
    throw new Error(
      `Invalid ${field}: expected a canonical http(s) URL of origin and path only`,
    );
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `Invalid ${field}: expected a canonical http(s) URL of origin and path only`,
    );
  }
  if (
    (url.protocol !== 'https:' && url.protocol !== 'http:') ||
    url.host.length === 0 ||
    url.search.length > 0 ||
    url.hash.length > 0 ||
    url.username.length > 0 ||
    url.password.length > 0
  ) {
    throw new Error(
      `Invalid ${field}: must be an https (or http) origin and path without query string, fragment or userinfo`,
    );
  }
  // The path is part of the audit record, so a credential value hidden in a
  // path segment is rejected just like one in free text. Detection is
  // two-layer. Over the WHOLE decoded destination, strongly identifiable
  // formats and slash-bearing high-entropy values are caught with the
  // separator inside the candidate, so a value split across a literal or
  // encoded '/' cannot divide itself into innocent pieces. Then the GENERIC
  // entropy/length rules run per structured component (host, then each
  // decoded path segment), so benign dictionary-word routes such as Azure
  // or Vertex paths are never one long entropy run while a long
  // single-component value still fails closed.
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    throw new Error(`Invalid ${field}: path is not valid percent-encoding`);
  }
  assertNoKnownFormats(`${url.host}${decodedPath}`, field);
  assertNoSlashBearingHighEntropy(`${url.host}${decodedPath}`, field);
  const components = [
    url.host,
    ...decodedPath.split('/').filter(segment => segment.length > 0),
  ];
  for (const component of components) {
    assertNoGenericShapes(component, field);
  }
  return `${url.origin}${url.pathname}`;
}

/**
 * Rejects objects with fields outside the journal's closed field set. Unknown
 * keys fail closed so a caller cannot smuggle a prompt, header or payload
 * into durable storage through an extra property.
 */
export function assertShape(
  value: unknown,
  fields: Readonly<Record<string, 'required' | 'optional'>>,
  what: string,
): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${what}: expected an object`);
  }
  const present = Object.keys(value);
  for (const key of present) {
    if (!(key in fields)) {
      throw new Error(
        `Invalid ${what}: unknown field "${key}"; journal events accept only ${Object.keys(
          fields,
        ).join(', ')}`,
      );
    }
  }
  for (const [key, mode] of Object.entries(fields)) {
    if (
      mode === 'required' &&
      (value as Record<string, unknown>)[key] === undefined
    ) {
      throw new Error(`Invalid ${what}: field "${key}" is required`);
    }
  }
}

function assertOrdinal(value: unknown, field: string): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > 1_000_000_000
  ) {
    throw new Error(
      `Invalid ${field}: expected a non-negative safe integer ordinal`,
    );
  }
  return value;
}

/**
 * Parsed, fully redacted decision ready for durable storage.
 *
 * @internal
 */
export type ParsedDecision = {
  actor: string;
  conversationId?: string;
  taskId?: string;
  callId?: string;
  definitionVersion: string;
  configVersion: string;
  provider?: string;
  model?: string;
  operation: string;
  destination?: string;
  attempt: number;
  decision: 'allow' | 'deny';
  reason?: string;
};

export function parseDecision(event: unknown): ParsedDecision {
  assertShape(
    event,
    {
      actor: 'required',
      conversationId: 'optional',
      taskId: 'optional',
      callId: 'optional',
      definitionVersion: 'required',
      configVersion: 'required',
      provider: 'optional',
      model: 'optional',
      operation: 'required',
      destination: 'optional',
      attempt: 'required',
      decision: 'required',
      reason: 'optional',
    },
    'attempt decision',
  );
  const source = event as Record<string, unknown>;
  if (source.decision !== 'allow' && source.decision !== 'deny') {
    throw new Error(
      'Invalid attempt decision: "decision" must be "allow" or "deny"',
    );
  }
  return {
    actor: assertPrincipalRef(source.actor),
    conversationId: assertRedactedText(source.conversationId, 'conversationId'),
    taskId: assertRedactedText(source.taskId, 'taskId'),
    callId: assertRedactedText(source.callId, 'callId'),
    definitionVersion: assertRedactedText(
      source.definitionVersion,
      'definitionVersion',
      { required: true },
    )!,
    configVersion: assertRedactedText(source.configVersion, 'configVersion', {
      required: true,
    })!,
    provider: assertRedactedText(source.provider, 'provider'),
    model: assertRedactedText(source.model, 'model'),
    operation: assertOperation(source.operation),
    destination: assertDestination(source.destination),
    attempt: assertOrdinal(source.attempt, 'attempt'),
    decision: source.decision,
    reason: assertRedactedText(source.reason, 'reason'),
  };
}

/**
 * Parsed, fully redacted outcome ready for durable storage.
 *
 * @internal
 */
export type ParsedOutcome = {
  status: AttemptOutcome['status'];
  httpStatus?: number;
  detail?: string;
};

const OUTCOME_STATUSES = [
  'completed',
  'failed',
  'cancelled',
  'stream-failed',
  'unknown',
] as const;

export function parseOutcome(outcome: unknown): ParsedOutcome {
  assertShape(
    outcome,
    { status: 'required', httpStatus: 'optional', detail: 'optional' },
    'attempt outcome',
  );
  const source = outcome as Record<string, unknown>;
  if (!OUTCOME_STATUSES.includes(source.status as never)) {
    throw new Error(
      `Invalid attempt outcome: "status" must be one of ${OUTCOME_STATUSES.join(
        ', ',
      )}`,
    );
  }
  let httpStatus: number | undefined;
  if (source.httpStatus !== undefined) {
    if (
      typeof source.httpStatus !== 'number' ||
      !Number.isSafeInteger(source.httpStatus) ||
      source.httpStatus < 100 ||
      source.httpStatus > 599
    ) {
      throw new Error(
        'Invalid attempt outcome: "httpStatus" must be an integer between 100 and 599',
      );
    }
    httpStatus = source.httpStatus;
  }
  return {
    status: source.status as ParsedOutcome['status'],
    httpStatus,
    detail: assertRedactedText(source.detail, 'outcome detail'),
  };
}

/**
 * Parsed, fully redacted recovery event ready for durable storage.
 *
 * @internal
 */
export type ParsedRecovery = {
  actor: string;
  kind: RecoveryEvent['kind'];
  conversationId?: string;
  taskId?: string;
  callId?: string;
  definitionVersion?: string;
  configVersion?: string;
  detail?: string;
};

const RECOVERY_KINDS = [
  'needs-reauth',
  'blocked-definition',
  'unknown-dispatch',
  'other',
] as const;

export function parseRecovery(event: unknown): ParsedRecovery {
  assertShape(
    event,
    {
      actor: 'required',
      kind: 'required',
      conversationId: 'optional',
      taskId: 'optional',
      callId: 'optional',
      definitionVersion: 'optional',
      configVersion: 'optional',
      detail: 'optional',
    },
    'recovery event',
  );
  const source = event as Record<string, unknown>;
  if (!RECOVERY_KINDS.includes(source.kind as never)) {
    throw new Error(
      `Invalid recovery event: "kind" must be one of ${RECOVERY_KINDS.join(
        ', ',
      )}`,
    );
  }
  return {
    actor: assertPrincipalRef(source.actor),
    kind: source.kind as ParsedRecovery['kind'],
    conversationId: assertRedactedText(source.conversationId, 'conversationId'),
    taskId: assertRedactedText(source.taskId, 'taskId'),
    callId: assertRedactedText(source.callId, 'callId'),
    definitionVersion: assertRedactedText(
      source.definitionVersion,
      'definitionVersion',
    ),
    configVersion: assertRedactedText(source.configVersion, 'configVersion'),
    detail: assertRedactedText(source.detail, 'recovery detail'),
  };
}

/**
 * Parsed audit read query.
 *
 * @internal
 */
export type ParsedQuery = {
  pluginId: string;
  sessionId: string;
  cursor?: string;
  limit: number;
};

export function parseAuditQuery(query: unknown): ParsedQuery {
  assertShape(
    query,
    {
      pluginId: 'required',
      sessionId: 'required',
      cursor: 'optional',
      limit: 'optional',
    },
    'audit query',
  );
  const source = query as Record<string, unknown>;
  let limit = DEFAULT_LIMIT;
  if (source.limit !== undefined) {
    if (
      typeof source.limit !== 'number' ||
      !Number.isSafeInteger(source.limit) ||
      source.limit < 1 ||
      source.limit > MAX_LIMIT
    ) {
      throw new Error(
        `Invalid audit query: "limit" must be an integer between 1 and ${MAX_LIMIT}`,
      );
    }
    limit = source.limit;
  }
  return {
    pluginId: assertRedactedText(source.pluginId, 'pluginId', {
      required: true,
    })!,
    sessionId: assertRedactedText(source.sessionId, 'sessionId', {
      required: true,
    })!,
    cursor: parseCursor(source.cursor),
    limit,
  };
}

function parseCursor(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error('Invalid audit query: "cursor" is not a valid cursor');
  }
  return value;
}

/**
 * Validates a fence and returns its namespace key and lease lookup values.
 *
 * @internal
 */
export function parseFence(fence: Fence): {
  pluginId: string;
  sessionId: string;
  owner: string;
  token: string;
} {
  if (typeof fence !== 'object' || fence === null) {
    throw new Error('Invalid fence: expected an object');
  }
  assertShape(
    fence.namespace,
    { pluginId: 'required', sessionId: 'required' },
    'fence namespace',
  );
  const namespace = fence.namespace as Record<string, unknown>;
  const owner = assertRedactedText(fence.owner, 'fence owner', {
    required: true,
  })!;
  const token = fence.token;
  if (typeof token !== 'string' || !/^(0|[1-9][0-9]*)$/.test(token)) {
    throw new Error(
      'Invalid fence: "token" must be a non-negative decimal string',
    );
  }
  return {
    pluginId: assertRedactedText(namespace.pluginId, 'pluginId', {
      required: true,
    })!,
    sessionId: assertRedactedText(namespace.sessionId, 'sessionId', {
      required: true,
    })!,
    owner,
    token,
  };
}

/**
 * Validates an {@link import('./types').AttemptId} string.
 *
 * @internal
 */
export function parseAttemptId(value: string): string {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error('Invalid attempt ID: expected a decimal string');
  }
  return value;
}
