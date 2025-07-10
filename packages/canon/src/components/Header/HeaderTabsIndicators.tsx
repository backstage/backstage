/*
 * Copyright 2024 The Backstage Authors
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

import { TabListStateContext } from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { useContext, useEffect, useCallback } from 'react';
import type { HeaderIndicatorsProps } from './types';

/**
 * A component that renders the indicators for the toolbar.
 *
 * @internal
 */
export const HeaderTabsIndicators = (props: HeaderIndicatorsProps) => {
  const { tabRefs, tabsRef, hoveredKey, prevHoveredKey } = props;
  const { classNames } = useStyles('Header');
  const state = useContext(TabListStateContext);

  const updateCSSVariables = useCallback(() => {
    if (!tabsRef.current) return;

    const tabsRect = tabsRef.current.getBoundingClientRect();

    // Set active tab variables
    if (state?.selectedKey) {
      const activeTab = tabRefs.current.get(state.selectedKey.toString());

      if (activeTab) {
        const activeRect = activeTab.getBoundingClientRect();
        const relativeLeft = activeRect.left - tabsRect.left;
        const relativeTop = activeRect.top - tabsRect.top;

        tabsRef.current.style.setProperty(
          '--active-tab-left',
          `${relativeLeft}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-right',
          `${relativeLeft + activeRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-top',
          `${relativeTop}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-bottom',
          `${relativeTop + activeRect.height}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-width',
          `${activeRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-height',
          `${activeRect.height}px`,
        );
      }
    }

    // Set hovered tab variables
    if (hoveredKey) {
      const hoveredTab = tabRefs.current.get(hoveredKey);
      if (hoveredTab) {
        const hoveredRect = hoveredTab.getBoundingClientRect();
        const relativeLeft = hoveredRect.left - tabsRect.left;
        const relativeTop = hoveredRect.top - tabsRect.top;

        tabsRef.current.style.setProperty(
          '--hovered-tab-left',
          `${relativeLeft}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-right',
          `${relativeLeft + hoveredRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-top',
          `${relativeTop}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-bottom',
          `${relativeTop + hoveredRect.height}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-width',
          `${hoveredRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-height',
          `${hoveredRect.height}px`,
        );
        // Control transition timing based on whether this is a new hover session
        const isNewHoverSession = prevHoveredKey.current === null;

        if (isNewHoverSession) {
          // Starting new hover session: no transitions for position
          tabsRef.current.style.setProperty(
            '--hovered-transition-duration',
            '0s',
          );
          // Enable transitions on next frame for future tab switches
          requestAnimationFrame(() => {
            if (tabsRef.current) {
              tabsRef.current.style.setProperty(
                '--hovered-transition-duration',
                '0.2s',
              );
            }
          });
        } else {
          // Moving between tabs in same session: full transitions
          tabsRef.current.style.setProperty(
            '--hovered-transition-duration',
            '0.2s',
          );
        }

        // Update previous hover key for next time
        prevHoveredKey.current = hoveredKey;

        tabsRef.current.style.setProperty('--hovered-tab-opacity', '1');
      }
    } else {
      // When not hovering, hide with opacity and reset for next hover session
      tabsRef.current.style.setProperty('--hovered-tab-opacity', '0');

      // Reset previous hover key so next hover is treated as new session
      prevHoveredKey.current = null;
    }
  }, [state?.selectedKey, hoveredKey]);

  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    const handleResize = () => updateCSSVariables();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCSSVariables]);

  return (
    <>
      <div className={classNames.tabActive} />
      <div className={classNames.tabHovered} />
    </>
  );
};
