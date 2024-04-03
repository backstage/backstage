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

import React, { ReactNode, useEffect, useState } from 'react';
import { CookieAuthRefreshProvider } from '@backstage/plugin-auth-react';
import { CompatAppProgress } from '../CompatAppProgress';

/**
 * @public
 * A provider that will protect the app when running in protected experimental mode.
 */
export function AppMode(props: { children: ReactNode }): JSX.Element {
  const { children } = props;

  const [appMode, setAppMode] = useState<string | null>(null);

  useEffect(() => {
    const element = document.querySelector('meta[name="backstage-app-mode"]');
    setAppMode(element?.getAttribute('content') ?? 'public');
  }, [setAppMode]);

  if (!appMode) {
    return <CompatAppProgress />;
  }

  if (appMode === 'protected') {
    return (
      <CookieAuthRefreshProvider pluginId="app">
        {children}
      </CookieAuthRefreshProvider>
    );
  }

  return <>{children}</>;
}
