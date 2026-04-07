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
 * The result of analyzing a Bitbucket Cloud webhook event.
 *
 * - `ok` — one or more catalog SCM events were produced.
 * - `ignored` — the event was valid but not relevant.
 * - `aborted` — the event could not be fully processed due to missing data.
 * - `unsupported-event` — the event type is not handled by this analyzer.
 *
 * @alpha
 */
export type AnalyzeBitbucketCloudWebhookEventResult =
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
  return typeof value === 'string' ? value : undefined;
}

function getRepositoryUrl(payload: JsonObject): string | undefined {
  const repository = asObject(payload.repository);
  if (!repository) {
    return undefined;
  }
  const links = asObject(repository.links);
  const html = asObject(links?.html);
  return asString(html?.href);
}

function getOldRepositoryUrl(payload: JsonObject): string | undefined {
  const changes = asObject(payload.changes);
  if (!changes) {
    return undefined;
  }

  const linksChange = asObject(changes.links);
  if (linksChange) {
    const oldLinks = asObject(linksChange.old);
    const html = asObject(oldLinks?.html);
    const href = asString(html?.href);
    if (href) {
      return href;
    }
  }

  const fullNameChange = asObject(changes.full_name);
  const oldFullName = asString(fullNameChange?.old);
  if (oldFullName) {
    return `https://bitbucket.org/${oldFullName}`;
  }

  return undefined;
}

async function onPushEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketCloudWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(payload);

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Cloud repo:push event did not include repository.links.html.href',
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.updated', url: repositoryUrl }],
  };
}

async function onRepoUpdatedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketCloudWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(payload);
  const oldRepositoryUrl = getOldRepositoryUrl(payload);

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Cloud repo:updated event did not include repository.links.html.href',
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

async function onRepoTransferEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketCloudWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(payload);
  const oldRepositoryUrl = getOldRepositoryUrl(payload);

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Cloud repo:transfer event did not include repository.links.html.href',
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

async function onRepoDeletedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketCloudWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(payload);

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Cloud repo:deleted event did not include repository.links.html.href',
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.deleted', url: repositoryUrl }],
  };
}

/**
 * Analyzes a Bitbucket Cloud webhook event and translates it into zero or more
 * catalog SCM events that entity providers can act on.
 *
 * Bitbucket Cloud push payloads do not include file-level change data, so only
 * repository-level events are produced (unlike GitLab and Azure DevOps
 * analyzers which can emit fine-grained `location.*` events).
 *
 * Supported event types:
 * - `repo:push` — emits a `repository.updated` event to trigger catalog
 *   refresh for the repository.
 * - `repo:updated` — translates repository renames into `repository.moved`
 *   events, or emits `repository.updated` for other metadata changes.
 * - `repo:transfer` — translates repository transfers into `repository.moved`
 *   events.
 * - `repo:deleted` — emits a `repository.deleted` event.
 *
 * @alpha
 */
export async function analyzeBitbucketCloudWebhookEvent(
  eventType: string,
  eventPayload: unknown,
): Promise<AnalyzeBitbucketCloudWebhookEventResult> {
  const payload = asObject(eventPayload);
  if (!payload) {
    throw new InputError(
      'Bitbucket Cloud webhook event payload is not an object',
    );
  }

  switch (eventType) {
    case 'repo:push':
      return onPushEvent(payload);
    case 'repo:updated':
      return onRepoUpdatedEvent(payload);
    case 'repo:transfer':
      return onRepoTransferEvent(payload);
    case 'repo:deleted':
      return onRepoDeletedEvent(payload);
    default:
      return { result: 'unsupported-event', event: eventType };
  }
}
