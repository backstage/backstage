import { BackstageTheme } from '@backstage/theme';
/*
 * Copyright 2020 The Backstage Authors
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

import { makeStyles } from '@material-ui/core/styles';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { sidebarConfig } from './config';
import { LocalStorage } from './localStorage';

export type SidebarPageClassKey = 'root';

const useStyles = makeStyles<BackstageTheme, { isPinned?: boolean }>(
  {
    root: {
      width: '100%',
      minHeight: '100%',
      transition: 'padding-left 0.1s ease-out',
      isolation: 'isolate',
      paddingLeft: ({ isPinned }) =>
        isPinned
          ? sidebarConfig.drawerWidthOpen
          : sidebarConfig.drawerWidthClosed,
    },
    content: {
      zIndex: 0,
      isolation: 'isolate',
      '&:focus': {
        outline: 0,
      },
    },
  },
  { name: 'BackstageSidebarPage' },
);

export type SidebarPinStateContextType = {
  isPinned: boolean;
  toggleSidebarPinState: () => any;
};

export type SidebarPageContextType = {
  contentRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export const SidebarPinStateContext = createContext<SidebarPinStateContextType>(
  {
    isPinned: false,
    toggleSidebarPinState: () => {},
  },
);

const SidebarPageContext = createContext<SidebarPageContextType>({});

export function SidebarPage(props: PropsWithChildren<{}>) {
  const [isPinned, setIsPinned] = useState(() =>
    LocalStorage.getSidebarPinState(),
  );

  useEffect(() => {
    LocalStorage.setSidebarPinState(isPinned);
  }, [isPinned]);

  const toggleSidebarPinState = () => setIsPinned(!isPinned);

  const classes = useStyles({ isPinned });
  const contentRef = useRef(null);
  return (
    <SidebarPinStateContext.Provider
      value={{
        isPinned,
        toggleSidebarPinState,
      }}
    >
      <SidebarPageContext.Provider value={{ contentRef }}>
        <div className={classes.root}>{props.children}</div>
      </SidebarPageContext.Provider>
    </SidebarPinStateContext.Provider>
  );
}

export function SideBarPageContent(props: PropsWithChildren<{}>) {
  const { contentRef } = useContext(SidebarPageContext);
  const classes = useStyles({});

  return (
    <div ref={contentRef} tabIndex={-1} className={classes.content}>
      {props.children}
    </div>
  );
}

export function useContentRef() {
  const { contentRef } = useContext(SidebarPageContext);
  return contentRef;
}
