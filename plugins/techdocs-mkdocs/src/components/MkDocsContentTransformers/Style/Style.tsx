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

import { useCssRules } from './rules';
import { useTechDocsApiOrigin, useTechDocsBaseUrl } from '../hooks';

const LINKS_SELECTOR = 'head > link[rel="stylesheet"]';

export const StylesTransformer = () => {
  const dom = useTechDocsShadowDom();
  const apiOrigin = useTechDocsApiOrigin();
  const loading = useTechDocsBaseUrl('link', 'href');
  const rules = useCssRules();

  useEffect(() => {
    if (!dom) return () => {};

    dom
      .getElementsByTagName('head')[0]
      .insertAdjacentHTML('beforeend', `<style>${rules}</style>`);

    (dom as HTMLElement).style.setProperty('opacity', '0');

    if (loading || !apiOrigin) return () => {};

    const links = dom.querySelectorAll<HTMLLinkElement>(LINKS_SELECTOR);

    if (!links.length) return () => {};

    const styles = Array.from(links).filter(link => {
      return link.getAttribute('href')?.startsWith(apiOrigin);
    });

    let count = styles.length;

    if (!count) {
      (dom as HTMLElement).style.removeProperty('opacity');
      return () => {};
    }

    const handler = () => {
      --count;
      if (!count) {
        (dom as HTMLElement).style.removeProperty('opacity');
      }
    };

    styles.forEach(link => {
      link.addEventListener('load', handler);
    });

    return () => {
      styles.forEach(link => {
        link.removeEventListener('load', handler);
      });
    };
  }, [dom, loading, apiOrigin, rules]);

  return null;
};
