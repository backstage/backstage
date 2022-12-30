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

import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  PropsWithChildren,
} from 'react';

import { drawerContext, sidebarContext } from './context';
import { makeDrawerKey } from './keys';
import type { DrawerContext, RealDrawer, Drawer } from './types';

/** @internal */
export interface DrawerProviderProps {
  drawer: RealDrawer;
}

/** @internal */
export const DrawerProvider = ({
  children,
  drawer,
}: PropsWithChildren<DrawerProviderProps>) => {
  const { setInteractiveDrawers } = useContext(sidebarContext);
  const [newTitle, setTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    drawer.title = newTitle!;
  }, [drawer, newTitle]);

  const partialContext = useMemo(
    (): Omit<DrawerContext, 'hideInteractiveDrawer'> => ({
      drawer: {
        ...drawer,
        title: newTitle ?? drawer.title,
      },
      showInteractiveDrawer(_drawer: Partial<Drawer>) {
        setInteractiveDrawers(drawers => {
          // Ensure children are removed
          const index = drawers.indexOf(drawer);

          if (!_drawer.content) {
            if (index !== -1) return drawers.slice(0, index + 1);
            return [...drawers];
          }

          return [
            ...drawers.slice(0, index + 1),
            { ..._drawer, title: _drawer.title ?? '', key: makeDrawerKey() },
          ];
        });
      },
      setTitle,
    }),
    // We need drawer.key to trigger context/hook updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawer, newTitle, setInteractiveDrawers],
  );

  const context = useMemo(
    (): DrawerContext => ({
      ...partialContext,
      hideInteractiveDrawer() {
        partialContext.showInteractiveDrawer({ title: '', content: undefined });
      },
    }),
    // We need drawer.key to trigger context/hook updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partialContext, drawer.key],
  );

  return <drawerContext.Provider value={context} children={children} />;
};
