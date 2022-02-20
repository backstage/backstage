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

const FOOTER_SELECTOR = '.md-footer';
const FOOTER_NEW_COPYRIGHT_SELECTOR = '.md-copyright';
const FOOTER_OLD_COPYRIGHT_SELECTOR = '.md-footer-copyright';

export const FooterTransformer = () => {
  const dom = useTechDocsShadowDom();

  useEffect(() => {
    if (!dom) return;

    const footer = dom.querySelector<HTMLElement>(FOOTER_SELECTOR);
    if (!footer) return;

    // Remove new mkdocs copyright
    footer.querySelector(FOOTER_NEW_COPYRIGHT_SELECTOR)?.remove();

    // Remove old mkdocs copyright
    footer.querySelector(FOOTER_OLD_COPYRIGHT_SELECTOR)?.remove();

    footer.style.width = `${dom.getBoundingClientRect().width}px`;
  }, [dom]);

  return null;
};
