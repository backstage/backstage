/*
 * Copyright 2022 The Backstage Authors
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

import { useContext, useMemo } from 'react';

import { drawerContext, sidebarContext } from './context';
import { makeDrawerKey } from './keys';
import type { DrawerContext, RealDrawer } from './types';

/**
 * Returns utility functions to work with the sidebar
 *
 * @public
 */
export function useSidebarRoot() {
  return useContext(sidebarContext);
}

/**
 * Returns utility functions to work with the current drawer
 *
 * @public
 */
export function useDrawer(): DrawerContext {
  const sidebar = useSidebarRoot();
  const ctx = useContext(drawerContext);

  return useMemo(
    () =>
      ctx ?? {
        drawer: {
          key: '',
          title: '',
          content: undefined,
        },
        hideInteractiveDrawer() {
          sidebar.setInteractiveDrawers([]);
        },
        showInteractiveDrawer(drawer: Partial<RealDrawer>) {
          sidebar.setInteractiveDrawers([
            {
              ...drawer,
              key: drawer.key ?? makeDrawerKey(),
              title: drawer.title ?? '',
            },
          ]);
        },
        setTitle(_title) {},
      },
    [sidebar, ctx],
  );
}
