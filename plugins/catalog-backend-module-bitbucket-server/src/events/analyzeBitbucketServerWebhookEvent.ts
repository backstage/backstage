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
 * The result of analyzing a Bitbucket Server webhook event.
 *
 * - `ok` — one or more catalog SCM events were produced.
 * - `ignored` — the event was valid but not relevant.
 * - `aborted` — the event could not be fully processed due to missing data.
 * - `unsupported-event` — the event type is not handled by this analyzer.
 *
 * @alpha
 */
export type AnalyzeBitbucketServerWebhookEventResult =
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

function asArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getRepositoryUrl(
  repository: JsonObject | undefined,
): string | undefined {
  const links = asObject(repository?.links);
  const self = asArray(links?.self);
  const first = asObject(self?.[0]);
  return asString(first?.href);
}

async function onRefsChangedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketServerWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(asObject(payload.repository));

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Server repo:refs_changed event did not include repository.links.self[0].href',
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.updated', url: repositoryUrl }],
  };
}

async function onModifiedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketServerWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(asObject(payload.new));
  const oldRepositoryUrl = getRepositoryUrl(asObject(payload.old));

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Server repo:modified event did not include new.links.self[0].href',
    };
  }

  if (oldRepositoryUrl && oldRepositoryUrl !== repositoryUrl) {
    return {
      result: 'ok',
      events: [
        {
          type: 'repository.moved',
          fromUrl: oldRepositoryUrl,
          toUrl: repositoryUrl,
        },
      ],
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.updated', url: repositoryUrl }],
  };
}

/**
 * Analyzes a Bitbucket Server webhook event and translates it into zero or more
 * catalog SCM events that entity providers can act on.
 *
 * Bitbucket Server push payloads do not include file-level change data, so only
 * repository-level events are produced (unlike the GitLab and Azure DevOps
 * analyzers which can emit fine-grained `location.*` events). Bitbucket Server
 * does not emit a repository deletion webhook, so no `repository.deleted` event
 * is produced.
 *
 * Supported event types:
 * - `repo:refs_changed` — emits a `repository.updated` event to trigger catalog
 *   refresh for the repository.
 * - `repo:modified` — translates repository renames into `repository.moved`
 *   events, or emits `repository.updated` for other metadata changes.
 *
 * @alpha
 */
export async function analyzeBitbucketServerWebhookEvent(
  eventType: string,
  eventPayload: unknown,
): Promise<AnalyzeBitbucketServerWebhookEventResult> {
  const payload = asObject(eventPayload);
  if (!payload) {
    throw new InputError(
      'Bitbucket Server webhook event payload is not an object',
    );
  }

  switch (eventType) {
    case 'repo:refs_changed':
      return onRefsChangedEvent(payload);
    case 'repo:modified':
      return onModifiedEvent(payload);
    default:
      return { result: 'unsupported-event', event: eventType };
  }
}
