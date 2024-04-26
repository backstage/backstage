/*
 * Copyright 2023 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { identity, merge, pickBy } from 'lodash';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import {
  AZURE_DEVOPS_HOST_ORG_ANNOTATION,
  AZURE_DEVOPS_REPO_ANNOTATION,
} from '@backstage/plugin-azure-devops-common';
import { parseAzureDevOpsUrl } from '../utils';

/** @public */
export class AzureDevOpsAnnotatorProcessor implements CatalogProcessor {
  constructor(
    private readonly opts: {
      scmIntegrationRegistry: ScmIntegrationRegistry;
      kinds?: string[];
    },
  ) {}

  getProcessorName(): string {
    return 'AzureDevOpsAnnotatorProcessor';
  }

  static fromConfig(
    config: Config,
    options?: { kinds?: string[] },
  ): AzureDevOpsAnnotatorProcessor {
    return new AzureDevOpsAnnotatorProcessor({
      scmIntegrationRegistry: ScmIntegrations.fromConfig(config),
      kinds: options?.kinds,
    });
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    const applicableKinds = (this.opts.kinds ?? ['Component']).map(k =>
      k.toLocaleLowerCase('en-US'),
    );
    if (
      !applicableKinds.includes(entity.kind.toLocaleLowerCase('en-US')) ||
      location.type !== 'url'
    ) {
      return entity;
    }

    const scmIntegration = this.opts.scmIntegrationRegistry.byUrl(
      location.target,
    );

    if (!scmIntegration) {
      return entity;
    }

    if (scmIntegration.type !== 'azure') {
      return entity;
    }

    const { host, org, project, repo } = parseAzureDevOpsUrl(location.target);

    if (!org || !project || !repo) {
      return entity;
    }

    const hostOrgAnnotation = AZURE_DEVOPS_HOST_ORG_ANNOTATION;
    let hostOrgValue = entity.metadata.annotations?.[hostOrgAnnotation];
    if (!hostOrgValue) {
      hostOrgValue = `${host}/${org}`;
    }

    const projectRepoAnnotation = AZURE_DEVOPS_REPO_ANNOTATION;
    let projectRepoValue = entity.metadata.annotations?.[projectRepoAnnotation];
    if (!projectRepoValue) {
      projectRepoValue = `${project}/${repo}`;
    }

    const result = merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [hostOrgAnnotation]: hostOrgValue,
            },
            identity,
          ),
        },
      },
      entity,
    );

    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [projectRepoAnnotation]: projectRepoValue,
            },
            identity,
          ),
        },
      },
      result,
    );
  }
}
