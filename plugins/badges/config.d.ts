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

export interface Config {
  // defined with doc in badges-backend
  badges?: {
    [badgeId: string]: {
      /**
       * Badge title, used as tooltip text in the markdown code.
       *
       * @visibility frontend
       */
      title?: string;

      /**
       * Badge description, used as alt text in the markdown code.
       * Defaults to badge id.
       *
       * @visibility frontend
       */
      description?: string;

      /**
       * Badge target URL, turns badge into a link in the markdown code.
       *
       * For `entity` badges, there is a `entity_url` in the context
       * that could be appropriate to use here.
       *
       * @visibility frontend
       */
      target?: string;
    };
  };
}
