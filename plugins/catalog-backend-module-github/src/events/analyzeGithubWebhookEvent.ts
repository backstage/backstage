/*
 * Copyright 2025 The Backstage Authors
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
import type {
  Commit,
  Organization,
  PushEvent,
  Repository,
  RepositoryArchivedEvent,
  RepositoryCreatedEvent,
  RepositoryDeletedEvent,
  RepositoryEditedEvent,
  RepositoryEvent,
  RepositoryPrivatizedEvent,
  RepositoryPublicizedEvent,
  RepositoryRenamedEvent,
  RepositoryTransferredEvent,
  RepositoryUnarchivedEvent,
  User,
} from '@octokit/webhooks-types';
import { OctokitProviderService } from '../util/octokitProviderService';
import { Octokit } from 'octokit';

export interface AnalyzeWebhookEventOptions {
  octokitProvider: OctokitProviderService;
  logger: LoggerService;
  isRelevantPath: (path: string) => boolean;
}

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

// Either a shorthand commit from a webhook event, or the full commit returned
// by the client API
type AnyCommit =
  | Commit
  | Awaited<ReturnType<Octokit['rest']['repos']['getCommit']>>['data'];

/**
 * Keeps track of intermediate state of individual paths while processing push events.
 */
type PathState =
  | {
      type: 'added';
      commit: AnyCommit;
    }
  | {
      type: 'removed';
      commit: AnyCommit;
    }
  | {
      type: 'modified';
      commit: AnyCommit;
    }
  | {
      type: 'renamed';
      fromPath: string;
      commit: AnyCommit;
    }
  | {
      type: 'changed';
      commit: AnyCommit;
    };

