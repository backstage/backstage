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

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import MenuIcon from '@material-ui/icons/Menu';

import { useTechDocsShadowDom } from '@backstage/plugin-techdocs';

const HEADER_DRAWER_SELECTOR = '.md-header label[for="__drawer"]';
const CONTENT_ARTICLE_SELECTOR = '.md-content article';
export const HeaderTransformer = () => {
  const dom = useTechDocsShadowDom();

  useEffect(() => {
    if (!dom) return;

    // attempting to use selectors that are more likely to be static as MkDocs updates over time
    const headerDrawer = dom.querySelector<HTMLLabelElement>(
      HEADER_DRAWER_SELECTOR,
    );
    const contentArticle = dom.querySelector<HTMLLabelElement>(
      CONTENT_ARTICLE_SELECTOR,
    );

    // Fail gracefully
    if (headerDrawer && contentArticle) {
      const clonedHeaderDrawer = headerDrawer.cloneNode() as HTMLLabelElement;
      ReactDOM.render(<MenuIcon />, clonedHeaderDrawer);
      clonedHeaderDrawer.id = 'toggle-sidebar';
      clonedHeaderDrawer.title = 'Toggle Sidebar';
      clonedHeaderDrawer.style.paddingLeft = '5px';
      clonedHeaderDrawer.classList.add('md-content__button');
      contentArticle?.prepend(clonedHeaderDrawer);
    }

    // Remove the header
    dom.querySelector('.md-header')?.remove();
  }, [dom]);

  return null;
};
