/*
 * Copyright 2021 The Backstage Authors
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
  ComponentType,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Drawer, DrawerProps } from '@material-ui/core';

export interface DrawerComponentProps<T> {
  value: T;
  close: () => void;
}

export interface DrawerHook<T> {
  openDrawer: (value: T) => void;
  closeDrawer: () => void;
}

export type DrawerProviderProps = Omit<DrawerProps, 'open' | 'onClose'>;

export interface ConstructedDrawer<T> {
  Provider: ComponentType<PropsWithChildren<DrawerProviderProps>>;
  useDrawer: () => DrawerHook<T>;
}

export type DrawerWrapperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function createDrawer<T>(
  Component: ComponentType<DrawerComponentProps<T>>,
  wrapperProps?: DrawerWrapperProps,
): ConstructedDrawer<T> {
  const context = createContext<DrawerHook<T>>(undefined as any);

  function Provider(props: PropsWithChildren<DrawerProviderProps>) {
    const { children, ...drawerProps } = props;
    const [openedValue, setOpenedValue] = useState<T | undefined>();

    const closeDrawer = useCallback(
      () => setOpenedValue(undefined),
      [setOpenedValue],
    );

    const hookData = useMemo(
      (): DrawerHook<T> => ({
        openDrawer: setOpenedValue,
        closeDrawer,
      }),
      [setOpenedValue, closeDrawer],
    );

    return (
      <context.Provider value={hookData}>
        {children}
        <Drawer {...drawerProps} open={!!openedValue} onClose={closeDrawer}>
          <div {...wrapperProps}>
            {!openedValue ? null : (
              <Component value={openedValue} close={closeDrawer} />
            )}
          </div>
        </Drawer>
      </context.Provider>
    );
  }

  function useDrawer(): DrawerHook<T> {
    return useContext(context);
  }

  return { Provider, useDrawer };
}
