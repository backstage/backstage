/*
 * Copyright 2021 The Backstage Authors
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

import type { Transformer } from './index';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import ReactDOM from 'react-dom';

export const addSidebarToggle = (): Transformer => {
  return dom => {
    // attempting to use selectors that are more likely to be static as MkDocs updates over time
    const mkdocsToggleSidebar = dom.querySelector(
      '.md-header label[for="__drawer"]',
    ) as HTMLLabelElement;
    const article = dom.querySelector('article') as HTMLElement;

    // Fail gracefully
    if (!mkdocsToggleSidebar || !article) {
      return dom;
    }

    const toggleSidebar = mkdocsToggleSidebar.cloneNode() as HTMLLabelElement;
    ReactDOM.render(React.createElement(MenuIcon), toggleSidebar);
    toggleSidebar.id = 'toggle-sidebar';
    toggleSidebar.title = 'Toggle Sidebar';
    toggleSidebar.classList.add('md-content__button');
    toggleSidebar.style.setProperty('padding', '0 0 0 5px');
    toggleSidebar.style.setProperty('margin', '0.4rem 0 0.4rem 0.4rem');
    article?.prepend(toggleSidebar);
    return dom;
  };
};
