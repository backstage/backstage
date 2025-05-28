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

/**
 * Allows for the detection of changes in the database, that you want to react
 * to.
 *
 * @remarks
 *
 * One important function of the change handlers is that they maintain a
 * constant amount of actual database work, no matter how many listeners there
 * are for the outcomes of that work. So they shield the rest of the system from
 * rising costs of change detection under load.
 */
export interface ChangeHandler {
  setupListener(
    signal: AbortSignal,
  ): Promise<{ waitForUpdate(): Promise<void> }>;
}
