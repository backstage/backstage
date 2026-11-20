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

import { InputError } from '@backstage/errors';
import { CatalogScmEvent } from '@backstage/plugin-catalog-node/alpha';

/**
 * Options for {@link analyzeGerritWebhookEvent}.
 * @alpha
 */
export interface AnalyzeGerritWebhookEventOptions {
  /**
   * The Gitiles base URL of the Gerrit instance that sent the event, as found
   * in the `integrations.gerrit` config.
   */
  gitilesBaseUrl: string;
}

/**
 * The result of analyzing a Gerrit webhook event.
 *
 * - `ok` - one or more catalog SCM events were produced.
 * - `ignored` - the event was valid but not relevant.
 * - `aborted` - the event could not be fully processed due to missing data.
 * - `unsupported-event` - the event type is not handled by this analyzer.
 *
 * @alpha
 */
export type AnalyzeGerritWebhookEventResult =
  | {
      result: 'unsupported-event';
      event: string;
    }
  | {
      result: 'ignored';
      reason: string;
    }
  | {
      result: 'aborted';
      reason: string;
    }
  | {
      result: 'ok';
      events: CatalogScmEvent[];
    };

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as JsonObject;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

/**
 * Returns the branch name for a ref, or undefined if the ref isn't a branch.
 *
 * Older Gerrit versions send the short branch name instead of the full ref.
 */
function getBranchName(refName: string): string | undefined {
  if (refName.startsWith('refs/heads/')) {
    return refName.slice('refs/heads/'.length) || undefined;
  }
  if (refName.startsWith('refs/')) {
    return undefined;
  }
  return refName;
}

async function onRefUpdatedEvent(
  payload: JsonObject,
  options: AnalyzeGerritWebhookEventOptions,
): Promise<AnalyzeGerritWebhookEventResult> {
  const refUpdate = asObject(payload.refUpdate);
  const project = asString(refUpdate?.project);
  const refName = asString(refUpdate?.refName);

  if (!project || !refName) {
    return {
      result: 'aborted',
      reason:
        'Gerrit ref-updated event did not include refUpdate.project and refUpdate.refName',
    };
  }

  const branch = getBranchName(refName);
  if (!branch) {
    return {
      result: 'ignored',
      reason: `Gerrit ref-updated event for ${refName} is not a branch update`,
    };
  }

  let gitilesBaseUrl = options.gitilesBaseUrl;
  while (gitilesBaseUrl.endsWith('/')) {
    gitilesBaseUrl = gitilesBaseUrl.slice(0, -1);
  }

  return {
    result: 'ok',
    events: [
      {
        type: 'repository.updated',
        url: `${gitilesBaseUrl}/${project}/+/refs/heads/${branch}`,
      },
    ],
  };
}

/**
 * Analyzes a Gerrit webhook or stream event and translates it into zero or
 * more catalog SCM events that entity providers can act on.
 *
 * Gerrit events don't say which Gerrit instance they came from, so the caller
 * has to supply the Gitiles base URL of that instance through the options.
 *
 * Gerrit ref updates don't include file-level change data, so only
 * repository-level events are produced, scoped to the updated branch.
 *
 * Supported event types:
 * - `ref-updated` - emits a `repository.updated` event for the updated branch,
 *   so that entities registered from that branch are refreshed. Updates to
 *   tags and other non-branch refs, such as changes and meta refs, are ignored.
 *
 * @alpha
 */
export async function analyzeGerritWebhookEvent(
  eventType: string,
  eventPayload: unknown,
  options: AnalyzeGerritWebhookEventOptions,
): Promise<AnalyzeGerritWebhookEventResult> {
  const payload = asObject(eventPayload);
  if (!payload) {
    throw new InputError('Gerrit webhook event payload is not an object');
  }

  switch (eventType) {
    case 'ref-updated':
      return onRefUpdatedEvent(payload, options);
    default:
      return { result: 'unsupported-event', event: eventType };
  }
}
