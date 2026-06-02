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

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/**
 * Builds the repository URL from a Bitbucket Server webhook payload.
 *
 * Bitbucket Server includes repository links in the payload under
 * `repository.links.self[0].href`, e.g.:
 * https://bitbucket.example.com/projects/PROJ/repos/my-repo/browse
 *
 * We normalise this to the repo root by stripping trailing `/browse`.
 */
function getRepositoryUrl(payload: JsonObject): string | undefined {
  const repository = asObject(payload.repository);
  if (!repository) {
    return undefined;
  }

  const links = asObject(repository.links);
  const selfLinks = links?.self;
  if (Array.isArray(selfLinks) && selfLinks.length > 0) {
    const href = asString(asObject(selfLinks[0])?.href);
    if (href) {
      return href.replace(/\/browse$/, '');
    }
  }

  // Fallback: construct URL from project key and repo slug
  const projectKey = asString(asObject(repository.project)?.key);
  const slug = asString(repository.slug);
  if (projectKey && slug) {
    // We cannot know the base URL without more context, so abort
    return undefined;
  }

  return undefined;
}

/**
 * Handles `repo:refs_changed` events (branch push / tag push).
 *
 * Bitbucket Server does not include file-level diff information in the webhook
 * payload, so we emit a `repository.updated` event for the repository to
 * trigger a full re-ingestion of catalog-info.yaml files.
 */
async function onRefsChangedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketServerWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(payload);

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Server repo:refs_changed event did not include a resolvable repository URL',
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.updated', url: repositoryUrl }],
  };
}

/**
 * Handles `repo:modified` events (repository renamed or description changed).
 *
 * When a repository is renamed, Bitbucket Server provides both `old` and `new`
 * repository objects in the payload. We emit a `repository.moved` event so
 * that the catalog can update location URLs accordingly.
 */
async function onRepoModifiedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketServerWebhookEventResult> {
  const newRepo = asObject(payload.new);
  const oldRepo = asObject(payload.old);

  const newLinks = asObject(newRepo?.links);
  const newSelfLinks = newLinks?.self;
  let newUrl: string | undefined;
  if (Array.isArray(newSelfLinks) && newSelfLinks.length > 0) {
    const href = asString(asObject(newSelfLinks[0])?.href);
    if (href) {
      newUrl = href.replace(/\/browse$/, '');
    }
  }

  const oldLinks = asObject(oldRepo?.links);
  const oldSelfLinks = oldLinks?.self;
  let oldUrl: string | undefined;
  if (Array.isArray(oldSelfLinks) && oldSelfLinks.length > 0) {
    const href = asString(asObject(oldSelfLinks[0])?.href);
    if (href) {
      oldUrl = href.replace(/\/browse$/, '');
    }
  }

  if (!newUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Server repo:modified event did not include a resolvable new repository URL',
    };
  }

  if (oldUrl && oldUrl !== newUrl) {
    return {
      result: 'ok',
      events: [
        {
          type: 'repository.moved',
          fromUrl: oldUrl,
          toUrl: newUrl,
        },
      ],
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.updated', url: newUrl }],
  };
}

/**
 * Handles `repo:deleted` events.
 */
async function onRepoDeletedEvent(
  payload: JsonObject,
): Promise<AnalyzeBitbucketServerWebhookEventResult> {
  const repositoryUrl = getRepositoryUrl(payload);

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason:
        'Bitbucket Server repo:deleted event did not include a resolvable repository URL',
    };
  }

  return {
    result: 'ok',
    events: [{ type: 'repository.deleted', url: repositoryUrl }],
  };
}

/**
 * Analyzes a Bitbucket Server webhook event and translates it into zero or
 * more catalog SCM events that entity providers can act on.
 *
 * Supported event types (matching the `x-event-key` header set by Bitbucket
 * Server and routed by `BitbucketServerEventRouter`):
 *
 * - `repo:refs_changed` — emits `repository.updated` to trigger catalog
 *   refresh when a branch or tag is pushed.
 * - `repo:modified` — emits `repository.moved` when a repository is renamed,
 *   or `repository.updated` for other metadata changes.
 * - `repo:deleted` — emits `repository.deleted` to remove stale locations.
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
      return onRepoModifiedEvent(payload);
    case 'repo:deleted':
      return onRepoDeletedEvent(payload);
    default:
      return { result: 'unsupported-event', event: eventType };
  }
}
