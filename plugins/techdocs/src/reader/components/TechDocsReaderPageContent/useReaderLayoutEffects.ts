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

import { useCallback, useEffect } from 'react';
import type { TechDocsReaderLayout } from '../../TechDocsReaderLayout';

/** @internal */
export const useReaderLayoutEffects = ({
  dom,
  isMobileMedia,
  isStyleLoading,
  layout,
  state,
}: {
  dom: HTMLElement | null;
  isMobileMedia: boolean;
  isStyleLoading: boolean;
  layout: TechDocsReaderLayout;
  state: unknown;
}) => {
  const updateLegacySidebarPositionAndHeight = useCallback(() => {
    if (!dom) return;

    const sidebars = dom.querySelectorAll<HTMLElement>('.md-sidebar');

    sidebars.forEach(element => {
      // The legacy reader can be nested in several app layouts, so it retains
      // the existing viewport measurements. The BUI reader uses native sticky
      // positioning instead and does not call this function.
      if (isMobileMedia) {
        element.style.top = '0px';
      } else {
        const page = document?.querySelector('.techdocs-reader-page');
        const pageTop = page?.getBoundingClientRect().top ?? 0;
        let domTop = dom.getBoundingClientRect().top ?? 0;

        const tabs = dom.querySelector('.md-container > .md-tabs');
        const tabsHeight = tabs?.getBoundingClientRect().height ?? 0;

        if (domTop < pageTop) {
          domTop = pageTop;
        }

        const scrollbarTopPx = Math.max(domTop, 0) + tabsHeight;
        element.style.top = `${scrollbarTopPx}px`;

        const footer = dom.querySelector('.md-container > .md-footer');
        const scrollbarEndPx =
          footer?.getBoundingClientRect().top ?? window.innerHeight;

        element.style.height = `${scrollbarEndPx - scrollbarTopPx}px`;
      }

      element.style.setProperty('opacity', '1');
    });
  }, [dom, isMobileMedia]);

  useEffect(() => {
    if (layout !== 'legacy') return undefined;

    window.addEventListener('resize', updateLegacySidebarPositionAndHeight);
    window.addEventListener(
      'scroll',
      updateLegacySidebarPositionAndHeight,
      true,
    );
    return () => {
      window.removeEventListener(
        'resize',
        updateLegacySidebarPositionAndHeight,
      );
      window.removeEventListener(
        'scroll',
        updateLegacySidebarPositionAndHeight,
        true,
      );
    };
  }, [layout, updateLegacySidebarPositionAndHeight]);

  // The previous/next footer remains fixed in both layouts. Keep its width
  // aligned with the reader when the containing application is resized.
  const updateFooterWidth = useCallback(() => {
    if (!dom) return;
    const footer = dom.querySelector<HTMLElement>('.md-footer');
    if (footer) {
      footer.style.width = `${dom.getBoundingClientRect().width}px`;
    }
  }, [dom]);

  useEffect(() => {
    window.addEventListener('resize', updateFooterWidth);
    return () => {
      window.removeEventListener('resize', updateFooterWidth);
    };
  }, [updateFooterWidth]);

  useEffect(() => {
    if (!isStyleLoading) {
      updateFooterWidth();
      if (layout === 'legacy') {
        updateLegacySidebarPositionAndHeight();
      }
    }
  }, [
    state,
    isStyleLoading,
    layout,
    updateFooterWidth,
    updateLegacySidebarPositionAndHeight,
  ]);
};
