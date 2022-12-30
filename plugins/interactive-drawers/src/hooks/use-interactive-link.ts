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

import { useDrawerMatch } from '../routed-drawers';

import { useCleanPath } from './use-clean-path';
import { useDrawerButton } from './use-drawer-button';
import { useDrawerPath } from './use-drawer-path';
import { useDrawerTitle } from './use-drawer-title';

/**
 * @public
 */
export interface UseInteractiveLinkOptions {
  /** Title of the link (optional) */
  title?: string;

  /** url or path */
  to: string;
}

/**
 * Helper function for creating an interactive link, given a url/path and
 * optionally a title.
 *
 * @public
 */
export function useInteractiveLink(options: UseInteractiveLinkOptions) {
  const path = useCleanPath(options.to);

  const drawerView = useDrawerMatch(path);
  const drawerTitle = useDrawerTitle(drawerView?.title, path);

  const currentDrawerPath = useDrawerPath().path;

  const drawerButton = useDrawerButton(path);

  return {
    to: path,
    title: options.title ?? drawerTitle,
    currentDrawerPath,
    drawerView,
    ...drawerButton,
  };
}