function pathStateToCatalogScmEvent(
  path: string,
  event: PathState,
  repository: Repository,
): CatalogScmEvent {
  const toBlobUrl = (p: string) =>
    `${repository.html_url}/blob/${repository.default_branch}/${p}`;

  const context = {
    commitUrl:
      'html_url' in event.commit ? event.commit.html_url : event.commit.url,
  };

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
    case 'modified':
      return {
        type: 'location.updated',
        url: toBlobUrl(path),
        context,
      };
    case 'renamed':
      return {
        type: 'location.moved',
        fromUrl: toBlobUrl(event.fromPath),
        toUrl: toBlobUrl(path),
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

/**
 * Analyzes a GitHub webhook event and returns details about actions that the
 * event might require.
 */
export async function analyzeGithubWebhookEvent(
  eventType: string,
  eventPayload: unknown,
  options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
  if (
    !eventPayload ||
    typeof eventPayload !== 'object' ||
    Array.isArray(eventPayload)
  ) {
    throw new InputError('GitHub webhook event payload is not an object');
  }

  if (eventType === 'push') {
    return await onPushEvent(eventPayload as PushEvent, options);
  }

  if (eventType === 'repository') {
    const repositoryEvent = eventPayload as RepositoryEvent;
    const action = repositoryEvent.action;
    if (action === 'created') {
      return await onRepositoryCreatedEvent(repositoryEvent);
    } else if (action === 'deleted') {
      return await onRepositoryDeletedEvent(repositoryEvent);
    } else if (action === 'archived') {
      return await onRepositoryArchivedEvent(repositoryEvent);
    } else if (action === 'unarchived') {
      return await onRepositoryUnarchivedEvent(repositoryEvent);
    } else if (action === 'privatized') {
      return await onRepositoryPrivatizedEvent(repositoryEvent);
    } else if (action === 'publicized') {
      return await onRepositoryPublicizedEvent(repositoryEvent);
    } else if (action === 'renamed') {
      return await onRepositoryRenamedEvent(repositoryEvent);
    } else if (action === 'edited') {
      return await onRepositoryEditedEvent(repositoryEvent);
    } else if (action === 'transferred') {
      return await onRepositoryTransferredEvent(repositoryEvent);
    }
    return {
      result: 'unsupported-event',
      event: `${eventType}.${action}`,
    };
  }

  return {
    result: 'unsupported-event',
    event: eventType,
  };
}

// #region Push events

async function onPushEvent(
  event: PushEvent,
  options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
  const contextUrl = event.compare || '<unknown>';

  // NOTE: The following caveats are mentioned in https://docs.github.com/en/webhooks/webhook-events-and-payloads#push
  // * Events will not be created if more than 5000 branches are pushed at once.
  // * Events will not be created for tags when more than three tags are pushed at once.
  // * The commits array includes a maximum of 2048 commits. If necessary, you can use the Commits API to fetch additional commits.
  // TODO(freben): Do we need to support reading the commits using the separate API under some circumstances?
  if (event.commits.length >= 2048) {
    return {
      result: 'aborted',
      reason: `GitHub push event has too many commits (${event.commits.length}), assuming that this is not a complete push event: ${contextUrl}`,
    };
  }

  // We ignore any event that doesn't target the default branch as this
  // is where the metadata files should be stored for now.
  const defaultBranchRef = `refs/heads/${event.repository.default_branch}`;
  if (event.ref !== defaultBranchRef) {
    return {
      result: 'ignored',
      reason: `GitHub push event did not target the default branch, found "${event.ref}" but expected "${defaultBranchRef}": ${contextUrl}`,
    };
  }

  /*
   * STEP 1: Find interesting commits
   *
   * We go through the commits and exclude the ones that are not interesting. We
   * consider a commit interesting if it mentions any relevant paths. We don't
   * want to unnecessarily call out to the GitHub API for commits that don't
   * affect files that we care about.
   *
   * The raw webhook event only contains shorthand commit data, not the full set
   * of information. Notably it does not contain the "files" array that details
   * what precise type of action was taken on individual paths. Instead it
   * presents three summary arrays per commit: "added", "removed", and
   * "modified", that just hold path strings.
   */

  const interestingShorthandCommits = (event.commits ?? []).filter(
    commit =>
      commit.added?.some(options.isRelevantPath) ||
      commit.removed?.some(options.isRelevantPath) ||
      commit.modified?.some(options.isRelevantPath),
  );

  if (!interestingShorthandCommits.length) {
    return {
      result: 'ignored',
      reason: `GitHub push event did not affect any relevant paths: ${contextUrl}`,
    };
  }

  /*
   * STEP 2: Simple case
   *
   * We go through the interesting shorthand commits in time order and make a
   * basic assessment of what happened. Most of the time this will be enough to
   * determine that (for relevant paths) there were only additions or only
   * removals - and possibly some changes. In that case we don't have to pay the
   * cost of fetching the detailed commits, because it's safe to assume that
   * there were no complex renames/moves or similar.
   *
   * If we find that any path is mentioned more than once, we bail out and go to
   * the complex case below instead.
   */

  const hasAddedPaths = interestingShorthandCommits.some(
    commit => (commit.added ?? []).filter(options.isRelevantPath).length > 0,
  );
  const hasRemovedPaths = interestingShorthandCommits.some(
    commit => (commit.removed ?? []).filter(options.isRelevantPath).length > 0,
  );

  if (!(hasAddedPaths && hasRemovedPaths)) {
    const addedOrRemovedPaths = new Map<string, PathState>();
    const changedPaths = new Map<string, PathState>();

    for (const commit of interestingShorthandCommits) {
      for (const path of commit.modified?.filter(options.isRelevantPath) ??
        []) {
        if (!addedOrRemovedPaths.has(path)) {
          changedPaths.set(path, { type: 'changed', commit });
        }
      }
      for (const path of commit.added?.filter(options.isRelevantPath) ?? []) {
        changedPaths.delete(path);
        addedOrRemovedPaths.set(path, { type: 'added', commit });
      }
      for (const path of commit.removed?.filter(options.isRelevantPath) ?? []) {
        changedPaths.delete(path);
        addedOrRemovedPaths.set(path, { type: 'removed', commit });
      }
    }

    const allPaths = new Map([
      ...changedPaths.entries(),
      ...addedOrRemovedPaths.entries(),
    ]);

    return {
      result: 'ok',
      events: Array.from(allPaths.entries()).map(([path, e]) =>
        pathStateToCatalogScmEvent(path, e, event.repository),
      ),
    };
  }

  /*
   * STEP 3: Complex case
   *
   * There seem to be a more complex overall set of changes here. There are both
   * additions and removals that look interesting. Now we need to analyze the
   * commits more carefully, to see which changes constitute purely individual
   * additions/removals, and which ones are actually moves. We do this by
   * iterating through the commits as fetched from the remote (since they
   * contain richer information than the webhook), and computing the "compound"
   * outcome (e.g. an add followed by a remove of the same file can be ignored).
   */

  const pathState = new Map<string, PathState>();

  const octokit = await options.octokitProvider.getOctokit(
    event.repository.html_url,
  );

  for (const eventCommit of interestingShorthandCommits) {
    // As noted in the getCommit documentation, if there's a large number of
    // files in the commit then only at most 300 of them will be returned along
    // with pagination link heasder, and then going up to a total of at most
    // 3000 files. But we also want to use the convenient octokit API so we
    // paginate in this kind of clunky way and end whenever there's no more rel
    // next URL.
    let commit:
      | Awaited<ReturnType<Octokit['rest']['repos']['getCommit']>>['data']
      | undefined;
    for (let page = 1; page <= 10; ++page) {
      const response = await octokit.rest.repos.getCommit({
        page,
        per_page: 300,
        owner: event.repository.owner.login,
        repo: event.repository.name,
        ref: eventCommit.id,
      });

      if (!commit) {
        commit = response.data;
      } else {
        commit.files = [
          ...(commit.files ?? []),
          ...(response.data.files ?? []),
        ];
      }

      if (!response.headers?.link?.includes('rel="next"')) {
        break;
      }
    }

    if (!commit) {
      throw new Error(`Failed to fetch commit for ${contextUrl}`);
    }

    // We somewhat wastefully track all paths here whether they seem initially
    // relevant or not, because we don't know yet whether they will be
    // moved/renamed into or out of relevance.
    for (const file of commit.files ?? []) {
      const previous = pathState.get(file.previous_filename || file.filename);
      let next: PathState | undefined;
      if (file.status === 'added') {
        if (!previous) {
          // First time we see this file in this set of commits
          next = { type: 'added', commit };
        } else if (previous.type === 'removed') {
          // Removed and then added again - assume changes
          next = { type: 'changed', commit };
        } else {
          // Should not happen; added/changed/moved -> added
          next = previous;
          options.logger.debug(
            `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
          );
        }
      } else if (file.status === 'removed') {
        if (!previous) {
          // First time we see this file in this set of commits
          next = { type: 'removed', commit };
        } else if (previous.type === 'added') {
          // It was first added and then removed - turn into noop
          next = undefined;
        } else if (previous.type === 'changed') {
          // Changed and then removed; convert to removed
          next = { type: 'removed', commit };
        } else if (previous.type === 'renamed') {
          // It was renamed and then removed - convert to removal of the ORIGINAL path
          if (!pathState.has(previous.fromPath)) {
            pathState.set(previous.fromPath, { type: 'removed', commit });
          }
          next = undefined;
        } else {
          // Should not happen; removed -> removed
          next = previous;
          options.logger.debug(
            `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
          );
        }
      } else if (file.status === 'renamed') {
        pathState.delete(file.previous_filename!);
        if (!previous) {
          // First time we see this file in this set of commits
          next = { type: 'renamed', fromPath: file.previous_filename!, commit };
        } else if (previous.type === 'added') {
          // It was first added and then moved - this sums to still just an add but in the new path
          next = { type: 'added', commit };
        } else if (previous.type === 'changed') {
          // Changed and then moved; convert to moved
          next = { type: 'renamed', fromPath: file.previous_filename!, commit };
        } else if (previous.type === 'renamed') {
          // It was renamed and then renamed again
          next = { type: 'renamed', fromPath: previous.fromPath, commit };
        } else {
          // Should not happen; removed -> renamed
          next = undefined;
          options.logger.debug(
            `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
          );
        }
      } else if (file.status === 'changed' || file.status === 'modified') {
        if (!previous) {
          // First time we see this file in this set of commits
          next = { type: 'changed', commit };
        } else if (previous.type === 'added') {
          // It was first added and then changed - still an add
          next = previous;
        } else if (previous.type === 'changed') {
          // Changed twice - still just a change
          next = previous;
        } else if (previous.type === 'renamed') {
          // Renamed and then changed - still a rename
          next = previous;
        } else {
          // Should not happen; removed -> changed but still keep the old state because it makes the most sense
          next = previous;
          options.logger.debug(
            `Unexpected commit state transition from ${previous.type} to ${file.status} in ${event.compare}`,
          );
        }
      } else {
        // remaining statuses are 'copied' and 'unchanged' - ignoring
        next = previous;
      }

      if (next) {
        pathState.set(file.filename, next);
      } else {
        pathState.delete(file.filename);
      }
    }
  }

  return {
    result: 'ok',
    events: Array.from(pathState.entries()).flatMap(([path, e]) =>
      options.isRelevantPath(path)
        ? [pathStateToCatalogScmEvent(path, e, event.repository)]
        : [],
    ),
  };
}

// #endregion
// #region Repository events

async function onRepositoryArchivedEvent(
  event: RepositoryArchivedEvent,
): Promise<AnalyzeWebhookEventResult> {
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.updated',
        url: event.repository.html_url,
      },
    ],
  };
}

async function onRepositoryUnarchivedEvent(
  event: RepositoryUnarchivedEvent,
): Promise<AnalyzeWebhookEventResult> {
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.updated',
        url: event.repository.html_url,
      },
    ],
  };
}

async function onRepositoryPrivatizedEvent(
  event: RepositoryPrivatizedEvent,
): Promise<AnalyzeWebhookEventResult> {
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.updated',
        url: event.repository.html_url,
      },
    ],
  };
}

async function onRepositoryPublicizedEvent(
  event: RepositoryPublicizedEvent,
): Promise<AnalyzeWebhookEventResult> {
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.updated',
        url: event.repository.html_url,
      },
    ],
  };
}

async function onRepositoryCreatedEvent(
  event: RepositoryCreatedEvent,
): Promise<AnalyzeWebhookEventResult> {
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.created',
        url: event.repository.html_url,
      },
    ],
  };
}

async function onRepositoryDeletedEvent(
  event: RepositoryDeletedEvent,
): Promise<AnalyzeWebhookEventResult> {
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.deleted',
        url: event.repository.html_url,
      },
    ],
  };
}

async function onRepositoryRenamedEvent(
  event: RepositoryRenamedEvent,
): Promise<AnalyzeWebhookEventResult> {
  const oldUrlPrefix = `${event.repository.owner.html_url}/${event.changes.repository.name.from}`;
  const newUrlPrefix = `${event.repository.html_url}`;
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.moved',
        fromUrl: oldUrlPrefix,
        toUrl: newUrlPrefix,
      },
    ],
  };
}

async function onRepositoryEditedEvent(
  event: RepositoryEditedEvent,
): Promise<AnalyzeWebhookEventResult> {
  if (event.changes.default_branch) {
    const oldUrlPrefix = `${event.repository.html_url}/blob/${event.changes.default_branch.from}`;
    const newUrlPrefix = `${event.repository.html_url}/blob/${event.repository.default_branch}`;
    return {
      result: 'ok',
      events: [
        {
          type: 'repository.moved',
          fromUrl: oldUrlPrefix,
          toUrl: newUrlPrefix,
        },
      ],
    };
  }

  const changes = Object.keys(event.changes)
    .map(c => `'${c}'`)
    .join(', ');
  return {
    result: 'ignored',
    reason: `GitHub repository edited event not handled: [${changes}]`,
  };
}

async function onRepositoryTransferredEvent(
  event: RepositoryTransferredEvent,
): Promise<AnalyzeWebhookEventResult> {
  // TODO(freben): The web interface allows renaming while transferring, but
  // we do not yet have a way of detecting that because weirdly, the actual
  // webhooks that then get sent are
  //
  // - First a transferred event OLD_OWNER -> NEW_OWNER/NEW_REPO_NAME
  //   (no mention of the OLD_REPO_NAME anywhere in the event payload)
  //
  // - Then a renamed event for NEW_OWNER of OLD_REPO_NAME -> NEW_REPO_NAME
  //   (where the former of course never existed as far as we know;
  //   no mention of the OLD_OWNER anywhere in the event payload)
  //
  // Handling this seems to need some form of state handling across events.
  //
  // Therefore, this code expects that OLD_REPO_NAME === NEW_REPO_NAME
  // and assumes that we did not perform a rename as part of the transfer.

  // The documentation states that there is an organization property in from,
  // but the types disagree. Hence the cast.
  // https://docs.github.com/en/webhooks/webhook-events-and-payloads?actionType=transferred#repository
  const from = event.changes.owner.from as {
    user?: User;
    organization?: Organization;
  };

  let oldOwnerUrl = from.user?.html_url ?? from.organization?.html_url;
  if (!oldOwnerUrl) {
    // Some servers do not supply an html_url field, so we
    // construct it by removing the last two segments of the
    // target URL instead (which we know ends with "/owner/repo")
    const base = event.repository.html_url.split('/').slice(0, -2).join('/');
    oldOwnerUrl = `${base}/${from.user?.login ?? from.organization?.login}`;
  }

  const oldUrlPrefix = `${oldOwnerUrl}/${event.repository.name}`;
  const newUrlPrefix = `${event.repository.html_url}`;
  return {
    result: 'ok',
    events: [
      {
        type: 'repository.moved',
        fromUrl: oldUrlPrefix,
        toUrl: newUrlPrefix,
      },
    ],
  };
}

// #endregion
