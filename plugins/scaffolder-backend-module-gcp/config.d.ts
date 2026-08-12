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

export interface Config {
  /** Configuration options for the scaffolder plugin */
  scaffolder?: {
    /**
     * Task recovery configuration
     */
    taskRecovery?: {
      /**
       * GCS bucket configuration for workspace serialization.
       * Only used when workspaceProvider is set to 'gcpBucket'.
       */
      gcsBucket?: {
        /**
         * The GCS bucket name to store serialized workspaces.
         * @visibility backend
         */
        name: string;
      };
    };

    /**
     * Sets GCP bucket name to store serialized workspace for scaffolder tasks.
     * @deprecated Use scaffolder.taskRecovery.gcsBucket.name instead
     */
    EXPERIMENTAL_workspaceSerializationGcpBucketName?: string;
  };
}
