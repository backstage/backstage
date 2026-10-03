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

import { LoggerService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { CatalogScmEvent } from '@backstage/plugin-catalog-node/alpha';

type StringRecord = Record<string, unknown>;

/**
 * Options for {@link analyzeGiteaWebhookEvent}.
 * @alpha
 */
export interface AnalyzeWebhookEventOptions {
  /** Optional logger for debug output when events are ignored or unsupported. */
  logger?: LoggerService;
  /**
   * Predicate that returns true for file paths that are relevant to the
   * catalog (e.g. paths ending in `.yaml` or `.yml`).
   */
  isRelevantPath: (path: string) => boolean;
}

/**
 * The result of analyzing a Gitea webhook event.
 *
 * - `ok` — one or more catalog SCM events were produced.
 * - `ignored` — the event was valid but not relevant (e.g. push to a
 *   non-default branch, or no catalog files affected).
 * - `aborted` — the event could not be fully processed due to missing data.
 * - `unsupported-event` — the event type is not handled by this analyzer.
 *
 * @alpha
 */
export type AnalyzeWebhookEventResult =
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

type PathState =
  | {
      type: 'added';
      commitUrl?: string;
    }
  | {
      type: 'removed';
      commitUrl?: string;
    }
  | {
      type: 'changed';
      commitUrl?: string;
    };

type GiteaPushCommit = {
  id?: string;
  url?: string;
  added?: string[];
  removed?: string[];
  modified?: string[];
};

type GiteaPushEvent = {
  ref?: string;
  compare_url?: string;
  commits?: GiteaPushCommit[];
  total_commits?: number;
  repository?: {
    html_url?: string;
    full_name?: string;
    default_branch?: string;
  };
};

type GiteaRepositoryEvent = {
  action?: string;
  repository?: {
    html_url?: string;
    full_name?: string;
    name?: string;
  };
  changes?: {
    name?: {
      from?: string;
    };
  };
};

function isObject(value: unknown): value is StringRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function extractBranchName(ref?: string): string | undefined {
  if (!ref || !ref.startsWith('refs/heads/')) {
    return undefined;
  }
  return ref.slice('refs/heads/'.length);
}

function getCommitUrl(
  commit: GiteaPushCommit,
  repositoryUrl?: string,
): string | undefined {
  if (commit.url) {
    return commit.url;
  }
  if (commit.id && repositoryUrl) {
    return `${repositoryUrl}/commit/${commit.id}`;
  }
  return undefined;
}

function pathStateToCatalogScmEvent(
  path: string,
  event: PathState,
  repositoryUrl: string,
  branch: string,
): CatalogScmEvent {
  const toFileUrl = (p: string) => `${repositoryUrl}/src/branch/${branch}/${p}`;
  const context = event.commitUrl ? { commitUrl: event.commitUrl } : undefined;

  switch (event.type) {
    case 'added':
      return {
        type: 'location.created',
        url: toFileUrl(path),
        context,
      };
    case 'removed':
      return {
        type: 'location.deleted',
        url: toFileUrl(path),
        context,
      };
    case 'changed':
      return {
        type: 'location.updated',
        url: toFileUrl(path),
        context,
      };
    default:
      // @ts-expect-error Intentionally expected, to check for exhaustive checking of the types
      throw new Error(`Unknown file event type: ${event.type}`);
  }
}

function applyAddedPath(
  pathState: Map<string, PathState>,
  path: string,
  commitUrl: string | undefined,
) {
  const previous = pathState.get(path);
  if (!previous) {
    pathState.set(path, { type: 'added', commitUrl });
    return;
  }
  if (previous.type === 'removed') {
    pathState.set(path, { type: 'changed', commitUrl });
    return;
  }
  pathState.set(path, previous);
}

function applyRemovedPath(
  pathState: Map<string, PathState>,
  path: string,
  commitUrl: string | undefined,
) {
  const previous = pathState.get(path);
  if (!previous) {
    pathState.set(path, { type: 'removed', commitUrl });
    return;
  }
  if (previous.type === 'added') {
    pathState.delete(path);
    return;
  }
  if (previous.type === 'changed') {
    pathState.set(path, { type: 'removed', commitUrl });
    return;
  }
  pathState.set(path, previous);
}

function applyModifiedPath(
  pathState: Map<string, PathState>,
  path: string,
  commitUrl: string | undefined,
) {
  const previous = pathState.get(path);
  if (!previous) {
    pathState.set(path, { type: 'changed', commitUrl });
    return;
  }
  pathState.set(path, previous);
}

async function onPushEvent(
  event: GiteaPushEvent,
  options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
  const repository = isObject(event.repository) ? event.repository : undefined;
  const repositoryUrl = asString(repository?.html_url);
  const contextUrl = repositoryUrl ?? '<unknown>';
  const defaultBranch = asString(repository?.default_branch);

  if (defaultBranch) {
    const expectedRef = `refs/heads/${defaultBranch}`;
    if (event.ref !== expectedRef) {
      return {
        result: 'ignored',
        reason: `Gitea push event did not target the default branch, found "${event.ref}" but expected "${expectedRef}": ${contextUrl}`,
      };
    }
  }

  const commits = (
    Array.isArray(event.commits) ? event.commits : []
  ) as GiteaPushCommit[];

  if (!commits.length) {
    return {
      result: 'ignored',
      reason: `Gitea push event did not contain any commits: ${contextUrl}`,
    };
  }

  // Gitea may truncate the commits array in the payload for large pushes; in
  // that case we cannot see all affected files, so fall back to a coarse
  // repository level refresh instead.
  if (
    typeof event.total_commits === 'number' &&
    event.total_commits > commits.length
  ) {
    if (!repositoryUrl) {
      return {
        result: 'aborted',
        reason: 'Gitea push event did not include repository.html_url',
      };
    }
    return {
      result: 'ok',
      events: [{ type: 'repository.updated', url: repositoryUrl }],
    };
  }

  const pathState = new Map<string, PathState>();
  let hasRelevantPaths = false;

  for (const commit of commits) {
    const commitUrl = getCommitUrl(commit, repositoryUrl);
    const added = (commit.added ?? []).filter(options.isRelevantPath);
    const modified = (commit.modified ?? []).filter(options.isRelevantPath);
    const removed = (commit.removed ?? []).filter(options.isRelevantPath);

    if (added.length || modified.length || removed.length) {
      hasRelevantPaths = true;
    }

    for (const path of modified) {
      applyModifiedPath(pathState, path, commitUrl);
    }

    for (const path of added) {
      applyAddedPath(pathState, path, commitUrl);
    }

    for (const path of removed) {
      applyRemovedPath(pathState, path, commitUrl);
    }
  }

  if (!hasRelevantPaths) {
    return {
      result: 'ignored',
      reason: `Gitea push event did not affect any relevant paths: ${contextUrl}`,
    };
  }

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason: 'Gitea push event did not include repository.html_url',
    };
  }

  const branch = defaultBranch ?? extractBranchName(event.ref) ?? 'main';
  return {
    result: 'ok',
    events: Array.from(pathState.entries()).map(([path, e]) =>
      pathStateToCatalogScmEvent(path, e, repositoryUrl, branch),
    ),
  };
}

