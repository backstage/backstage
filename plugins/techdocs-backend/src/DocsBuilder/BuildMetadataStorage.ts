/*
 * Copyright 2020 Spotify AB
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
type buildInfo = {
  // uid: timestamp
  [key: string]: number;
};

const builds = {} as buildInfo;

/**
 * Store timestamps of the most recent TechDocs build of each Entity. This is
 * used to invalidate cache if the latest commit in the documentation source
 * repository is later than the timestamp.
 */
export class BuildMetadataStorage {
  public entityUid: string;
  private builds: buildInfo;

  constructor(entityUid: string) {
    this.entityUid = entityUid;
    this.builds = builds;
  }

  storeBuildTimestamp() {
    this.builds[this.entityUid] = Date.now();
  }

  getTimestamp() {
    return this.builds[this.entityUid];
  }
}
