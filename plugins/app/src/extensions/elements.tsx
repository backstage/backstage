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

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { AppRootElementBlueprint } from '@backstage/frontend-plugin-api';
import React from 'react';

export const oauthRequestDialogAppRootElement = AppRootElementBlueprint.make({
  name: 'oauth-request-dialog',
  params: {
    element: <OAuthRequestDialog />,
  },
});

export const alertDisplayAppRootElement =
  AppRootElementBlueprint.makeWithOverrides({
    name: 'alert-display',
    config: {
      schema: {
        transientTimeoutMs: z => z.number().default(5000),
        anchorOrigin: z =>
          z
            .object({
              vertical: z.enum(['top', 'bottom']).default('top'),
              horizontal: z.enum(['left', 'center', 'right']).default('center'),
            })
            .default({}),
      },
    },
    factory: (originalFactory, { config }) => {
      return originalFactory({
        element: () => <AlertDisplay {...config} />,
      });
    },
  });
