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

import React from 'react';
// TODO: Dependency on MUI should be removed from core packages
import Button from '@material-ui/core/Button';

import {
  createComponentExtension,
  coreComponentRefs,
} from '@backstage/frontend-plugin-api';
import { ErrorPanel } from '@backstage/core-components';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { components as defaultComponents } from '../../../../packages/app-defaults/src/defaults';

export const DefaultProgressComponent = createComponentExtension({
  ref: coreComponentRefs.progress,
  loader: { sync: () => defaultComponents.Progress },
});

export const DefaultNotFoundErrorPageComponent = createComponentExtension({
  ref: coreComponentRefs.notFoundErrorPage,
  loader: { sync: () => defaultComponents.NotFoundErrorPage },
});

export const DefaultErrorBoundaryComponent = createComponentExtension({
  ref: coreComponentRefs.errorBoundaryFallback,
  loader: {
    sync: () => props => {
      const { plugin, error, resetError } = props;
      const title = `Error in ${plugin?.id}`;

      return (
        <ErrorPanel title={title} error={error} defaultExpanded>
          <Button variant="outlined" onClick={resetError}>
            Retry
          </Button>
        </ErrorPanel>
      );
    },
  },
});
