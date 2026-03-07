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

import { cn } from '../../lib/utils';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

import {
  makeSidebarConfig,
  makeSidebarSubmenuConfig,
  SidebarConfig,
  SidebarConfigContext,
  SidebarOptions,
  SubmenuConfig,
  SubmenuOptions,
} from './config';
import { MobileSidebar } from './MobileSidebar';
import { useContent } from './Page';
import { SidebarOpenStateProvider } from './SidebarOpenStateContext';
import { useSidebarPinState } from './SidebarPinStateContext';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { coreComponentsTranslationRef } from '../../translation';

/** @public */
export type SidebarClassKey = 'drawer' | 'drawerOpen';
/**
 * Returns Tailwind CSS class sets for the sidebar root, drawer, and
 * visually-hidden skip-to-content button. Replaces the former MUI
 * `makeStyles` call with zero-runtime utility classes.
 *
 * @remarks
 * Dynamic drawer widths (open/closed) are applied via inline `style`
 * props in the consuming components because they depend on the runtime
 * `sidebarConfig` values. Transition timing for the open state
 * (`duration-[250ms]`) is toggled at the call site with `cn()`.
 */
function getSidebarClasses(_sidebarConfig: SidebarConfig) {
  return {
    root: 'fixed left-0 top-0 bottom-0 z-[1100]',
    drawer: cn(
      'flex flex-col items-start',
      'fixed left-0 top-0 bottom-0',
      'bg-[var(--sidebar-nav-bg,#171717)]',
      'overflow-x-hidden',
      '[scrollbar-width:none] [-ms-overflow-style:none]',
      'transition-[width] duration-200 ease-[cubic-bezier(0.4,0,0.6,1)]',
      '[&>*]:shrink-0',
      '[&::-webkit-scrollbar]:hidden',
      'print:hidden',
    ),
    visuallyHidden: cn(
      'absolute top-0 z-[1000]',
      '-translate-y-[200%]',
      'focus:translate-y-[5px]',
    ),
  };
}

const State = {
  Closed: 0,
  Idle: 1,
  Open: 2,
} as const;

/** @public */
export type SidebarProps = {
  openDelayMs?: number;
  closeDelayMs?: number;
  sidebarOptions?: SidebarOptions;
  submenuOptions?: SubmenuOptions;
  disableExpandOnHover?: boolean;
  children?: ReactNode;
};

export type DesktopSidebarProps = {
  openDelayMs?: number;
  closeDelayMs?: number;
  disableExpandOnHover?: boolean;
  children?: ReactNode;
};

/**
 * Places the Sidebar & wraps the children providing context weather the `Sidebar` is open or not.
 *
 * Handles & delays hover events for expanding the `Sidebar`
 *
 * @param props `disableExpandOnHover` disables the default hover behaviour;
 * `openDelayMs` & `closeDelayMs` set delay until sidebar will open/close on hover
 * @returns
 * @internal
 */
