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

/**
 * @public
 */
export type PlaylistMetadata = {
  id: string;
  name: string;
  description?: string;
  owner: string;
  public: boolean;
};

/**
 * @public
 */
export type Playlist = PlaylistMetadata & {
  entities: number;
  followers: number;
  isFollowing: boolean;
};
