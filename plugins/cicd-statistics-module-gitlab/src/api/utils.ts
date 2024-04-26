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

import {
  Build,
  FilterStatusType,
  TriggerReason,
  Stage,
} from '@backstage/plugin-cicd-statistics';
import { Types } from '@gitbeaker/core';

const statusMap: Record<string, FilterStatusType> = {
  manual: 'unknown',
  created: 'enqueued',
  waiting_for_resource: 'stalled',
  preparing: 'unknown',
  pending: 'scheduled',
  running: 'running',
  success: 'succeeded',
  failed: 'failed',
  canceled: 'aborted',
  skipped: 'aborted',
  scheduled: 'scheduled',
};

// all gitlab trigger reasons can be found here: https://docs.gitlab.com/ee/api/pipelines.html#list-project-pipelines
const triggerReasonMap: Record<string, TriggerReason> = {
  push: 'scm',
  trigger: 'manual',
  merge_request_event: 'scm',
  schedule: 'internal',
};

/**
 * Takes the Pipeline object from Gitlab and transforms it to the Build object
 *
 * @param pipelines - Pipeline object that gets returned from Gitlab
 *
 * @public
 */
export function pipelinesToBuilds(
  pipelines: Array<Types.PipelineSchema>,
): Build[] {
  return pipelines.map(pipeline => {
    return {
      id: pipeline.id.toString(),
      status: statusMap[pipeline.status],
      branchType: 'master',
      duration: 0, // will get filled in later in a seperate API call
      requestedAt: new Date(pipeline.created_at),
      triggeredBy: triggerReasonMap[pipeline.source as string] ?? 'other',
      stages: [],
    };
  });
}

/**
 * Takes the Job object from Gitlab and transforms it to the Stage object
 *
 * @param jobs - Job object that gets returned from Gitlab
 *
 * @public
 *
 * @remarks
 *
 * The Gitlab API can only return the job (sub-stage) of a pipeline and not a whole stage
 * The job does return from which stage it is
 * So, for the stage name we use the parent stage name and in the sub-stages we add the current job
 * In the end the cicd-statistics plugin will calculate the right durations for each stage
 *
 * Furthermore, we don't add the job to the sub-stage if it is has the same name as the parent stage
 * We then assume that the stage has no sub-stages
 */
export function jobsToStages(jobs: Array<Types.JobSchema>): Stage[] {
  return jobs.map(job => {
    const status = statusMap[job.status] ? statusMap[job.status] : 'unknown';
    const duration = job.duration ? ((job.duration * 1000) as number) : 0;
    return {
      name: job.stage,
      status,
      duration,
      stages:
        job.name !== job.stage
          ? [
              {
                name: job.name,
                status,
                duration,
              },
            ]
          : [],
    };
  });
}