const DesktopSidebar = (props: DesktopSidebarProps) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const {
    openDelayMs = sidebarConfig.defaultOpenDelayMs,
    closeDelayMs = sidebarConfig.defaultCloseDelayMs,
    disableExpandOnHover,
    children,
  } = props;

  const classes = getSidebarClasses(sidebarConfig);

  // Replaces MUI useMediaQuery — MUI's `breakpoints.down('md')` resolves to
  // `(max-width: 959.95px)`. The `noSsr: true` option is preserved by
  // initialising state to `false` and updating on mount via useEffect.
  // Guard against environments where matchMedia is unavailable (JSDOM/SSR).
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return undefined;
    }
    const mql = window.matchMedia('(max-width: 959.95px)');
    setIsSmallScreen(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  const [state, setState] = useState<(typeof State)[keyof typeof State]>(
    State.Closed,
  );
  const hoverTimerRef = useRef<number>();
  const { isPinned, toggleSidebarPinState } = useSidebarPinState();

  const handleOpen = () => {
    if (isPinned || disableExpandOnHover) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state !== State.Open && !isSmallScreen) {
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Open);
      }, openDelayMs);

      setState(State.Idle);
    }
  };

  const handleClose = () => {
    if (isPinned || disableExpandOnHover) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state === State.Idle) {
      setState(State.Closed);
    } else if (state === State.Open) {
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Closed);
      }, closeDelayMs);
    }
  };

  const isOpen = (state === State.Open && !isSmallScreen) || isPinned;

  /**
   * Close/Open Sidebar directly without delays. Also toggles `SidebarPinState` to avoid hidden content behind Sidebar.
   */
  const setOpen = (open: boolean) => {
    if (open) {
      setState(State.Open);
      toggleSidebarPinState();
    } else {
      setState(State.Closed);
      toggleSidebarPinState();
    }
  };

  return (
    <nav
      style={
        {
          /* Force white focus ring on all sidebar descendants.
             The sidebar always uses a dark surface (#171717) regardless
             of theme mode, so white ring provides WCAG 2.4.7 / 2.4.11
             compliant ≥3:1 contrast.  The custom property is inherited
             by all children and consumed by Tailwind's ring-* utilities
             via var(--tw-ring-color, currentcolor). */
          '--tw-ring-color': '#fff',
        } as React.CSSProperties
      }
      aria-label="sidebar nav"
    >
      <A11ySkipSidebar />
      <SidebarOpenStateProvider value={{ isOpen, setOpen }}>
        <div
          className={classes.root}
          data-testid="sidebar-root"
          onMouseEnter={disableExpandOnHover ? () => {} : handleOpen}
          onFocus={disableExpandOnHover ? () => {} : handleOpen}
          onMouseLeave={disableExpandOnHover ? () => {} : handleClose}
          onBlur={disableExpandOnHover ? () => {} : handleClose}
        >
          <div
            className={cn(classes.drawer, isOpen && 'duration-[250ms]')}
            style={{
              width: isOpen
                ? sidebarConfig.drawerWidthOpen
                : sidebarConfig.drawerWidthClosed,
            }}
          >
            {children}
          </div>
        </div>
      </SidebarOpenStateProvider>
    </nav>
  );
};

/**
 * Passing children into the desktop or mobile sidebar depending on the context
 *
 * @public
 */
export const Sidebar = (props: SidebarProps) => {
  const sidebarConfig: SidebarConfig = makeSidebarConfig(
    props.sidebarOptions ?? {},
  );
  const submenuConfig: SubmenuConfig = makeSidebarSubmenuConfig(
    props.submenuOptions ?? {},
  );
  const { children, disableExpandOnHover, openDelayMs, closeDelayMs } = props;
  const { isMobile } = useSidebarPinState();

  return isMobile ? (
    <MobileSidebar>{children}</MobileSidebar>
  ) : (
    <SidebarConfigContext.Provider value={{ sidebarConfig, submenuConfig }}>
      <DesktopSidebar
        openDelayMs={openDelayMs}
        closeDelayMs={closeDelayMs}
        disableExpandOnHover={disableExpandOnHover}
      >
        {children}
      </DesktopSidebar>
    </SidebarConfigContext.Provider>
  );
};

function A11ySkipSidebar() {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const { focusContent, contentRef } = useContent();
  const classes = getSidebarClasses(sidebarConfig);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  /**
   * Always render the skip-to-content button for WCAG 2.4.1 compliance.
   * When contentRef is available, focus it directly. Otherwise, fall back
   * to the first <main> element in the document.
   */
  const handleSkip = () => {
    if (contentRef?.current) {
      focusContent();
    } else {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        if (!mainEl.hasAttribute('tabindex')) {
          mainEl.setAttribute('tabindex', '-1');
        }
        mainEl.focus();
      }
    }
  };

  return (
    <button
      onClick={handleSkip}
      className={cn(
        classes.visuallyHidden,
        'px-4 py-2 bg-[var(--primary,#1f5493)] text-[var(--primary-foreground,#fff)] rounded shadow-md',
        'focus-visible:ring-2 focus-visible:ring-[var(--sidebar-primary,#fff)]',
      )}
    >
      {t('skipToContent')}
    </button>
  );
}
