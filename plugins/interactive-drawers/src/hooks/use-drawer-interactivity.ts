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

import { MouseEvent, useCallback, useMemo } from 'react';

import { useDrawer } from '../contexts';
import { useDrawerMatch } from '../routed-drawers';
import { useDrawerPath } from './use-drawer-path';

/**
 * @public
 */
export interface UseDrawerInteractivityOptions {
  /**
   * An optional title to set of the drawer to (potentially) open
   */
  title?: string;
}

/**
 * Returns helpers for constructing interactive links or buttons to opening up a
 * drawer for a certain path
 *
 * @param path The path to the drawer to open
 * @param options Optional options of {@link UseDrawerInteractivityOptions}
 * @returns
 */
export function useDrawerInteractivity(
  path: string | undefined,
  options?: UseDrawerInteractivityOptions,
) {
  const { title = '' } = options ?? {};

  const { showInteractiveDrawer, hideInteractiveDrawer } = useDrawer();
  const drawerPath = useDrawerPath();

  const view = useDrawerMatch(path);

  const isPathToThis = path !== undefined && path === drawerPath.path;

  const drawerIsOpen = path !== undefined && drawerPath.nextIs(path);

  const onClick = useCallback(
    (ev?: MouseEvent) => {
      ev?.preventDefault();
      if (drawerIsOpen) {
        hideInteractiveDrawer();
      } else if (path) {
        showInteractiveDrawer({ content: { path }, title });
      }
    },
    [title, path, drawerIsOpen, showInteractiveDrawer, hideInteractiveDrawer],
  );

  const supportsDrawer = !!view && !isPathToThis;

  return useMemo(
    () => ({
      supportsDrawer,
      drawerIsOpen: supportsDrawer ? drawerIsOpen : false,
      toggleDrawer: supportsDrawer ? onClick : () => {},
    }),
    [supportsDrawer, drawerIsOpen, onClick],
  );
}
