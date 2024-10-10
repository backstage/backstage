/*
 * Copyright 2024 The Backstage Authors
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
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
} from '@backstage/plugin-scaffolder-react';

const scaffolderApi = {
  dryRun: async (
    baseUrl: string,
    options: ScaffolderDryRunOptions,
  ): Promise<ScaffolderDryRunResponse> => {
    const response = await fetch(`${baseUrl}/api/scaffolder/v2/dry-run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.TOKEN
          ? { Authorization: `Bearer ${process.env.TOKEN}` }
          : {}),
      },
      body: JSON.stringify(options),
    });
    return await response.json();
  },
};

export { scaffolderApi };
