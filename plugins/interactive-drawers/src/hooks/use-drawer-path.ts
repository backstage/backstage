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

import { useMemo } from 'react';

import { useDrawer, useSidebarRoot } from '../contexts';

export interface UseDrawerPathResult {
  /**
   * The path of the current drawer, or if it doesn't have a path, its parent
   * drawer(s)
   */
  path: string | undefined;

  /**
   * An array of all paths in the drawer stack
   */
  allPaths: string[];

  /**
   * Returns true if the next drawer has the specified path
   */
  nextIs: (path: string) => boolean;
}

/**
 * Gets drawer path information
 *
 * @returns A {@link UseDrawerPathResult} object
 */
export function useDrawerPath(): UseDrawerPathResult {
  const sidebar = useSidebarRoot();
  const { drawer } = useDrawer();

  const drawerIndex = sidebar.interactiveDrawers.findIndex(
    d => d.key === drawer.key,
  );

  // All drawers up until the current one (but not the ones after)
  const drawerChain =
    drawerIndex === -1
      ? []
      : sidebar.interactiveDrawers.slice(0, drawerIndex + 1).reverse();

  const sidebarKey = drawerChain
    .map(({ key, content }) => `${key}--${content?.path}`)
    .join('::');

  const allPaths = sidebar.interactiveDrawers
    .map(d => d.content?.path)
    .filter((v): v is NonNullable<typeof v> => !!v);
  const pathsKey = allPaths.join('::');

  return useMemo(
    () => ({
      path: drawerChain.find(d => d.content?.path)?.content?.path,
      allPaths,
      nextIs(path: string) {
        if (sidebar.interactiveDrawers.length <= drawerIndex + 1) {
          return false;
        }
        return (
          sidebar.interactiveDrawers[drawerIndex + 1].content?.path === path
        );
      },
    }),
    // This is a more efficient memo key
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sidebarKey, pathsKey, drawerIndex],
  );
}
