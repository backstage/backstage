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
import { BackstageTheme } from '@backstage/theme';
import Box from '@mui/material/Box';
import { makeStyles } from 'tss-react/mui';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SidebarConfig, SidebarConfigContext } from './config';
import { LocalStorage } from './localStorage';
import { SidebarPinStateProvider } from './SidebarPinStateContext';
import { Theme } from '@mui/material/styles';

export type SidebarPageClassKey = 'root';

type PageStyleProps = { sidebarConfig: SidebarConfig; isPinned: boolean };

// TODO jss-to-tss-react codemod: Unable to handle style definition reliably. ArrowFunctionExpression in CSS prop.
// TODO jss-to-tss-react codemod: Unable to handle style definition reliably. ArrowFunctionExpression in CSS prop.
const useStyles = makeStyles({ name: 'BackstageSidebarPage' })(theme => ({
  root: {
    width: '100%',
    transition: 'padding-left 0.1s ease-out',
    isolation: 'isolate',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: (props: PageStyleProps) =>
        props.isPinned
          ? props.sidebarConfig.drawerWidthOpen
          : props.sidebarConfig.drawerWidthClosed,
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: (props: PageStyleProps) =>
        props.sidebarConfig.mobileSidebarHeight,
    },
  },
  content: {
    zIndex: 0,
    isolation: 'isolate',
    '&:focus': {
      outline: 0,
    },
  },
}));

/**
 * Props for SidebarPage
 *
 * @public
 */
export type SidebarPageProps = {
  children?: React.ReactNode;
};

type PageContextType = {
  content: {
    contentRef?: React.MutableRefObject<HTMLElement | null>;
  };
};

const PageContext = createContext<PageContextType>({
  content: {
    contentRef: undefined,
  },
});
export function SidebarPage(props: SidebarPageProps) {
  const [isPinned, setIsPinned] = useState(() =>
    LocalStorage.getSidebarPinState(),
  );
  const { sidebarConfig } = useContext(SidebarConfigContext);

  const contentRef = useRef(null);

  const pageContext = useMemo(
    () => ({
      content: {
        contentRef,
      },
    }),
    [contentRef],
  );

  useEffect(() => {
    LocalStorage.setSidebarPinState(isPinned);
  }, [isPinned]);

  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const toggleSidebarPinState = () => setIsPinned(!isPinned);

  const { classes } = useStyles({ isPinned, sidebarConfig });

  return (
    <SidebarPinStateProvider
      value={{
        isPinned,
        toggleSidebarPinState,
        isMobile,
      }}
    >
      <PageContext.Provider value={pageContext}>
        <Box className={classes.root}>{props.children}</Box>
      </PageContext.Provider>
    </SidebarPinStateProvider>
  );
}

/**
 * This hook provides a react ref to the main content.
 * Allows to set an element as the main content and focus on that component.
 *
 * *Note: If `contentRef` is not set `focusContent` is noop. `Content` component sets this ref automatically*
 *
 * @public
 * @example
 * Focus current content
 * ```tsx
 *  const { focusContent} = useContent();
 * ...
 *  <Button onClick={focusContent}>
 *     focus main content
 *  </Button>
 * ```
 * @example
 * Set the reference to an Html element
 * ```
 *  const { contentRef } = useContent();
 * ...
 *  <article ref={contentRef} tabIndex={-1}>Main Content</article>
 * ```
 */
export function useContent() {
  const { content } = useContext(PageContext);

  const focusContent = useCallback(() => {
    content?.contentRef?.current?.focus();
  }, [content]);

  return { focusContent, contentRef: content?.contentRef };
}
