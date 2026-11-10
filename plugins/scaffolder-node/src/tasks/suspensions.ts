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

import { HumanDuration, JsonObject } from '@backstage/types';

/**
 * A source that may resume a suspended task.
 * @public
 */
export type TaskResumeTrigger =
  | { id: string; type: 'manual'; principals?: string[] }
  | { id: string; type: 'event'; topic: string; match: JsonObject };

/**
 * Options for parking a task and releasing its worker.
 * @public
 */
export type TaskSuspendOptions = {
  /** Unique within the task. This identifier is not a credential. */
  key: string;
  reason?: string;
  /** The first accepted trigger resumes the task. */
  resumeOn: TaskResumeTrigger[];
  /** Expiry returns a timeout outcome and never satisfies a trigger. */
  timeout?: HumanDuration;
};

/**
 * The saved outcome returned when the suspended action is replayed.
 * @public
 */
export type TaskResumeResult = {
  timedOut: boolean;
  triggerId?: string;
  payload: JsonObject;
  resumedBy?:
    | { type: 'user'; userEntityRef: string }
    | { type: 'service'; subject: string };
};

/**
 * A persisted suspension and its optional outcome.
 * @public
 */
export type TaskSuspension = TaskSuspendOptions & {
  stepId: string;
  result?: TaskResumeResult;
};

/**
 * A trusted backend request to resolve a manual trigger.
 * @public
 */
export type TaskResumeOptions = {
  taskId: string;
  key: string;
  triggerId: string;
  payload: JsonObject;
  principalRefs: string[];
  resumedBy: NonNullable<TaskResumeResult['resumedBy']>;
};
