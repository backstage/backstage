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

import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { identity, merge, pickBy } from 'lodash';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';

const GITHUB_ACTIONS_ANNOTATION = 'github.com/project-slug';
const GITLAB_ACTIONS_ANNOTATION = 'gitlab.com/project-slug';
const AZURE_ACTIONS_ANNOTATION = 'dev.azure.com/project-repo';

/** @public */
export class AnnotateScmSlugEntityProcessor implements CatalogProcessor {
  private readonly opts: {
    scmIntegrationRegistry: ScmIntegrationRegistry;
    kinds?: string[];
  };

  constructor(opts: {
    scmIntegrationRegistry: ScmIntegrationRegistry;
    kinds?: string[];
  }) {
    this.opts = opts;
  }

  getProcessorName(): string {
    return 'AnnotateScmSlugEntityProcessor';
  }

  static fromConfig(
    config: Config,
    options?: { kinds?: string[] },
  ): AnnotateScmSlugEntityProcessor {
    return new AnnotateScmSlugEntityProcessor({
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

    let annotation;
    switch (scmIntegration.type) {
      case 'github':
        annotation = GITHUB_ACTIONS_ANNOTATION;
        break;
      case 'gitlab':
        annotation = GITLAB_ACTIONS_ANNOTATION;
        break;
      case 'azure':
        annotation = AZURE_ACTIONS_ANNOTATION;
        break;
      default:
        return entity;
    }

    let projectSlug = entity.metadata.annotations?.[annotation];
    if (!projectSlug) {
      const gitUrl = parseGitUrl(location.target);
      projectSlug = `${gitUrl.owner}/${gitUrl.name}`;
    }

    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [annotation]: projectSlug,
            },
            identity,
          ),
        },
      },
      entity,
    );
  }
}
