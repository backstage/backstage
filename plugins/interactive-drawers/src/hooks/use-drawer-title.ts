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

import { useAsync } from 'react-use';

import { DrawerView, useDrawerMatch } from '../routed-drawers';

export function useDrawerTitle(
  title: DrawerView['title'],
  path: string | undefined,
) {
  const { value: titleText } = useAsync(async () => {
    if (!title) {
      return undefined;
    } else if (typeof title === 'string') {
      return title;
    }
    return title();
  }, [title]);

  return titleText ?? withoutSlash(path);
}

export function useDrawerTitleByPath(path: string | undefined) {
  const renderView = useDrawerMatch(path);

  return useDrawerTitle(renderView?.title, path);
}

function withoutSlash(path: string | undefined): string {
  if (!path) {
    return '';
  }
  return path.endsWith('/') ? path.slice(0, path.length - 1) : path;
}
