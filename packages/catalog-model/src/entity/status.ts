/*
 * Copyright 2021 Spotify AB
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
 * Each entity status entry has a level, describing its severity.
 */
export type UNSTABLE_EntityStatusLevel =
  | 'ok' // Everything is OK
  | 'info' // Only informative data
  | 'warning' // Warnings were found
  | 'error'; // Errors were found

/**
 * Reserved root fields in all `status` object values.
 */
export type UNSTABLE_EntityStatusValue = {
  status: UNSTABLE_EntityStatusLevel;
  message?: string;
};
