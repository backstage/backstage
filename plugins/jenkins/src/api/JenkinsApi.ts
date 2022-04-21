/*
 * Copyright 2020 The Backstage Authors
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

import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import type { CompoundEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';

export const jenkinsApiRef = createApiRef<JenkinsApi>({
  id: 'plugin.jenkins.service2',
});

export interface Build {
  // standard Jenkins
  timestamp: number;
  building: boolean;
  duration: number;
  result?: string;
  fullDisplayName: string;
  displayName: string;
  url: string;
  number: number;

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

export interface Project {
  // standard Jenkins
  lastBuild: Build;
  displayName: string;
  fullDisplayName: string;
  fullName: string;
  inQueue: string;
  // added by us
  status: string; // == inQueue ? 'queued' : lastBuild.building ? 'running' : lastBuild.result,
  onRestartClick: () => Promise<void>; // TODO rename to handle.* ? also, should this be on lastBuild?
}

export interface JenkinsApi {
  /**
   * Get the projects (jobs which have builds, not folders) including info about their lastBuild.
   *
   * Deciding what jobs are for an entity can be configured by the backstage _Integrator_ in the plugin-jenkins-backend setup
   * and by the _Software Engineer_ using annotations agreed with the _Integrator_.
   *
   * Typically, a folder job will be identified and the backend plugin will recursively look for projects (jobs with builds) within that folder.
   */
  getProjects(options: {
    /** the entity whose jobs should be retrieved. */
    entity: CompoundEntityRef;
    /** a filter on jobs. Currently this just takes a branch (and assumes certain structures in jenkins) */
    filter: { branch?: string };
  }): Promise<Project[]>;

  /**
   * Get a single build.
   *
   * This takes an entity to support selecting between multiple jenkins instances.
   *
   * TODO: abstract jobFullName (so we could support differentiating between the same named job on multiple instances).
   */
  getBuild(options: {
    entity: CompoundEntityRef;
    jobFullName: string;
    buildNumber: string;
  }): Promise<Build>;

  retry(options: {
    entity: CompoundEntityRef;
    jobFullName: string;
    buildNumber: string;
  }): Promise<void>;
}

export class JenkinsClient implements JenkinsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async getProjects(options: {
    entity: CompoundEntityRef;
    filter: { branch?: string };
  }): Promise<Project[]> {
    const { entity, filter } = options;
    const url = new URL(
      `${await this.discoveryApi.getBaseUrl(
        'jenkins',
      )}/v1/entity/${encodeURIComponent(entity.namespace)}/${encodeURIComponent(
        entity.kind,
      )}/${encodeURIComponent(entity.name)}/projects`,
    );

    if (filter.branch) {
      url.searchParams.append('branch', filter.branch);
    }

    const idToken = await this.getToken();
    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    return (
      (await response.json()).projects?.map((p: Project) => ({
        ...p,
        onRestartClick: () => {
          return this.retry({
            entity,
            jobFullName: p.fullName,
            buildNumber: String(p.lastBuild.number),
          });
        },
      })) || []
    );
  }

  async getBuild(options: {
    entity: CompoundEntityRef;
    jobFullName: string;
    buildNumber: string;
  }): Promise<Build> {
    const { entity, jobFullName, buildNumber } = options;
    const url = `${await this.discoveryApi.getBaseUrl(
      'jenkins',
    )}/v1/entity/${encodeURIComponent(entity.namespace)}/${encodeURIComponent(
      entity.kind,
    )}/${encodeURIComponent(entity.name)}/job/${encodeURIComponent(
      jobFullName,
    )}/${encodeURIComponent(buildNumber)}`;

    const idToken = await this.getToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    return (await response.json()).build;
  }

  async retry(options: {
    entity: CompoundEntityRef;
    jobFullName: string;
    buildNumber: string;
  }): Promise<void> {
    const { entity, jobFullName, buildNumber } = options;
    const url = `${await this.discoveryApi.getBaseUrl(
      'jenkins',
    )}/v1/entity/${encodeURIComponent(entity.namespace)}/${encodeURIComponent(
      entity.kind,
    )}/${encodeURIComponent(entity.name)}/job/${encodeURIComponent(
      jobFullName,
    )}/${encodeURIComponent(buildNumber)}:rebuild`;

    const idToken = await this.getToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
  }

  private async getToken() {
    const { token } = await this.identityApi.getCredentials();
    return token;
  }
}
