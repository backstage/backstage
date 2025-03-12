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

import { HumanDuration } from '@backstage/types';

export interface Config {
  /** Configuration options for the scaffolder plugin */
  scaffolder?: {
    /**
     * The commit author info used when new components are created.
     */
    defaultAuthor?: {
      name?: string;
      email?: string;
    };

    /**
     * Default PGP signing key for signing commits.
     * @visibility secret
     */
    defaultCommitSigningKey?: string;
    /**
     * The commit message used when new components are created.
     */
    defaultCommitMessage?: string;

    /**
     * Sets the number of concurrent tasks that can be run at any given time on the TaskWorker.
     *
     * Defaults to 10.
     *
     * Set to 0 to disable task workers altogether.
     */
    concurrentTasksLimit?: number;

    /**
     * Tries to wait for tasks to finish during SIGTERM before shutting down the TaskWorker.
     */
    EXPERIMENTAL_gracefulShutdown?: boolean;

    /**
     * Sets the tasks recoverability on system start up.
     *
     * If not specified, the default value is false.
     */
    EXPERIMENTAL_recoverTasks?: boolean;

    /**
     * Sets the serialization of the workspace to have an ability to rerun the failed task.
     */
    EXPERIMENTAL_workspaceSerialization?: boolean;

    /**
     * Sets the provider for workspace serialization.
     *
     * By default, it is your database.
     */
    EXPERIMENTAL_workspaceSerializationProvider?: string;

    /**
     * Every task which is in progress state and having a last heartbeat longer than a specified timeout is going to
     * be attempted to recover.
     *
     * If not specified, the default value is 5 seconds.
     */
    EXPERIMENTAL_recoverTasksTimeout?: HumanDuration | string;

    /**
     * Makes sure to auto-expire and clean up things that time out or for other reasons should not be left lingering.
     *
     * By default, the frequency is every 5 minutes.
     */
    taskTimeoutJanitorFrequency?: HumanDuration | string;

    /**
     * Sets the task's heartbeat timeout, when to consider a task to be staled.
     *
     * Once task is considered to be staled, the scheduler will shut it down on the next cycle.
     *
     * Default value is 24 hours.
     */
    taskTimeout?: HumanDuration | string;
  };
}
