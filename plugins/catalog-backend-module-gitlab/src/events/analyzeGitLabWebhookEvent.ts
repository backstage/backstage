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
import { WebhookPushEventSchema } from '@gitbeaker/rest';

type StringRecord = Record<string, unknown>;

/**
 * Options for {@link analyzeGitLabWebhookEvent}.
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
 * The result of analyzing a GitLab webhook event.
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

type GitLabPushCommit = {
  id?: string;
  url?: string;
  added?: string[];
  removed?: string[];
  modified?: string[];
};

type ChangeDescriptor = {
  from?: unknown;
  to?: unknown;
  old?: unknown;
  new?: unknown;
  previous?: unknown;
  current?: unknown;
  before?: unknown;
  after?: unknown;
};

type GitLabRepositoryUpdateEvent = {
  object_kind?: string;
  event_name?: string;
  action?: string;
  deleted_at?: string | null;
  path_with_namespace?: string;
  old_path_with_namespace?: string;
  project?: {
    web_url?: string;
    path_with_namespace?: string;
    deleted_at?: string | null;
  };
  changes?: {
    web_url?: ChangeDescriptor;
    path_with_namespace?: ChangeDescriptor;
    old_path_with_namespace?: ChangeDescriptor;
    deleted_at?: ChangeDescriptor;
  };
};

function isObject(value: unknown): value is StringRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getFromChange(change?: ChangeDescriptor): string | undefined {
  return (
    asString(change?.from) ??
    asString(change?.old) ??
    asString(change?.previous) ??
    asString(change?.before)
  );
}

function getToChange(change?: ChangeDescriptor): string | undefined {
  return (
    asString(change?.to) ??
    asString(change?.new) ??
    asString(change?.current) ??
    asString(change?.after)
  );
}

function extractBranchName(ref?: string): string | undefined {
  if (!ref || !ref.startsWith('refs/heads/')) {
    return undefined;
  }
  return ref.slice('refs/heads/'.length);
}

function getCommitUrl(
  commit: GitLabPushCommit,
  repositoryUrl?: string,
): string | undefined {
  if (commit.url) {
    return commit.url;
  }
  if (commit.id && repositoryUrl) {
    return `${repositoryUrl}/-/commit/${commit.id}`;
  }
  return undefined;
}

function pathStateToCatalogScmEvent(
  path: string,
  event: PathState,
  repositoryUrl: string,
  branch: string,
): CatalogScmEvent {
  const toBlobUrl = (p: string) => `${repositoryUrl}/-/blob/${branch}/${p}`;
  const context = event.commitUrl ? { commitUrl: event.commitUrl } : undefined;

  switch (event.type) {
    case 'added':
      return {
        type: 'location.created',
        url: toBlobUrl(path),
        context,
      };
    case 'removed':
      return {
        type: 'location.deleted',
        url: toBlobUrl(path),
        context,
      };
    case 'changed':
      return {
        type: 'location.updated',
        url: toBlobUrl(path),
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
  if (previous.type === 'removed') {
    pathState.set(path, previous);
    return;
  }
  pathState.set(path, previous);
}

async function onPushEvent(
  event: WebhookPushEventSchema,
  options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
  const project = isObject(event.project) ? event.project : undefined;
  const repositoryUrl = asString(project?.web_url);
  const contextUrl = repositoryUrl ?? '<unknown>';
  const defaultBranch = asString(project?.default_branch);

  if (defaultBranch) {
    const expectedRef = `refs/heads/${defaultBranch}`;
    if (event.ref !== expectedRef) {
      return {
        result: 'ignored',
        reason: `GitLab push event did not target the default branch, found "${event.ref}" but expected "${expectedRef}": ${contextUrl}`,
      };
    }
  }

  const commits = (
    Array.isArray(event.commits) ? event.commits : []
  ) as GitLabPushCommit[];

  if (!commits.length) {
    return {
      result: 'ignored',
      reason: `GitLab push event did not contain any commits: ${contextUrl}`,
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
      reason: `GitLab push event did not affect any relevant paths: ${contextUrl}`,
    };
  }

  if (!repositoryUrl) {
    return {
      result: 'aborted',
      reason: 'GitLab push event did not include project.web_url',
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

function getOrigin(url: string): string | undefined {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

function toRepositoryUrl(baseUrl: string, pathWithNamespace: string): string {
  return `${baseUrl}/${pathWithNamespace}`;
}

function getCurrentRepositoryUrl(
  event: GitLabRepositoryUpdateEvent,
): string | undefined {
  const projectUrl = asString(event.project?.web_url);
  if (projectUrl) {
    return projectUrl;
  }

  return getToChange(event.changes?.web_url);
}

function getPreviousRepositoryUrl(
  event: GitLabRepositoryUpdateEvent,
  currentRepositoryUrl?: string,
): string | undefined {
  const changedUrl = getFromChange(event.changes?.web_url);
  if (changedUrl) {
    return changedUrl;
  }

  const oldPathWithNamespace =
    asString(event.old_path_with_namespace) ??
    getFromChange(event.changes?.path_with_namespace) ??
    getFromChange(event.changes?.old_path_with_namespace);
  if (!oldPathWithNamespace) {
    return undefined;
  }

  const projectPathWithNamespace = asString(event.project?.path_with_namespace);
  const projectUrl = asString(event.project?.web_url);

  if (
    currentRepositoryUrl &&
    projectPathWithNamespace &&
    currentRepositoryUrl.endsWith(`/${projectPathWithNamespace}`)
  ) {
    const prefix = currentRepositoryUrl.slice(
      0,
      -projectPathWithNamespace.length - 1,
    );
    return toRepositoryUrl(prefix, oldPathWithNamespace);
  }

  const baseUrl =
    (projectUrl && getOrigin(projectUrl)) ||
    (currentRepositoryUrl && getOrigin(currentRepositoryUrl));
  if (!baseUrl) {
    return undefined;
  }

  return toRepositoryUrl(baseUrl, oldPathWithNamespace);
}

function isRepositoryDeletionEvent(
  event: GitLabRepositoryUpdateEvent,
): boolean {
  const eventName = asString(event.event_name)?.toLowerCase() ?? '';
  const action = asString(event.action)?.toLowerCase() ?? '';

  if (
    eventName.includes('destroy') ||
    eventName.includes('delete') ||
    action.includes('destroy') ||
    action.includes('delete') ||
    action.includes('remove')
  ) {
    return true;
  }

  if (event.deleted_at || event.project?.deleted_at) {
    return true;
  }

  return Boolean(getToChange(event.changes?.deleted_at));
}

async function onRepositoryUpdateEvent(
  event: GitLabRepositoryUpdateEvent,
): Promise<AnalyzeWebhookEventResult> {
  const currentRepositoryUrl = getCurrentRepositoryUrl(event);
  const previousRepositoryUrl = getPreviousRepositoryUrl(
    event,
    currentRepositoryUrl,
  );

  if (isRepositoryDeletionEvent(event)) {
    const repositoryUrl = currentRepositoryUrl ?? previousRepositoryUrl;
    if (!repositoryUrl) {
      return {
        result: 'ignored',
        reason:
          'GitLab repository_update event did not include sufficient data for repository deletion handling',
      };
    }

    return {
      result: 'ok',
      events: [
        {
          type: 'repository.deleted',
          url: repositoryUrl,
        },
      ],
    };
  }

  if (
    previousRepositoryUrl &&
    currentRepositoryUrl &&
    previousRepositoryUrl !== currentRepositoryUrl
  ) {
    return {
      result: 'ok',
      events: [
        {
          type: 'repository.moved',
          fromUrl: previousRepositoryUrl,
          toUrl: currentRepositoryUrl,
        },
      ],
    };
  }

  return {
    result: 'ignored',
    reason: 'GitLab repository_update event did not contain supported changes',
  };
}

/**
 * Analyzes a GitLab webhook event and translates it into zero or more catalog
 * SCM events that entity providers can act on.
 *
 * Supported event types:
 * - `push` — translates file-level adds, modifications, and deletions on the
 *   default branch into `location.created`, `location.updated`, and
 *   `location.deleted` events for paths matching `isRelevantPath`.
 * - `repository_update` — translates repository renames, transfers, and
 *   deletions into `repository.moved` and `repository.deleted` events.
 *
 * @alpha
 */
export async function analyzeGitLabWebhookEvent(
  eventType: string,
  eventPayload: unknown,
  options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
  if (!isObject(eventPayload)) {
    throw new InputError('GitLab webhook event payload is not an object');
  }

  let result: AnalyzeWebhookEventResult;

  if (eventType === 'push') {
    result = await onPushEvent(
      eventPayload as unknown as WebhookPushEventSchema,
      options,
    );
  } else if (eventType === 'repository_update') {
    result = await onRepositoryUpdateEvent(
      eventPayload as GitLabRepositoryUpdateEvent,
    );
  } else {
    result = { result: 'unsupported-event', event: eventType };
  }

  if (result.result === 'ignored') {
    options.logger?.debug(`GitLab webhook event ignored: ${result.reason}`);
  } else if (result.result === 'aborted') {
    options.logger?.debug(`GitLab webhook event aborted: ${result.reason}`);
  } else if (result.result === 'unsupported-event') {
    options.logger?.debug(`GitLab webhook event unsupported: ${result.event}`);
  }

  return result;
}
