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

export interface ScmDetails {
  url?: string;
  displayName?: string;
  author?: string;
}

interface CommonBuild {
  // standard Jenkins
  timestamp: number;
  building: boolean;
  duration: number;
  result?: string;
  fullDisplayName: string;
  displayName: string;
  url: string;
  number: number;
}

export interface JenkinsBuild extends CommonBuild {
  // read by us from jenkins but not passed to frontend
  actions: any;
}

/**
 * A build as presented by this plugin to the backstage jenkins plugin
 */
export interface BackstageBuild extends CommonBuild {
  // added by us
  source?: {
    branchName: string;
    displayName: string;
    url: string;
    commit: {
      hash: string;
    };
    author: string;
  };
  tests: {
    passed: number;
    skipped: number;
    failed: number;
    total: number;
    testUrl: string;
  };
  status: string; // == building ? 'running' : result,
}

export interface CommonProject {
  // standard Jenkins
  lastBuild: CommonBuild;
  displayName: string;
  fullDisplayName: string;
  fullName: string;
  inQueue: boolean;
}

export interface JenkinsProject extends CommonProject {
  // standard Jenkins
  lastBuild: JenkinsBuild;

  // read by us from jenkins but not passed to frontend
  actions: object[];
}

export interface BackstageProject extends CommonProject {
  // standard Jenkins
  lastBuild: BackstageBuild;

  // added by us
  status: string; // == inQueue ? 'queued' : lastBuild.building ? 'running' : lastBuild.result,
}
