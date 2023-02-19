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

import { ConfigApi } from '@backstage/core-plugin-api';
import { LinterApi, LinterResult, LintOptions } from './types';
import { Spectral } from '@stoplight/spectral-core';
// @ts-ignore
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/with-loader';
import { fetch } from '@stoplight/spectral-runtime';
import {
  ANNOTATION_SPECTRAL_RULESET_URL,
  getSpectralRulesetUrl,
  isApiDocsSpectralLinterAvailable,
} from '../lib/helper';
import { ApiEntity } from '@backstage/catalog-model';

/**
 * Options for creating an LinterClient.
 *
 * @public
 */
export interface LinterClientOptions {
  configApi: ConfigApi;
}

/**
 * An implementation of the LinterApi that downloads rule sets and lints api content.
 *
 * @public
 */
export class LinterClient implements LinterApi {
  private readonly configApi: ConfigApi;

  constructor(options: LinterClientOptions) {
    this.configApi = options.configApi;
  }

  private async lintApi(
    content: string,
    flavor: 'asyncapi' | 'openapi',
    ruleSetUrl?: string,
  ): Promise<LinterResult> {
    let ruleSetToDownload = ruleSetUrl;
    if (!ruleSetToDownload) {
      ruleSetToDownload = this.configApi.getOptionalString(
        `spectralLinter.${
          flavor === 'openapi' ? 'openApiRulesetUrl' : 'asyncApiRulesetUrl'
        }`,
      );
    }

    if (!ruleSetToDownload) {
      throw new Error(
        `Missing rule set, you can provide a rule set with annotation ${ANNOTATION_SPECTRAL_RULESET_URL}`,
      );
    }

    const result = await fetch(ruleSetToDownload);
    const ruleSetContent = await result.text();

    if (!result.ok) {
      throw new Error(
        `Could not download rule set ${ruleSetToDownload} (statusCode: ${result.status})`,
      );
    }

    const fs = {
      promises: {
        async readFile(filepath: string) {
          if (filepath === '/.spectral.yaml') {
            return ruleSetContent;
          }

          throw new Error(`Could not read ${filepath}`);
        },
      },
    };
    const spectral = new Spectral();
    const ruleSet = await bundleAndLoadRuleset('/.spectral.yaml', {
      fs,
      fetch,
    });
    spectral.setRuleset(ruleSet);
    const spectralResult = await spectral.run(content);

    return {
      rulesetUrl: ruleSetToDownload,
      data: spectralResult
        .sort((a, b) => a.severity - b.severity)
        .map(diagnosticItem => ({
          linePosition: {
            start: diagnosticItem.range.start.line,
            end: diagnosticItem.range.end.line,
          },
          message: diagnosticItem.message,
          severity: diagnosticItem.severity,
          path: diagnosticItem.path.map(item => item.toString()),
          code: diagnosticItem.code,
        })),
    };
  }

  async lint({ entity }: LintOptions): Promise<LinterResult> {
    if (!this.isApiTypeSupported(entity)) {
      throw new Error(
        `Linting is not supported for spec.type=${entity.spec.type}.`,
      );
    }
    return this.lintApi(
      entity.spec.definition,
      entity.spec.type as any,
      getSpectralRulesetUrl(entity),
    );
  }

  isApiTypeSupported(entity: ApiEntity) {
    return isApiDocsSpectralLinterAvailable(entity);
  }
}