async function onRepositoryEvent(
  event: GiteaRepositoryEvent,
): Promise<AnalyzeWebhookEventResult> {
  const action = asString(event.action);
  const repositoryUrl = asString(
    isObject(event.repository) ? event.repository.html_url : undefined,
  );

  if (action === 'created' || action === 'deleted') {
    if (!repositoryUrl) {
      return {
        result: 'aborted',
        reason: `Gitea repository ${action} event did not include repository.html_url`,
      };
    }
    if (action === 'created') {
      return {
        result: 'ok',
        events: [{ type: 'repository.created', url: repositoryUrl }],
      };
    }
    return {
      result: 'ok',
      events: [{ type: 'repository.deleted', url: repositoryUrl }],
    };
  }

  if (action === 'renamed') {
    const oldName = asString(
      isObject(event.changes) && isObject(event.changes.name)
        ? event.changes.name.from
        : undefined,
    );
    if (!repositoryUrl || !oldName) {
      return {
        result: 'aborted',
        reason:
          'Gitea repository renamed event did not include repository.html_url and changes.name.from',
      };
    }
    const ownerUrl = repositoryUrl.split('/').slice(0, -1).join('/');
    return {
      result: 'ok',
      events: [
        {
          type: 'repository.moved',
          fromUrl: `${ownerUrl}/${oldName}`,
          toUrl: repositoryUrl,
        },
      ],
    };
  }

  return {
    result: 'unsupported-event',
    event: `repository.${action}`,
  };
}

/**
 * Analyzes a Gitea webhook event and translates it into zero or more catalog
 * SCM events that entity providers can act on.
 *
 * Supported event types:
 * - `push` — translates file-level adds, modifications, and deletions on the
 *   default branch into `location.created`, `location.updated`, and
 *   `location.deleted` events for paths matching `isRelevantPath`. Falls back
 *   to a coarse `repository.updated` event if the commits array was truncated.
 * - `repository` — translates repository creations, deletions, and renames
 *   into `repository.created`, `repository.deleted`, and `repository.moved`
 *   events.
 *
 * @alpha
 */
export async function analyzeGiteaWebhookEvent(
  eventType: string,
  eventPayload: unknown,
  options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
  if (!isObject(eventPayload)) {
    throw new InputError('Gitea webhook event payload is not an object');
  }

  let result: AnalyzeWebhookEventResult;

  if (eventType === 'push') {
    result = await onPushEvent(eventPayload as GiteaPushEvent, options);
  } else if (eventType === 'repository') {
    result = await onRepositoryEvent(eventPayload as GiteaRepositoryEvent);
  } else {
    result = { result: 'unsupported-event', event: eventType };
  }

  if (result.result === 'ignored') {
    options.logger?.debug(`Gitea webhook event ignored: ${result.reason}`);
  } else if (result.result === 'aborted') {
    options.logger?.debug(`Gitea webhook event aborted: ${result.reason}`);
  } else if (result.result === 'unsupported-event') {
    options.logger?.debug(`Gitea webhook event unsupported: ${result.event}`);
  }

  return result;
}
