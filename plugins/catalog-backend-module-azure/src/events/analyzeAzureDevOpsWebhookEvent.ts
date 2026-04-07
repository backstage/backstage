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
 * Options for {@link analyzeAzureDevOpsWebhookEvent}.
 * @alpha
 */
export interface AnalyzeAzureDevOpsWebhookEventOptions {
  /**
   * Predicate that returns true for file paths that are relevant to the
   * catalog (e.g. paths ending in `.yaml` or `.yml`).
   */
  isRelevantPath: (path: string) => boolean;
}

/**
 * The result of analyzing an Azure DevOps webhook event.
 *
 * - `ok` — one or more catalog SCM events were produced.
 * - `ignored` — the event was valid but not relevant.
 * - `aborted` — the event could not be fully processed due to missing data.
 * - `unsupported-event` — the event type is not handled by this analyzer.
 *
 * @alpha
 */
export type AnalyzeAzureDevOpsWebhookEventResult =
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

type AzureRepository = {
  name?: string;
  defaultBranch?: string;
  remoteUrl?: string;
};

type AzurePushRefUpdate = {
  name?: string;
};

type AzurePushCommit = {
  commitId?: string;
  url?: string;
  changes?: AzurePushCommitChange[];
  added?: string[];
  removed?: string[];
  modified?: string[];
};

type AzurePushCommitChange = {
  changeType?: string;
  item?: {
    path?: string;
    originalPath?: string;
  };
  path?: string;
  newPath?: string;
  oldPath?: string;
  originalPath?: string;
  sourceServerItem?: string;
};

type PushPathState =
  | {
      type: 'added';
      commit: AzurePushCommit;
    }
  | {
      type: 'removed';
      commit: AzurePushCommit;
    }
  | {
      type: 'changed';
      commit: AzurePushCommit;
    }
  | {
      type: 'renamed';
      fromPath: string;
      commit: AzurePushCommit;
    };

type NormalizedPushChange =
  | {
      type: 'added';
      path: string;
    }
  | {
      type: 'removed';
      path: string;
    }
  | {
      type: 'changed';
      path: string;
    }
  | {
      type: 'renamed';
      fromPath: string;
      toPath: string;
    };

function asObject(value: unknown): JsonObject | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as JsonObject;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function normalizePath(path: string | undefined): string | undefined {
  if (!path) {
    return undefined;
  }
  return path.startsWith('/') ? path : `/${path}`;
}

function getRepository(resource: JsonObject | undefined): AzureRepository {
  const repository = asObject(resource?.repository);
  return {
    name: asString(repository?.name),
    defaultBranch: asString(repository?.defaultBranch),
    remoteUrl: asString(repository?.remoteUrl),
  };
}

function toLocationUrl(options: {
  remoteUrl: string | undefined;
  path: string;
}): string | undefined {
  if (!options.remoteUrl) {
    return undefined;
  }

  // Match the URL format produced by AzureDevOpsEntityProvider.createObjectUrl
  // which uses encodeURI on the full URL string with path and version as raw
  // query parameter values.
  //
  // The version parameter is intentionally omitted here because the entity
  // provider only includes it when the user explicitly configures a `branch`
  // in the provider config. Since we cannot know at analysis time whether a
  // branch was configured, omitting version matches the default provider
  // behavior and avoids URL mismatches that would prevent SCM events from
  // triggering catalog refreshes.
  const fullUrl = `${options.remoteUrl}?path=${options.path}`;
  return encodeURI(fullUrl);
}

function toCommitUrl(
  repository: AzureRepository,
  commit: AzurePushCommit,
): string | undefined {
  if (commit.url) {
    return commit.url;
  }
  if (repository.remoteUrl && commit.commitId) {
    return `${repository.remoteUrl}/commit/${commit.commitId}`;
  }
  return undefined;
}

function toCatalogScmEventForPathState(options: {
  repository: AzureRepository;
  path: string;
  pathState: PushPathState;
  isRelevantPath: (path: string) => boolean;
}): CatalogScmEvent[] {
  const { repository, path, pathState, isRelevantPath } = options;
  const commitUrl = toCommitUrl(repository, pathState.commit);
  const context = commitUrl ? { commitUrl } : undefined;

  if (pathState.type === 'renamed') {
    const fromRelevant = isRelevantPath(pathState.fromPath);
    const toRelevant = isRelevantPath(path);
    const fromUrl = toLocationUrl({
      remoteUrl: repository.remoteUrl,
      path: pathState.fromPath,
    });
    const toUrl = toLocationUrl({
      remoteUrl: repository.remoteUrl,
      path,
    });

    if (fromRelevant && toRelevant && fromUrl && toUrl) {
      return [{ type: 'location.moved', fromUrl, toUrl, context }];
    }
    if (fromRelevant && !toRelevant && fromUrl) {
      return [{ type: 'location.deleted', url: fromUrl, context }];
    }
    if (!fromRelevant && toRelevant && toUrl) {
      return [{ type: 'location.created', url: toUrl, context }];
    }
    return [];
  }

  if (!isRelevantPath(path)) {
    return [];
  }

  const url = toLocationUrl({
    remoteUrl: repository.remoteUrl,
    path,
  });
  if (!url) {
    return [];
  }

  if (pathState.type === 'added') {
    return [{ type: 'location.created', url, context }];
  }
  if (pathState.type === 'removed') {
    return [{ type: 'location.deleted', url, context }];
  }

  return [{ type: 'location.updated', url, context }];
}

