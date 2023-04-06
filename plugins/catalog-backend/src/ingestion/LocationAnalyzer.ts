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

import { Logger } from 'winston';
import parseGitUrl from 'git-url-parse';
import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { LocationAnalyzer, ScmLocationAnalyzer } from './types';
import {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';

export class RepoLocationAnalyzer implements LocationAnalyzer {
  private readonly logger: Logger;
  private readonly scmIntegrations: ScmIntegrationRegistry;
  private readonly analyzers: ScmLocationAnalyzer[];

  constructor(
    logger: Logger,
    scmIntegrations: ScmIntegrationRegistry,
    analyzers: ScmLocationAnalyzer[],
  ) {
    this.logger = logger;
    this.scmIntegrations = scmIntegrations;
    this.analyzers = analyzers;
  }
  async analyzeLocation(
    request: AnalyzeLocationRequest,
  ): Promise<AnalyzeLocationResponse> {
    const integration = this.scmIntegrations.byUrl(request.location.target);
    const { owner, name } = parseGitUrl(request.location.target);

    let annotationPrefix;
    switch (integration?.type) {
      case 'azure':
        annotationPrefix = 'dev.azure.com';
        break;
      case 'bitbucket':
        annotationPrefix = 'bitbucket.org';
        break;
      case 'github':
        annotationPrefix = 'github.com';
        break;
      case 'gitlab':
        annotationPrefix = 'gitlab.com';
        break;
      default:
        break;
    }

    const analyzer = this.analyzers.find(a =>
      a.supports(request.location.target),
    );
    if (analyzer) {
      const analyzerResult = await analyzer.analyze({
        url: request.location.target,
      });
      if (analyzerResult.existing.length > 0) {
        this.logger.debug(
          `entity for ${request.location.target} already exists.`,
        );
        return {
          existingEntityFiles: analyzerResult.existing,
          generateEntities: [],
        };
      }
    }

    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: name,
      },
      spec: { type: 'other', lifecycle: 'unknown' },
    };

    if (annotationPrefix) {
      entity.metadata.annotations = {
        [`${annotationPrefix}/project-slug`]: `${owner}/${name}`,
      };
    }

    this.logger.debug(`entity created for ${request.location.target}`);
    return {
      existingEntityFiles: [],
      generateEntities: [{ entity, fields: [] }],
    };
  }
}
