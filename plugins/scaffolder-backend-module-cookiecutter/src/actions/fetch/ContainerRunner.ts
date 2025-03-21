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

import { Writable } from 'stream';

/**
 * Handles the running of containers.
 *
 * @public
 */
export interface ContainerRunner {
  /**
   * Runs a container image to completion.
   */
  runContainer(opts: {
    imageName: string;
    command?: string | string[];
    args: string[];
    logStream?: Writable;
    mountDirs?: Record<string, string>;
    workingDir?: string;
    envVars?: Record<string, string>;
    pullImage?: boolean;
    defaultUser?: boolean;
    pullOptions?: {
      authconfig?: {
        username?: string;
        password?: string;
        auth?: string;
        email?: string;
        serveraddress?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }): Promise<void>;
}
