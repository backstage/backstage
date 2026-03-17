/*
 * Copyright 2025 The Backstage Authors
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

import type { PluginHeaderProps } from './types';
import { Tabs, TabList, Tab } from '../Tabs';
import { useDefinition } from '../../hooks/useDefinition';
import { PluginHeaderDefinition } from './definition';
import { type NavigateOptions } from 'react-router-dom';
import { Children, useMemo, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { Box } from '../Box';
import { Link } from 'react-aria-components';
import { RiShapesLine } from '@remixicon/react';
import { Text } from '../Text';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

/**
 * A component that renders a plugin header with icon, title, custom actions,
 * and navigation tabs.
 *
 * @public
 */
export const PluginHeader = (props: PluginHeaderProps) => {
  const { ownProps } = useDefinition(PluginHeaderDefinition, props);
  const {
    classes,
    tabs,
    icon,
    title,
    titleLink,
    customActions,
    onTabSelectionChange,
  } = ownProps;

  const hasTabs = tabs && tabs.length > 0;
  const headerRef = useRef<HTMLElement>(null);
  const toolbarWrapperRef = useRef<HTMLDivElement>(null);
  const toolbarContentRef = useRef<HTMLDivElement>(null);
  const toolbarControlsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastAppliedHeightRef = useRef<number | undefined>(undefined);

  const actionChildren = useMemo(() => {
    return Children.toArray(customActions);
  }, [customActions]);

  useIsomorphicLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) {
      return undefined;
    }

    const cancelScheduledUpdate = () => {
      if (animationFrameRef.current === undefined) {
        return;
      }

      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    };

    const applyHeight = (height: number) => {
      if (lastAppliedHeightRef.current === height) {
        return;
      }

      lastAppliedHeightRef.current = height;
      document.documentElement.style.setProperty(
        '--bui-header-height',
        `${height}px`,
      );
    };

    const scheduleHeightUpdate = () => {
      cancelScheduledUpdate();
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = undefined;
        applyHeight(el.offsetHeight);
      });
    };

    // Set height once immediately so the initial layout is correct.
    applyHeight(el.offsetHeight);

    // Observe for resize changes if ResizeObserver is available
    // (not present in Jest/jsdom by default)
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        cancelScheduledUpdate();
        lastAppliedHeightRef.current = undefined;
        document.documentElement.style.removeProperty('--bui-header-height');
      };
    }

    const observer = new ResizeObserver(() => {
      scheduleHeightUpdate();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelScheduledUpdate();
      lastAppliedHeightRef.current = undefined;
      document.documentElement.style.removeProperty('--bui-header-height');
    };
  }, []);

  const titleContent = (
    <>
      <div className={classes.toolbarIcon}>{icon || <RiShapesLine />}</div>
      <Text variant="body-medium">{title || 'Your plugin'}</Text>
    </>
  );

  return (
    <header ref={headerRef} className={classes.root}>
      <div className={classes.toolbar} data-has-tabs={hasTabs}>
        <div className={classes.toolbarWrapper} ref={toolbarWrapperRef}>
          <div className={classes.toolbarContent} ref={toolbarContentRef}>
            <Text as="h1" variant="body-medium">
              {titleLink ? (
                <Link className={classes.toolbarName} href={titleLink}>
                  {titleContent}
                </Link>
              ) : (
                <div className={classes.toolbarName}>{titleContent}</div>
              )}
            </Text>
          </div>
          <div className={classes.toolbarControls} ref={toolbarControlsRef}>
            {actionChildren}
          </div>
        </div>
      </div>
      {tabs && (
        <Box bg="neutral" className={classes.tabs}>
          <Tabs onSelectionChange={onTabSelectionChange}>
            <TabList>
              {tabs?.map(tab => (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  href={tab.href}
                  matchStrategy={tab.matchStrategy}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>
      )}
    </header>
  );
};
