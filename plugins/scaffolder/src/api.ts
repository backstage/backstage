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

import { createApiRef } from '@backstage/core';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';

export const scaffolderApiRef = createApiRef<ScaffolderApi>({
  id: 'plugin.scaffolder.service',
  description: 'Used to make requests towards the scaffolder backend',
});

export class ScaffolderApi {
  private apiOrigin: string;
  private basePath: string;

  constructor({
    apiOrigin,
    basePath,
  }: {
    apiOrigin: string;
    basePath: string;
  }) {
    this.apiOrigin = apiOrigin;
    this.basePath = basePath;
  }

  async scaffold(
    template: TemplateEntityV1alpha1,
    values: Record<string, any>,
  ) {
    const url = `${this.apiOrigin}${this.basePath}/jobs`;
    const { id: jobId } = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ template, values }),
    }).then(x => x.json());

    return jobId;
  }

  async getJob(jobId: string) {
    const url = `${this.apiOrigin}${this.basePath}/job/${encodeURIComponent(
      jobId,
    )}`;
    return fetch(url).then(x => x.json());
  }
}
