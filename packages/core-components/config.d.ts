/*
 * Copyright 2023 The Backstage Authors
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
  auth?: {
    /**
     * Autologout feature configuration
     */
    autologout?: {
      /**
       * Enable or disable the autologout feature
       * @visibility frontend
       */
      enabled?: boolean;

      /**
       * Number of minutes after which the inactive user is logged out automatically.
       * Default is 60 minutes (1 hour)
       * @visibility frontend
       */
      idleTimeoutMinutes?: number;

      /**
       * Number of seconds before the idle timeout where the user will be asked if it's still active.
       * A dialog will be shown.
       * Default is 10 seconds.
       * Set to 0 seconds to disable the prompt.
       * @visibility frontend
       */
      promptBeforeIdleSeconds?: number;

      /**
       * Enable/disable the usage of worker thread timers instead of main thread timers.
       * Default is true.
       * If you experience some browser incompatibility, you may try to set this to false.
       * @visibility frontend
       */
      useWorkerTimers?: boolean;

      /**
       * Enable/disable the automatic logout also on users that are logged in but with no Backstage tabs open.
       * Default is true.
       * @visibility frontend
       */
      logoutIfDisconnected?: boolean;
    };
  };
}