function normalizePushCommitChanges(
  commit: AzurePushCommit,
): NormalizedPushChange[] {
  const normalized: NormalizedPushChange[] = [];

  for (const path of commit.added ?? []) {
    const normalizedPath = normalizePath(path);
    if (normalizedPath) {
      normalized.push({ type: 'added', path: normalizedPath });
    }
  }

  for (const path of commit.removed ?? []) {
    const normalizedPath = normalizePath(path);
    if (normalizedPath) {
      normalized.push({ type: 'removed', path: normalizedPath });
    }
  }

  for (const path of commit.modified ?? []) {
    const normalizedPath = normalizePath(path);
    if (normalizedPath) {
      normalized.push({ type: 'changed', path: normalizedPath });
    }
  }

  for (const change of commit.changes ?? []) {
    const changeType = change.changeType?.toLowerCase() ?? '';
    const toPath = normalizePath(
      change.item?.path ?? change.path ?? change.newPath,
    );
    const fromPath = normalizePath(
      change.originalPath ??
        change.item?.originalPath ??
        change.oldPath ??
        change.sourceServerItem,
    );

    if (changeType.includes('rename') && fromPath && toPath) {
      normalized.push({ type: 'renamed', fromPath, toPath });
      continue;
    }

    if (changeType.includes('add') && toPath) {
      normalized.push({ type: 'added', path: toPath });
      continue;
    }

    if (changeType.includes('delete') && (toPath ?? fromPath)) {
      normalized.push({ type: 'removed', path: toPath ?? fromPath! });
      continue;
    }

    if (
      (changeType.includes('edit') ||
        changeType.includes('modify') ||
        changeType.includes('update')) &&
      (toPath ?? fromPath)
    ) {
      normalized.push({ type: 'changed', path: toPath ?? fromPath! });
    }
  }

  return normalized;
}

function applyPushChange(
  state: Map<string, PushPathState>,
  change: NormalizedPushChange,
  commit: AzurePushCommit,
) {
  if (change.type === 'renamed') {
    const previous = state.get(change.fromPath);
    state.delete(change.fromPath);

    let next: PushPathState | undefined;
    if (!previous) {
      next = { type: 'renamed', fromPath: change.fromPath, commit };
    } else if (previous.type === 'added') {
      next = { type: 'added', commit };
    } else if (previous.type === 'changed') {
      next = { type: 'renamed', fromPath: change.fromPath, commit };
    } else if (previous.type === 'renamed') {
      next = { type: 'renamed', fromPath: previous.fromPath, commit };
    }

    if (next) {
      state.set(change.toPath, next);
    }
    return;
  }

  const previous = state.get(change.path);

  if (change.type === 'added') {
    if (!previous) {
      state.set(change.path, { type: 'added', commit });
    } else if (previous.type === 'removed') {
      state.set(change.path, { type: 'changed', commit });
    }
    return;
  }

  if (change.type === 'removed') {
    if (!previous) {
      state.set(change.path, { type: 'removed', commit });
    } else if (previous.type === 'added') {
      state.delete(change.path);
    } else if (previous.type === 'changed') {
      state.set(change.path, { type: 'removed', commit });
    } else if (previous.type === 'renamed') {
      state.delete(change.path);
      state.set(previous.fromPath, { type: 'removed', commit });
    }
    return;
  }

  if (!previous) {
    state.set(change.path, { type: 'changed', commit });
  }
}

