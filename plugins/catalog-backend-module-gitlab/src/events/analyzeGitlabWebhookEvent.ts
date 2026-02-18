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
import { CatalogScmEvent } from '@backstage/plugin-catalog-node/alpha';
import { InputError } from '@backstage/errors';

// Local definitions for GitLab webhook events to avoid external type dependencies
interface GitLabCommit {
    id: string;
    message: string;
    url: string;
    author: {
        name: string;
        email: string;
    };
    added?: string[];
    removed?: string[];
    modified?: string[];
}

interface GitLabPushEvent {
    object_kind: string;
    before: string;
    after: string;
    ref: string;
    project: {
        id: number;
        name: string;
        description: string;
        web_url: string;
        default_branch: string;
    };
    commits: GitLabCommit[];
}

export interface AnalyzeWebhookEventOptions {
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

export async function analyzeGitlabWebhookEvent(
    eventPayload: unknown,
    options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
    if (
        !eventPayload ||
        typeof eventPayload !== 'object' ||
        Array.isArray(eventPayload)
    ) {
        throw new InputError('GitLab webhook event payload is not an object');
    }

    const payload = eventPayload as any;
    const objectKind = payload.object_kind;

    if (objectKind === 'push') {
        return onPushEvent(payload as GitLabPushEvent, options);
    }

    return {
        result: 'unsupported-event',
        event: objectKind || 'unknown',
    };
}

async function onPushEvent(
    event: GitLabPushEvent,
    options: AnalyzeWebhookEventOptions,
): Promise<AnalyzeWebhookEventResult> {
    const { isRelevantPath } = options;
    const { project, ref, commits } = event;

    if (!project || !ref || !commits) {
        return {
            result: 'ignored',
            reason: 'GitLab push event payload missing required fields',
        };
    }

    // We ignore any event that doesn't target the default branch
    const defaultBranch = project.default_branch;
    const defaultBranchRef = `refs/heads/${defaultBranch}`;
    if (ref !== defaultBranchRef) {
        return {
            result: 'ignored',
            reason: `GitLab push event did not target the default branch, found "${ref}" but expected "${defaultBranchRef}"`,
        };
    }

    const events: CatalogScmEvent[] = [];

    for (const commit of commits) {
        const context = {
            commitUrl: commit.url,
        };

        const toBlobUrl = (path: string) => `${project.web_url}/-/blob/${defaultBranch}/${path}`;

        if (commit.added) {
            for (const path of commit.added) {
                if (isRelevantPath(path)) {
                    events.push({
                        type: 'location.created',
                        url: toBlobUrl(path),
                        context,
                    });
                }
            }
        }

        if (commit.removed) {
            for (const path of commit.removed) {
                if (isRelevantPath(path)) {
                    events.push({
                        type: 'location.deleted',
                        url: toBlobUrl(path),
                        context,
                    });
                }
            }
        }

        if (commit.modified) {
            for (const path of commit.modified) {
                if (isRelevantPath(path)) {
                    events.push({
                        type: 'location.updated',
                        url: toBlobUrl(path),
                        context,
                    });
                }
            }
        }
    }

    if (events.length === 0) {
        return {
            result: 'ignored',
            reason: `GitLab push event did not affect any relevant paths`,
        };
    }

    return {
        result: 'ok',
        events,
    };
}
