/*
 * Copyright 2022 The Backstage Authors
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

import type {
  FilterStatusType,
  TriggerReason,
  Stage,
  BuildWithRaw,
  FilterBranchType,
} from '@backstage/plugin-cicd-statistics';
import { RestEndpointMethodTypes } from '@octokit/rest';

export type ListWorkflowRunsResponse =
  RestEndpointMethodTypes['actions']['listWorkflowRuns']['response']['data'];
export type ListJobsForWorkflowRunResponse =
  RestEndpointMethodTypes['actions']['listJobsForWorkflowRun']['response']['data'];

export type WorkflowRun = ListWorkflowRunsResponse['workflow_runs'][number];
export type JobForWorkflowRun = ListJobsForWorkflowRunResponse['jobs'][number];
export type SimpleJobDescriptor = NonNullable<
  JobForWorkflowRun['steps']
>[number];

export type ParsedBuild = BuildWithRaw<WorkflowRun>;

export function jobsToStages(
  jobs: ListJobsForWorkflowRunResponse,
): Array<Stage> {
  const jobStageToStage = (
    job: JobForWorkflowRun | SimpleJobDescriptor,
  ): Stage => {
    return {
      name: job.name,
      status: parseStatus(job.status, job.conclusion),
      duration:
        !job.started_at || !job.completed_at
          ? 0
          : new Date(job.completed_at).getTime() -
            new Date(job.started_at).getTime(),
      stages: ((job as JobForWorkflowRun).steps ?? []).map(subJob =>
        jobStageToStage(subJob),
      ),
    };
  };

  return (jobs.jobs ?? []).map(job => jobStageToStage(job));
}

const statusMap: Record<string, FilterStatusType> = {
  // For jobs:
  queued: 'enqueued',
  in_progress: 'running',
  // completed: // no status per se; needs 'conclusion'

  // Conclusions:
  failure: 'failed',
  success: 'succeeded',
  cancelled: 'aborted',
  skipped: 'expired',
  action_required: 'stalled',
};

const setTriggerReasonScm = new Set([
  'push',
  'pull_request',
  'pull_request_target',
]);
const setTriggerReasonInternal = new Set([
  'dynamic',
  'schedule',
  'workflow_dispatch',
  'deployment_status',
  'issues',
  'issue_comment',
]);

function parseTriggerReason(rawBuild: WorkflowRun): TriggerReason {
  if ((rawBuild.run_attempt ?? 1) > 1) {
    return 'manual';
  } else if (setTriggerReasonScm.has(rawBuild.event)) {
    return 'scm';
  } else if (setTriggerReasonInternal.has(rawBuild.event)) {
    return 'internal';
  }
  console.log(
    `[cicd-statistics-module-github]: Found unknown workflow run event: ${rawBuild.event}`,
  );
  return 'other';
}

function parseStatus(
  status: string,
  conclusion?: string | null,
): FilterStatusType {
  if (!statusMap[status] && !statusMap[conclusion ?? '']) {
    const con = !conclusion ? '' : ` (conclusion ${conclusion})`;
    console.log(
      `[cicd-statistics-module-github]: Found unknown status ${status}${con}`,
    );
  }
  return statusMap[status] ?? statusMap[conclusion ?? ''] ?? 'unknown';
}

function parseRunStatus(rawBuild: WorkflowRun): FilterStatusType {
  return parseStatus(rawBuild.status!, rawBuild.conclusion);
}

function parseBranch(rawBuild: WorkflowRun): FilterBranchType {
  const branch = rawBuild.head_branch?.toLowerCase();
  return branch === 'master' || branch === 'main' ? 'master' : 'branch';
}

function parseDuration(rawBuild: WorkflowRun): number {
  return (
    new Date(rawBuild.updated_at ?? undefined).getTime() -
    new Date(rawBuild.run_started_at ?? rawBuild.created_at).getTime()
  );
}

export function parseBuild(rawBuild: WorkflowRun): ParsedBuild {
  return {
    raw: rawBuild,

    id: `${rawBuild.id}`,
    triggeredBy: parseTriggerReason(rawBuild),
    status: parseRunStatus(rawBuild),
    branchType: parseBranch(rawBuild),
    requestedAt: new Date(rawBuild.run_started_at ?? rawBuild.created_at),
    duration: parseDuration(rawBuild),

    stages: [], // Will be filled in second step when fetching jobs
  };
}
