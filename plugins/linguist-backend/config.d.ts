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

export interface Config {
  /** Configuration options for the linguist-backend plugin */
  linguist?: {
    /**
     * The age of an entity's languages before a refresh occurs,
     * an age of 30 would mean the languages would be regenerated after 30 days.
     * The default is 0 meaning languages won't be refreshed once generated.
     */
    age: number;
  };
}
