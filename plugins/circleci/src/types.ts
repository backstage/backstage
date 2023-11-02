/*
 * Copyright 2020 The Backstage Authors
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

// API v2

export interface PipelineListResponse {
  items: Array<Pipeline>;
  next_page_token: string;
}

export interface Pipeline {
  id: string;
  errors: Array<PipelineErrors>;
  project_slug: string;
  updated_at?: Date;
  number: number;
  trigger_parameters?: { [key: string]: string | number | boolean | any };
  state: Pipeline.StateEnum;
  created_at: string;
  trigger: PipelineTrigger;
  vcs?: PipelineVcs;
}

export namespace Pipeline {
  export enum StateEnum {
    Created = 'created',
    Errored = 'errored',
    SetupPending = 'setup-pending',
    Setup = 'setup',
    Pending = 'pending',
  }
}

export interface PipelineErrors {
  type: PipelineErrors.TypeEnum;
  message: string;
}

export namespace PipelineErrors {
  export enum TypeEnum {
    Config = 'config',
    ConfigFetch = 'config-fetch',
    Timeout = 'timeout',
    Permission = 'permission',
    Other = 'other',
    Plan = 'plan',
  }
}

export interface PipelineTrigger {
  type: PipelineTrigger.TypeEnum;
  receivedAt: Date;
  actor: PipelineTriggerActor;
}

export namespace PipelineTrigger {
  export enum TypeEnum {
    ScheduledPipeline = 'scheduled_pipeline',
    Explicit = 'explicit',
    Api = 'api',
    Webhook = 'webhook',
  }
}

export interface PipelineTriggerActor {
  login: string;
  avatar_url: string;
}

export interface PipelineVcs {
  provider_name: string;
  target_repository_url: string;
  branch?: string;
  review_id?: string;
  review_url?: string;
  revision: string;
  tag?: string;
  commit?: PipelineVcsCommit;
  origin_repository_url: string;
}

export interface PipelineVcsCommit {
  subject: string;
  body: string;
}

export interface PipelineTriggerActor {
  login: string;
  avatarUrl: string;
}

export interface PipelineVcs {
  providerName: string;
  targetRepositoryUrl: string;
  branch?: string;
  reviewId?: string;
  reviewUrl?: string;
  revision: string;
  tag?: string;
  commit?: PipelineVcsCommit;
  originRepositoryUrl: string;
}

export interface PipelineVcsCommit {
  subject: string;
  body: string;
}

export interface Workflow {
  pipeline_id: string;
  canceled_by?: string;
  id: string;
  name: string;
  project_slug: string;
  errored_by?: string;
  tag?: Workflow.TagEnum;
  status: Workflow.StatusEnum;
  started_by: string;
  pipeline_number: number;
  created_at: string;
  stopped_at: string;
}

export namespace Workflow {
  export enum TagEnum {
    Setup = 'setup',
  }

  export enum StatusEnum {
    Success = 'success',
    Running = 'running',
    NotRun = 'not_run',
    Failed = 'failed',
    Error = 'error',
    Failing = 'failing',
    OnHold = 'on_hold',
    Canceled = 'canceled',
    Unauthorized = 'unauthorized',
  }
}

export interface WorkflowListResponse {
  items: Array<Workflow>;
  next_page_token: string;
}

export interface WorkflowJobListResponse {
  items: Array<Job>;
  next_page_token: string;
}

export interface RerunWorkflowResponse {
  workflow_id: string;
}

export interface Job {
  canceled_by?: string;
  dependencies: Array<string>;
  job_number?: number;
  id: string;
  started_at: string;
  name: string;
  approved_by?: string;
  project_slug: string;
  status: Job.StatusEnum;
  type: Job.TypeEnum;
  stopped_at?: string;
  approval_request_id?: string;
}

export namespace Job {
  export enum StatusEnum {
    Success = 'success',
    Running = 'running',
    NotRun = 'not_run',
    Failed = 'failed',
    Retried = 'retried',
    Queued = 'queued',
    NotRunning = 'not_running',
    InfrastructureFail = 'infrastructure_fail',
    Timedout = 'timedout',
    OnHold = 'on_hold',
    TerminatedUnknown = 'terminated-unknown',
    Blocked = 'blocked',
    Canceled = 'canceled',
    Unauthorized = 'unauthorized',
  }

  export enum TypeEnum {
    Build = 'build',
    Approval = 'approval',
  }
}

// API v1.1

export interface Workflow {
  job_name: string;
  job_id: string;
  workflow_id: string;
  workspace_id: string;
  workflow_name: string;
  upstream_job_ids?: any[];
  upstream_concurrency_map?: any;
}

export interface Build {
  dont_build?: boolean;
  previous?: PreviousBuild;
  retry_of?: number;
  workflows?: Workflow;
  all_commit_details?: PreviousBuild;
  all_commit_details_truncated?: boolean;
  author_date?: string;
  author_email?: string;
  author_name?: string;
  body?: string;
  branch: string;
  build_num?: number;
  build_parameters?: string;
  build_time_millis?: number;
  build_url?: string;
  canceled?: boolean;
  canceler?: string;
  circle_yml?: CircleConfig;
  committer_date?: string;
  committer_email?: string;
  committer_name?: string;
  compare?: string;
  fail_reason?: string;
  failed?: boolean;
  has_artifacts?: boolean;
  infrastructure_fail?: boolean;
  is_first_green_build?: boolean;
  job_name?: string;
  lifecycle?: string;
  messages?: string[];
  no_dependency_cache?: boolean;
  node?: any;
  oss?: boolean;
  outcome?: string;
  parallel?: number;
  picard?: BuildPicard;
  platform?: string;
  previous_successful_build?: PreviousBuild;
  queued_at?: string;
  reponame?: string;
  retries?: number;
  ssh_disabled?: boolean;
  ssh_users?: any[];
  start_time?: string;
  status?: string;
  stop_time?: string;
  subject?: string;
  timedout?: boolean;
  usage_queued_at?: string;
  user?: User;
  username?: string;
  vcs_revision?: string;
  vcs_tag?: string;
  vcs_type?: string;
  vcs_url?: string;
  why?: string;

  steps: BuildStep[];
  pull_requests: PullRequest[];
}

export interface BuildStep {
  name: string;
  actions: BuildStepAction[];
}

export interface PullRequest {
  head_sha: string;
  url: string;
  [key: string]: any;
}

export interface BuildStepAction {
  truncated?: boolean;
  index?: number;
  parallel?: boolean;
  failed?: boolean;
  infrastructure_fail?: boolean;
  name: string;
  bash_command?: string;
  status?: string;
  timedout?: boolean;
  continue?: boolean;
  end_time: string;
  type?: string;
  allocation_id?: string;
  output_url?: string;
  start_time: string;
  background?: boolean;
  exit_code?: number;
  insignificant?: boolean;
  canceled?: boolean;
  step?: number;
  run_time_millis?: number;
  has_output?: boolean;
}

export interface PreviousBuild {
  build_num?: number;
  status?: string;
  build_time_millis?: number;
}

export interface CircleConfig {
  string?: string;
}

export interface BuildPicard {
  build_agent?: {
    image?: null;
    properties?: {
      build_agent?: string;
      executor?: string;
    };
  };
  resource_class?: {
    cpu?: number;
    ram?: number;
    class?: string;
  };
  executor?: string;
}

export interface User {
  is_user?: boolean;
  login?: string;
  avatar_url?: string;
  name?: string;
  vcs_type?: string;
  id?: number;
}

export type PipelineInfo = Pipeline & {
  workflows: Workflow[];
};
