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

import React, { ReactNode } from 'react';
import { ErrorPanel } from '@backstage/core-components';
import { ApiRef, useApp } from '@backstage/core-plugin-api';
import { Button } from '@material-ui/core';
import { useCookieAuthRefresh } from '../../hooks';
import { AuthApi } from '../../types';

export function CookieAuthRefreshProvider<T extends AuthApi>({
  apiRef,
  children,
}: {
  apiRef: ApiRef<T>;
  children: ReactNode;
}) {
  const app = useApp();
  const { Progress } = app.getComponents();

  const { state, actions } = useCookieAuthRefresh({ apiRef });

  if (state.status === 'error' && state.error) {
    return (
      <ErrorPanel error={state.error}>
        <Button variant="outlined" onClick={actions.execute}>
          Retry
        </Button>
      </ErrorPanel>
    );
  }

  if (state.status === 'loading') {
    return <Progress />;
  }

  return children;
}
