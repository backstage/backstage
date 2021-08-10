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

import { FieldValidation } from '@rjsf/core';
import { ApiHolder } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

export const repoPickerValidation = (
  value: string,
  validation: FieldValidation,
  context: { apiHolder: ApiHolder },
) => {
  try {
    const { host, searchParams } = new URL(`https://${value}`);

    const integrationApi = context.apiHolder.get(scmIntegrationsApiRef);

    if (!host) {
      validation.addError(
        'Incomplete repository location provided, host not provided',
      );
    } else {
      if (integrationApi?.byHost(host)?.type === 'bitbucket') {
        // workspace is only applicable for bitbucket cloud
        if (host === 'bitbucket.org' && !searchParams.get('workspace')) {
          validation.addError(
            'Incomplete repository location provided, workspace not provided',
          );
        }

        if (!searchParams.get('project')) {
          validation.addError(
            'Incomplete repository location provided, project not provided',
          );
        }
      }
      // For anything other than bitbucket
      else {
        if (!searchParams.get('owner')) {
          validation.addError(
            'Incomplete repository location provided, owner not provided',
          );
        }
      }

      // Do this for all hosts
      if (!searchParams.get('repo')) {
        validation.addError(
          'Incomplete repository location provided, repo not provided',
        );
      }
    }

    // if (!host || !searchParams.get('owner') || !searchParams.get('repo')) {
  } catch {
    validation.addError('Unable to parse the Repository URL');
  }
};
