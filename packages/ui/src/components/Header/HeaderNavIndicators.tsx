/*
 * Copyright 2026 The Backstage Authors
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

import { useCallback, useEffect, useRef } from 'react';

interface HeaderNavIndicatorsProps {
  navRef: React.RefObject<HTMLElement | null>;
  itemRefs: React.MutableRefObject<Map<string, HTMLElement>>;
  activeKey: string | undefined;
  highlightedKey: string | null;
  classes: {
    active: string;
    hovered: string;
  };
}

export function HeaderNavIndicators(props: HeaderNavIndicatorsProps) {
  const { navRef, itemRefs, activeKey, highlightedKey, classes } = props;
  const prevActiveKey = useRef<string | null>(null);
  const prevHoveredKey = useRef<string | null>(null);
  const resetTimer = useRef<number | null>(null);

  const updateCSSVariables = useCallback(() => {
    const container = navRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Active indicator
    if (activeKey) {
      const el = itemRefs.current.get(activeKey);
      if (el) {
        const rect = el.getBoundingClientRect();
        const relativeLeft = rect.left - containerRect.left;
        const relativeTop = rect.top - containerRect.top;

        if (prevActiveKey.current === null) {
          container.style.setProperty('--active-transition-duration', '0s');
          requestAnimationFrame(() => {
            container.style.setProperty(
              '--active-transition-duration',
              '0.25s',
            );
          });
        } else {
          container.style.setProperty('--active-transition-duration', '0.25s');
        }

        container.style.setProperty('--active-tab-left', `${relativeLeft}px`);
        container.style.setProperty('--active-tab-width', `${rect.width}px`);
        container.style.setProperty('--active-tab-height', `${rect.height}px`);
        container.style.setProperty('--active-tab-top', `${relativeTop}px`);
        container.style.setProperty('--active-tab-opacity', '1');
        prevActiveKey.current = activeKey;
      }
    } else {
      container.style.setProperty('--active-tab-opacity', '0');
      prevActiveKey.current = null;
    }

    // Highlight indicator (follows whichever interaction happened last — hover or focus)
    if (highlightedKey) {
      if (resetTimer.current !== null) {
        cancelAnimationFrame(resetTimer.current);
        resetTimer.current = null;
      }
      const el = itemRefs.current.get(highlightedKey);
      if (el) {
        const rect = el.getBoundingClientRect();
        const relativeLeft = rect.left - containerRect.left;
        const relativeTop = rect.top - containerRect.top;

        if (prevHoveredKey.current === null) {
          container.style.setProperty('--hovered-transition-duration', '0s');
          requestAnimationFrame(() => {
            container.style.setProperty(
              '--hovered-transition-duration',
              '0.2s',
            );
          });
        } else {
          container.style.setProperty('--hovered-transition-duration', '0.2s');
        }

        container.style.setProperty('--hovered-tab-left', `${relativeLeft}px`);
        container.style.setProperty('--hovered-tab-top', `${relativeTop}px`);
        container.style.setProperty('--hovered-tab-width', `${rect.width}px`);
        container.style.setProperty('--hovered-tab-height', `${rect.height}px`);
        container.style.setProperty('--hovered-tab-opacity', '1');
        prevHoveredKey.current = highlightedKey;
      }
    } else {
      container.style.setProperty('--hovered-tab-opacity', '0');
      resetTimer.current = requestAnimationFrame(() => {
        prevHoveredKey.current = null;
        resetTimer.current = null;
      });
    }
  }, [activeKey, highlightedKey, navRef, itemRefs]);

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
      <div className={classes.active} />
      <div className={classes.hovered} />
    </>
  );
}
