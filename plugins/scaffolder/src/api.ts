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

  /**
   *
   * @param template Template entity for the scaffolder to use. New project is going to be created out of this template.
   * @param values Parameters for the template, e.g. name, description
   */
  async scaffold(
    template: TemplateEntityV1alpha1,
    values: Record<string, any>,
  ) {
    const url = `${this.apiOrigin}${this.basePath}/jobs`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // TODO(shmidt-i): when repo picker is implemented, take isOrg from it
      body: JSON.stringify({ template, values: { ...values, isOrg: true } }),
    });

    if (response.status !== 201) {
      throw new Error(await response.text());
    }

    const { id } = await response.json();
    return id;
  }

  async getJob(jobId: string) {
    const url = `${this.apiOrigin}${this.basePath}/job/${encodeURIComponent(
      jobId,
    )}`;
    return fetch(url).then(x => x.json());
  }
}
