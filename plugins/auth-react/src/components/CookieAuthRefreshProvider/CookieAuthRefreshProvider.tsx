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
import { Button } from '@material-ui/core';
import { useCookieAuthRefresh } from '../../hooks';
import { CompatAppProgress } from './CompatAppProgress';

/**
 * @public
 * Props for the {@link CookieAuthRefreshProvider} component.
 */
export type CookieAuthRefreshProviderProps = {
  // The plugin ID used for discovering the API origin
  pluginId: string;
  // The path used for calling the refresh cookie endpoint, default to '/cookie'
  path?: string;
  // The children to render when the refresh is successful
  children: ReactNode;
};

/**
 * @public
 * A provider that will refresh the cookie when it is about to expire.
 */
export function CookieAuthRefreshProvider(
  props: CookieAuthRefreshProviderProps,
): JSX.Element {
  const { children, ...options } = props;

  const result = useCookieAuthRefresh(options);

  if (result.status === 'loading') {
    // This component should be compatible with both old and new frontend systems
    return <CompatAppProgress />;
  }

  if (result.status === 'error') {
    return (
      <ErrorPanel error={result.error}>
        <Button variant="outlined" onClick={result.retry}>
          Retry
        </Button>
      </ErrorPanel>
    );
  }

  return <>{children}</>;
}
