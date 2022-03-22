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

import { useEffect } from 'react';
import { useTechDocsShadowDom } from '@backstage/plugin-techdocs';

const MOBILE_MEDIA_QUERY = 'screen and (max-width: 76.1875em)';
const CONTAINER_TABS_SELECTOR = '.md-container > .md-tabs';
const SIDEBAR_SELECTOR = '.md-sidebar';

/**
 * Position sidebar at the top of documentation content after css has been loaded
 */
export const SidebarTransformer = () => {
  const dom = useTechDocsShadowDom();

  useEffect(() => {
    if (!dom) {
      return () => {};
    }

    const handler = () => {
      const mobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
      const domTop = Math.max(dom.getBoundingClientRect().top, 0);
      const tabs = dom.querySelector(CONTAINER_TABS_SELECTOR);
      const tabsHeight = tabs?.getBoundingClientRect().height ?? 0;

      const sidebars = dom.querySelectorAll<HTMLElement>(SIDEBAR_SELECTOR);
      for (const sidebar of sidebars) {
        if (mobile) {
          sidebar.style.top = '0px';
        } else {
          sidebar.style.top = `${tabs ? domTop + tabsHeight : domTop}px`;
        }
      }
    };

    handler();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);

    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [dom]);

  return null;
};