function replaceRepoNameInRemoteUrl(
  remoteUrl: string | undefined,
  repoName: string | undefined,
): string | undefined {
  if (!remoteUrl || !repoName) {
    return undefined;
  }
  const gitMarker = '/_git/';
  const gitIdx = remoteUrl.indexOf(gitMarker);
  if (gitIdx === -1) {
    return undefined;
  }
  const prefix = remoteUrl.slice(0, gitIdx + gitMarker.length);
  const rest = remoteUrl.slice(gitIdx + gitMarker.length);
  const endIdx = rest.search(/[/?#]/);
  const suffix = endIdx === -1 ? '' : rest.slice(endIdx);
  return `${prefix}${repoName}${suffix}`;
}

async function onPushEvent(
  eventPayload: JsonObject,
  options: AnalyzeAzureDevOpsWebhookEventOptions,
): Promise<AnalyzeAzureDevOpsWebhookEventResult> {
  const resource = asObject(eventPayload.resource);
  const repository = getRepository(resource);
  const refUpdates =
    (resource?.refUpdates as AzurePushRefUpdate[] | undefined) ?? [];
  const commits = (resource?.commits as AzurePushCommit[] | undefined) ?? [];
  const contextUrl =
    asString(resource?.url) ?? repository.remoteUrl ?? '<unknown>';

  if (commits.length === 0) {
    return {
      result: 'ignored',
      reason: `Azure DevOps push event does not contain commits: ${contextUrl}`,
    };
  }

  if (repository.defaultBranch) {
    const updatesToDefaultBranch = refUpdates.filter(
      update => update.name === repository.defaultBranch,
    );
    if (updatesToDefaultBranch.length === 0) {
      return {
        result: 'ignored',
        reason: `Azure DevOps push event did not target the default branch, expected "${repository.defaultBranch}": ${contextUrl}`,
      };
    }
  }

  const state = new Map<string, PushPathState>();

  for (const commit of commits) {
    const changes = normalizePushCommitChanges(commit);
    for (const change of changes) {
      applyPushChange(state, change, commit);
    }
  }

  if (state.size === 0) {
    return {
      result: 'ignored',
      reason: `Azure DevOps push event did not affect any relevant paths: ${contextUrl}`,
    };
  }

  const events = Array.from(state.entries()).flatMap(([path, pathState]) =>
    toCatalogScmEventForPathState({
      repository,
      path,
      pathState,
      isRelevantPath: options.isRelevantPath,
    }),
  );

  if (events.length === 0) {
    return {
      result: 'ignored',
      reason: `Azure DevOps push event did not affect any relevant paths: ${contextUrl}`,
    };
  }

  return { result: 'ok', events };
}

async function onRepositoryEvent(
  eventType: string,
  eventPayload: JsonObject,
): Promise<AnalyzeAzureDevOpsWebhookEventResult> {
  const resource = asObject(eventPayload.resource);
  const repository = getRepository(resource);
  const toUrl = repository.remoteUrl;

  if (eventType === 'git.repo.created' && toUrl) {
    return {
      result: 'ok',
      events: [{ type: 'repository.created', url: toUrl }],
    };
  }

  if (eventType === 'git.repo.deleted' && toUrl) {
    return {
      result: 'ok',
      events: [{ type: 'repository.deleted', url: toUrl }],
    };
  }

  if (eventType === 'git.repo.statuschanged' && toUrl) {
    return {
      result: 'ok',
      events: [{ type: 'repository.updated', url: toUrl }],
    };
  }

  if (eventType === 'git.repo.renamed' && toUrl) {
    const oldName = asString(resource?.oldName);
    const fromUrl = oldName
      ? replaceRepoNameInRemoteUrl(toUrl, oldName)
      : undefined;
    if (!fromUrl) {
      return {
        result: 'ignored',
        reason: oldName
          ? 'Azure DevOps repository renamed event has an unexpected repository.remoteUrl format'
          : 'Azure DevOps repository renamed event is missing oldName',
      };
    }

    return {
      result: 'ok',
      events: [{ type: 'repository.moved', fromUrl, toUrl }],
    };
  }

  if (eventType.startsWith('git.repo.')) {
    return {
      result: 'unsupported-event',
      event: eventType,
    };
  }

  return {
    result: 'unsupported-event',
    event: eventType,
  };
}

/**
 * Analyzes an Azure DevOps webhook event and translates it into zero or more
 * catalog SCM events that entity providers can act on.
 *
 * Supported event types:
 * - `git.push` — translates file-level adds, modifications, and deletions on
 *   the default branch into catalog SCM events for paths matching
 *   `isRelevantPath`.
 * - `git.repo.created` — emits a `repository.created` event.
 * - `git.repo.deleted` — emits a `repository.deleted` event.
 * - `git.repo.statuschanged` — emits a `repository.updated` event.
 * - `git.repo.renamed` — emits a `repository.moved` event with the old and
 *   new repository URLs.
 *
 * @alpha
 */
export async function analyzeAzureDevOpsWebhookEvent(
  eventType: string,
  eventPayload: unknown,
  options: AnalyzeAzureDevOpsWebhookEventOptions,
): Promise<AnalyzeAzureDevOpsWebhookEventResult> {
  const payload = asObject(eventPayload);
  if (!payload) {
    throw new InputError('Azure DevOps webhook event payload is not an object');
  }

  if (eventType === 'git.push') {
    return await onPushEvent(payload, options);
  }

  if (eventType.startsWith('git.repo.')) {
    return await onRepositoryEvent(eventType, payload);
  }

  return {
    result: 'unsupported-event',
    event: eventType,
  };
}
