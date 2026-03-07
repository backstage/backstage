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

import {
  ReactNode,
  MutableRefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '../../lib/utils';

import { SidebarConfigContext } from './config';
import { LocalStorage } from './localStorage';
import { SidebarPinStateProvider } from './SidebarPinStateContext';

export type SidebarPageClassKey = 'root';

/**
 * Props for SidebarPage
 *
 * @public
 */
export type SidebarPageProps = {
  children?: ReactNode;
};

type PageContextType = {
  content: {
    contentRef?: MutableRefObject<HTMLElement | null>;
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

  // Replace MUI useMediaQuery with native window.matchMedia
  // MUI breakpoints.down('xs') = max-width: 599.95px; noSsr: true means initially false
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const mql = window.matchMedia('(max-width: 599.95px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const toggleSidebarPinState = () => setIsPinned(!isPinned);

  return (
    <SidebarPinStateProvider
      value={{
        isPinned,
        toggleSidebarPinState,
        isMobile,
      }}
    >
      <PageContext.Provider value={pageContext}>
        <div
          className={cn(
            'w-full transition-[padding-left] duration-100 ease-out isolate',
            'overflow-x-hidden',
            'print:!p-0',
          )}
          style={
            isMobile
              ? { paddingBottom: sidebarConfig.mobileSidebarHeight }
              : {
                  paddingLeft: isPinned
                    ? sidebarConfig.drawerWidthOpen
                    : sidebarConfig.drawerWidthClosed,
                }
          }
        >
          {props.children}
        </div>
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
