/*
 * Copyright 2021 The Backstage Authors
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

import { flyteidl } from '@flyteorg/flyteidl/gen/pb-js/flyteidl';
import { FlyteApi } from './FlyteApi';
import { FlyteProject, FlyteDomain, PartialIdentifier } from './types';
import axios, { AxiosRequestConfig } from 'axios';

export class FlyteClient implements FlyteApi {
  listProjects(): Promise<FlyteProject[]> {
    const options: AxiosRequestConfig = {
      method: 'get',
      responseType: 'arraybuffer',
      headers: { Accept: 'application/octet-stream' },
      url: 'http://localhost:8088/api/v1/projects',
    };

    return axios
      .request(options)
      .then(response => new Uint8Array(response.data))
      .then(data => flyteidl.admin.Projects.decode(data))
      .then(proto =>
        proto.projects.map(project => {
          const domains: FlyteDomain[] = [];
          domains.push.apply(
            domains,
            project.domains!.map(domain => {
              return {
                id: domain!.id!,
                name: domain!.name!,
              };
            }),
          );
          return {
            id: project.id!,
            name: project.name!,
            description: project.description!,
            domains: domains!,
          };
        }),
      );
  }

  listWorkflows(project: string, domain: string): Promise<PartialIdentifier[]> {
    const options: AxiosRequestConfig = {
      method: 'get',
      responseType: 'arraybuffer',
      headers: { Accept: 'application/octet-stream' },
      url: `http://localhost:8088/api/v1/workflow_ids/${project}/${domain}?limit=5`,
    };
    return axios
      .request(options)
      .then(response => new Uint8Array(response.data))
      .then(data => flyteidl.admin.NamedEntityIdentifierList.decode(data))
      .then(proto =>
        proto.entities.map(entity => {
          return {
            project: entity.project!,
            domain: entity.domain!,
            name: entity.name!,
          };
        }),
      );
  }
}
