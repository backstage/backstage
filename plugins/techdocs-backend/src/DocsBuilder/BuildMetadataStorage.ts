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
  // Entity uid: etag
  [key: string]: string;
};

// TODO: Build info should be part of TechDocs storage, inside `techdocs_metadata.json`
// instead of in-memory storage of the Backstage instance.
// In case of multi-region Backstage deployments, or even using multiple Kubernetes pods,
// if each instance creates its separate build info in-memory, it will result in duplicate
// builds per instance. Also if the pod restarts, all the sites will have to be re-built.
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

  setEtag(etag: string): void {
    this.builds[this.entityUid] = etag;
  }

  getEtag(): string | undefined {
    return this.builds[this.entityUid];
  }
}
