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
import { parseEntityRef } from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import type { JsonObject, JsonValue } from '@backstage/types';
import {
  parseRepoUrl,
  TemplateFilter,
} from '@backstage/plugin-scaffolder-node';
import get from 'lodash/get';

export const createDefaultFilters = ({
  integrations,
}: {
  integrations: ScmIntegrations;
}): Record<string, TemplateFilter> => {
  return {
    parseRepoUrl: url => parseRepoUrl(url as string, integrations),
    parseEntityRef: (ref: JsonValue, context?: JsonValue) =>
      parseEntityRef(ref as string, context as JsonObject),
    pick: (obj: JsonValue, key: JsonValue) => get(obj, key as string),
    projectSlug: repoUrl => {
      const { owner, repo } = parseRepoUrl(repoUrl as string, integrations);
      return `${owner}/${repo}`;
    },
  };
};
