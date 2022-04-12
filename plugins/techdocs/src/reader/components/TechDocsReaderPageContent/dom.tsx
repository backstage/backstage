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

import { useContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme, Theme } from '@material-ui/core';
import { lighten, alpha } from '@material-ui/core/styles';

import { BackstageTheme } from '@backstage/theme';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { SidebarPinStateContext } from '@backstage/core-components';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

import { techdocsStorageApiRef } from '../../../api';

import { useTechDocsReader } from './context';

import {
  addBaseUrl,
  addGitFeedbackLink,
  addLinkClickListener,
  addSidebarToggle,
  injectCss,
  onCssReady,
  removeMkdocsHeader,
  rewriteDocLinks,
  sanitizeDOM,
  simplifyMkdocsFooter,
  scrollIntoAnchor,
  transform as transformer,
  copyToClipboard,
} from '../../transformers';

type TypographyHeadings = Pick<
  Theme['typography'],
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>;
type TypographyHeadingsKeys = keyof TypographyHeadings;

const headings: TypographyHeadingsKeys[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Hook that encapsulates the behavior of getting raw HTML and applying
 * transforms to it in order to make it function at a basic level in the
 * Backstage UI.
 *
 * Note: this hook is currently being exported so that we can rapidly iterate
 * on alternative <Reader /> implementations that extend core functionality.
 * There is no guarantee that this hook will continue to be exported by the
 * package in the future!
 *
 * todo: Make public or stop exporting (see others: "altReaderExperiments")
 * @internal
 */
export const useTechDocsReaderDom = (
  entityRef: CompoundEntityRef,
): Element | null => {
  const navigate = useNavigate();
  const theme = useTheme<BackstageTheme>();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const techdocsSanitizer = useApi(configApiRef);
  const { namespace, kind, name } = entityRef;
  const { state, path, content: rawPage } = useTechDocsReader();
  const isDarkTheme = theme.palette.type === 'dark';

  const [sidebars, setSidebars] = useState<HTMLElement[]>();
  const [dom, setDom] = useState<HTMLElement | null>(null);

  // sidebar pinned status to be used in computing CSS style injections
  const { isPinned } = useContext(SidebarPinStateContext);

  const updateSidebarPosition = useCallback(() => {
    if (!dom || !sidebars) return;
    // set sidebar height so they don't initially render in wrong position
    const mdTabs = dom.querySelector('.md-container > .md-tabs');
    const sidebarsCollapsed = window.matchMedia(
      'screen and (max-width: 76.1875em)',
    ).matches;
    const newTop = Math.max(dom.getBoundingClientRect().top, 0);
    sidebars.forEach(sidebar => {
      if (sidebarsCollapsed) {
        sidebar.style.top = '0px';
      } else if (mdTabs) {
        sidebar.style.top = `${
          newTop + mdTabs.getBoundingClientRect().height
        }px`;
      } else {
        sidebar.style.top = `${newTop}px`;
      }
    });
  }, [dom, sidebars]);

  useEffect(() => {
    updateSidebarPosition();
    window.addEventListener('scroll', updateSidebarPosition, true);
    window.addEventListener('resize', updateSidebarPosition);
    return () => {
      window.removeEventListener('scroll', updateSidebarPosition, true);
      window.removeEventListener('resize', updateSidebarPosition);
    };
    // an update to "state" might lead to an updated UI so we include it as a trigger
  }, [updateSidebarPosition, state]);

  // dynamically set width of footer to accommodate for pinning of the sidebar
  const updateFooterWidth = useCallback(() => {
    if (!dom) return;
    const footer = dom.querySelector('.md-footer') as HTMLElement;
    if (footer) {
      footer.style.width = `${dom.getBoundingClientRect().width}px`;
    }
  }, [dom]);

  useEffect(() => {
    updateFooterWidth();
    window.addEventListener('resize', updateFooterWidth);
    return () => {
      window.removeEventListener('resize', updateFooterWidth);
    };
  });

  // a function that performs transformations that are executed prior to adding it to the DOM
  const preRender = useCallback(
    (rawContent: string, contentPath: string) =>
      transformer(rawContent, [
        sanitizeDOM(techdocsSanitizer.getOptionalConfig('techdocs.sanitizer')),
        addBaseUrl({
          techdocsStorageApi,
          entityId: {
            kind,
            name,
            namespace,
          },
          path: contentPath,
        }),
        rewriteDocLinks(),
        addSidebarToggle(),
        removeMkdocsHeader(),
        simplifyMkdocsFooter(),
        addGitFeedbackLink(scmIntegrationsApi),
        injectCss({
          // Variables
          css: `
            /*
              As the MkDocs output is rendered in shadow DOM, the CSS variable definitions on the root selector are not applied. Instead, they have to be applied on :host.
              As there is no way to transform the served main*.css yet (for example in the backend), we have to copy from main*.css and modify them.
            */
            :host {
              /* FONT */
              --md-default-fg-color: ${theme.palette.text.primary};
              --md-default-fg-color--light: ${theme.palette.text.secondary};
              --md-default-fg-color--lighter: ${lighten(
                theme.palette.text.secondary,
                0.7,
              )};
              --md-default-fg-color--lightest: ${lighten(
                theme.palette.text.secondary,
                0.3,
              )};
  
              /* BACKGROUND */
              --md-default-bg-color:${theme.palette.background.default};
              --md-default-bg-color--light: ${theme.palette.background.paper};
              --md-default-bg-color--lighter: ${lighten(
                theme.palette.background.paper,
                0.7,
              )};
              --md-default-bg-color--lightest: ${lighten(
                theme.palette.background.paper,
                0.3,
              )};
  
              /* PRIMARY */
              --md-primary-fg-color: ${theme.palette.primary.main};
              --md-primary-fg-color--light: ${theme.palette.primary.light};
              --md-primary-fg-color--dark: ${theme.palette.primary.dark};
              --md-primary-bg-color: ${theme.palette.primary.contrastText};
              --md-primary-bg-color--light: ${lighten(
                theme.palette.primary.contrastText,
                0.7,
              )};
  
              /* ACCENT */
              --md-accent-fg-color: var(--md-primary-fg-color);
  
              /* SHADOW */
              --md-shadow-z1: ${theme.shadows[1]};
              --md-shadow-z2: ${theme.shadows[2]};
              --md-shadow-z3: ${theme.shadows[3]};
  
              /* EXTENSIONS */
              --md-admonition-fg-color: var(--md-default-fg-color);
              --md-admonition-bg-color: var(--md-default-bg-color);
              /* Admonitions and others are using SVG masks to define icons. These masks are defined as CSS variables. */
              --md-admonition-icon--note: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/></svg>');
              --md-admonition-icon--abstract: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 5h16v2H4V5m0 4h16v2H4V9m0 4h16v2H4v-2m0 4h10v2H4v-2z"/></svg>');
              --md-admonition-icon--info: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z"/></svg>');
              --md-admonition-icon--tip: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.55 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66C13.3 7.26 13 4.85 13.91 3c-.91.23-1.75.75-2.45 1.32-2.54 2.08-3.54 5.75-2.34 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12a.83.83 0 01-.15-.17c-1.1-1.43-1.28-3.48-.53-5.12C5.89 10 5 12.3 5.14 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.32 1.5-6.6l-.13-.26c-.2-.46-.47-.87-.8-1.25l.05-.01m-3.1 6.3c-.28.24-.73.5-1.08.6-1.1.4-2.2-.16-2.87-.82 1.19-.28 1.89-1.16 2.09-2.05.17-.8-.14-1.46-.27-2.23-.12-.74-.1-1.37.18-2.06.17.38.37.76.6 1.06.76 1 1.95 1.44 2.2 2.8.04.14.06.28.06.43.03.82-.32 1.72-.92 2.27h.01z"/></svg>');
              --md-admonition-icon--success: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
              --md-admonition-icon--question: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.07 11.25l-.9.92C13.45 12.89 13 13.5 13 15h-2v-.5c0-1.11.45-2.11 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41a2 2 0 00-2-2 2 2 0 00-2 2H8a4 4 0 014-4 4 4 0 014 4 3.2 3.2 0 01-.93 2.25M13 19h-2v-2h2M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10c0-5.53-4.5-10-10-10z"/></svg>');
              --md-admonition-icon--warning: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 14h-2v-4h2m0 8h-2v-2h2M1 21h22L12 2 1 21z"/></svg>');
              --md-admonition-icon--failure: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12 6.47 2 12 2m3.59 5L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41 15.59 7z"/></svg>');
              --md-admonition-icon--danger: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.5 20l4.86-9.73H13V4l-5 9.73h3.5V20M12 2c2.75 0 5.1 1 7.05 2.95C21 6.9 22 9.25 22 12s-1 5.1-2.95 7.05C17.1 21 14.75 22 12 22s-5.1-1-7.05-2.95C3 17.1 2 14.75 2 12s1-5.1 2.95-7.05C6.9 3 9.25 2 12 2z"/></svg>');
              --md-admonition-icon--bug: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 12h-4v-2h4m0 6h-4v-2h4m6-6h-2.81a5.985 5.985 0 00-1.82-1.96L17 4.41 15.59 3l-2.17 2.17a6.002 6.002 0 00-2.83 0L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8z"/></svg>');
              --md-admonition-icon--example: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 13v-2h14v2H7m0 6v-2h14v2H7M7 7V5h14v2H7M3 8V5H2V4h2v4H3m-1 9v-1h3v4H2v-1h2v-.5H3v-1h1V17H2m2.25-7a.75.75 0 01.75.75c0 .2-.08.39-.21.52L3.12 13H5v1H2v-.92L4 11H2v-1h2.25z"/></svg>');
              --md-admonition-icon--quote: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3l-2 4z"/></svg>');
              --md-footnotes-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.42L5.83 13H21V7h-2z"/></svg>');
              --md-details-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.59 16.58 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/></svg>');
              --md-tasklist-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>');
              --md-tasklist-icon--checked: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
              --md-nav-icon--prev: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"/></svg>');
              --md-nav-icon--next: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.59 16.58 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"/></svg>');
              --md-toc-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9h14V7H3v2m0 4h14v-2H3v2m0 4h14v-2H3v2m16 0h2v-2h-2v2m0-10v2h2V7h-2m0 6h2v-2h-2v2z"/></svg>');
              --md-clipboard-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"/></svg>');
              --md-search-result-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7c-.41-.25-.8-.56-1.14-.9-.33-.33-.61-.7-.86-1.1H6V4h7v5h5v1.18c.71.16 1.39.43 2 .82V8l-6-6m6.31 16.9c1.33-2.11.69-4.9-1.4-6.22-2.11-1.33-4.91-.68-6.22 1.4-1.34 2.11-.69 4.89 1.4 6.22 1.46.93 3.32.93 4.79.02L22 23.39 23.39 22l-3.08-3.1m-3.81.1a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5z"/></svg>');
              --md-source-forks-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/></svg>');
              --md-source-repositories-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"/></svg>');
              --md-source-stars-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694v.001z"/></svg>');
              --md-source-version-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 0 1 .25-.25h5.025a.25.25 0 0 1 .177.073l6.25 6.25a.25.25 0 0 1 0 .354l-5.025 5.025a.25.25 0 0 1-.354 0l-6.25-6.25a.25.25 0 0 1-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.75 1.75 0 0 1 1 7.775zM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>');
              --md-version-icon: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc.--><path d="m310.6 246.6-127.1 128c-7.1 6.3-15.3 9.4-23.5 9.4s-16.38-3.125-22.63-9.375l-127.1-128C.224 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75s3.12 25.75-6.08 34.85z"/></svg>');
            }
  
            :host > * {
              /* CODE */
              --md-code-fg-color: ${theme.palette.text.primary};
              --md-code-bg-color: ${theme.palette.background.paper};
              --md-code-hl-color: ${alpha(theme.palette.warning.main, 0.5)};
              --md-code-hl-keyword-color: ${
                isDarkTheme
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark
              };
              --md-code-hl-function-color: ${
                isDarkTheme
                  ? theme.palette.secondary.light
                  : theme.palette.secondary.dark
              };
              --md-code-hl-string-color: ${
                isDarkTheme
                  ? theme.palette.success.light
                  : theme.palette.success.dark
              };
              --md-code-hl-number-color: ${
                isDarkTheme
                  ? theme.palette.error.light
                  : theme.palette.error.dark
              };
              --md-code-hl-constant-color: var(--md-code-hl-function-color);
              --md-code-hl-special-color: var(--md-code-hl-function-color);
              --md-code-hl-name-color: var(--md-code-fg-color);
              --md-code-hl-comment-color: var(--md-default-fg-color--light);
              --md-code-hl-generic-color: var(--md-default-fg-color--light);
              --md-code-hl-variable-color: var(--md-default-fg-color--light);
              --md-code-hl-operator-color: var(--md-default-fg-color--light);
              --md-code-hl-punctuation-color: var(--md-default-fg-color--light);
  
              /* TYPESET */
              --md-typeset-font-size: 1rem;
              --md-typeset-color: var(--md-default-fg-color);
              --md-typeset-a-color: var(--md-accent-fg-color);
              --md-typeset-table-color: ${theme.palette.text.primary};
              --md-typeset-del-color: ${
                isDarkTheme
                  ? alpha(theme.palette.error.dark, 0.5)
                  : alpha(theme.palette.error.light, 0.5)
              };
              --md-typeset-ins-color: ${
                isDarkTheme
                  ? alpha(theme.palette.success.dark, 0.5)
                  : alpha(theme.palette.success.light, 0.5)
              };
              --md-typeset-mark-color: ${
                isDarkTheme
                  ? alpha(theme.palette.warning.dark, 0.5)
                  : alpha(theme.palette.warning.light, 0.5)
              };
            }
  
            @media screen and (max-width: 76.1875em) {
              :host > * {
                /* TYPESET */
                --md-typeset-font-size: .9rem;
              }
            }
  
            @media screen and (max-width: 600px) {
              :host > * {
                /* TYPESET */
                --md-typeset-font-size: .7rem;
              }
            }
            `,
        }),
        injectCss({
          // Reset
          css: `
              body {
                --md-text-color: var(--md-default-fg-color);
                --md-text-link-color: var(--md-accent-fg-color);
                --md-text-font-family: ${theme.typography.fontFamily};
                font-family: var(--md-text-font-family);
                background-color: unset;
              }
            `,
        }),
        injectCss({
          // Layout
          css: `
              .md-grid {
                max-width: 100%;
                margin: 0;
              }
  
              .md-nav {
                font-size: calc(var(--md-typeset-font-size) * 0.9);
              }
              .md-nav__link {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .md-nav__icon {
                height: 20px !important;
                width: 20px !important;
                margin-left:${theme.spacing(1)}px;
              }
              .md-nav__icon svg {
                margin: 0;
                width: 20px !important;
                height: 20px !important;
              }
              .md-nav__icon:after {
                width: 20px !important;
                height: 20px !important;
              }
  
              .md-main__inner {
                margin-top: 0;
              }
  
              .md-sidebar {
                bottom: 75px;
                position: fixed;
                width: 16rem;
                overflow-y: auto;
                overflow-x: hidden;
                scrollbar-color: rgb(193, 193, 193) #eee;
                scrollbar-width: thin;
              }
              .md-sidebar .md-sidebar__scrollwrap {
                width: calc(16rem - 10px);
              }
              .md-sidebar--secondary {
                right: ${theme.spacing(3)}px;
              }
              .md-sidebar::-webkit-scrollbar {
                width: 5px;
              }
              .md-sidebar::-webkit-scrollbar-button {
                width: 5px;
                height: 5px;
              }
              .md-sidebar::-webkit-scrollbar-track {
                background: #eee;
                border: 1 px solid rgb(250, 250, 250);
                box-shadow: 0px 0px 3px #dfdfdf inset;
                border-radius: 3px;
              }
              .md-sidebar::-webkit-scrollbar-thumb {
                width: 5px;
                background: rgb(193, 193, 193);
                border: transparent;
                border-radius: 3px;
              }
              .md-sidebar::-webkit-scrollbar-thumb:hover {
                background: rgb(125, 125, 125);
              }
  
              .md-content {
                max-width: calc(100% - 16rem * 2);
                margin-left: 16rem;
                margin-bottom: 50px;
              }
  
              .md-footer {
                position: fixed;
                bottom: 0px;
              }
              .md-footer__title {
                background-color: unset;
              }
              .md-footer-nav__link {
                width: 16rem;
              }
  
              .md-dialog {
                background-color: unset;
              }
  
              @media screen and (min-width: 76.25em) {
                .md-sidebar {
                  height: auto;
                }
              }
              
              @media screen and (max-width: 76.1875em) {
                .md-nav {
                  transition: none !important;
                  background-color: var(--md-default-bg-color)
                }
                .md-nav--primary .md-nav__title {
                  cursor: auto;
                  color: var(--md-default-fg-color);
                  font-weight: 700;
                  white-space: normal;
                  line-height: 1rem;
                  height: auto;
                  display: flex;
                  flex-flow: column;
                  row-gap: 1.6rem;
                  padding: 1.2rem .8rem .8rem;
                  background-color: var(--md-default-bg-color);
                }
                .md-nav--primary .md-nav__title~.md-nav__list {
                  box-shadow: none;
                }
                .md-nav--primary .md-nav__title ~ .md-nav__list > :first-child {
                  border-top: none;
                }
                .md-nav--primary .md-nav__title .md-nav__button {
                  display: none;
                }
                .md-nav--primary .md-nav__title .md-nav__icon {
                  color: var(--md-default-fg-color);
                  position: static;
                  height: auto;
                  margin: 0 0 0 -0.2rem;
                }
                .md-nav--primary > .md-nav__title [for="none"] {
                  padding-top: 0;
                }
                .md-nav--primary .md-nav__item {
                  border-top: none;
                }
                .md-nav--primary :is(.md-nav__title,.md-nav__item) {
                  font-size : var(--md-typeset-font-size);
                }
                .md-nav .md-source {
                  display: none;
                }
  
                .md-sidebar {
                  height: 100%;
                }
                .md-sidebar--primary {
                  width: 12.1rem !important;
                  z-index: 200;
                  left: ${
                    isPinned
                      ? 'calc(-12.1rem + 242px)'
                      : 'calc(-12.1rem + 72px)'
                  } !important;
                }
                .md-sidebar--secondary:not([hidden]) {
                  display: none;
                }
  
                .md-content {
                  max-width: 100%;
                  margin-left: 0;
                }
  
                .md-header__button {
                  margin: 0.4rem 0;
                  margin-left: 0.4rem;
                  padding: 0;
                }
  
                .md-overlay {
                  left: 0;
                }
  
                .md-footer {
                  position: static;
                  padding-left: 0;
                }
                .md-footer-nav__link {
                  /* footer links begin to overlap at small sizes without setting width */
                  width: 50%;
                }
              }
  
              @media screen and (max-width: 600px) {
                .md-sidebar--primary {
                  left: -12.1rem !important;
                  width: 12.1rem;
                }
              }
            `,
        }),
        injectCss({
          // Typeset
          css: `
              .md-typeset {
                font-size: var(--md-typeset-font-size);
              }
  
              ${headings.reduce<string>((style, heading) => {
                const styles = theme.typography[heading];
                const { lineHeight, fontFamily, fontWeight, fontSize } = styles;
                const calculate = (value: typeof fontSize) => {
                  let factor: number | string = 1;
                  if (typeof value === 'number') {
                    // 60% of the size defined because it is too big
                    factor = (value / 16) * 0.6;
                  }
                  if (typeof value === 'string') {
                    factor = value.replace('rem', '');
                  }
                  return `calc(${factor} * var(--md-typeset-font-size))`;
                };
                return style.concat(`
                  .md-typeset ${heading} {
                    color: var(--md-default-fg-color);
                    line-height: ${lineHeight};
                    font-family: ${fontFamily};
                    font-weight: ${fontWeight};
                    font-size: ${calculate(fontSize)};
                  }
                `);
              }, '')}
  
              .md-typeset .md-content__button {
                color: var(--md-default-fg-color);
              }
  
              .md-typeset hr {
                border-bottom: 0.05rem dotted ${theme.palette.divider};
              }
  
              .md-typeset details {
                font-size: var(--md-typeset-font-size) !important;
              }
              .md-typeset details summary {
                padding-left: 2.5rem !important;
              }
              .md-typeset details summary:before,
              .md-typeset details summary:after {
                top: 50% !important;
                width: 20px !important;
                height: 20px !important;
                transform: rotate(0deg) translateY(-50%) !important;
              }
              .md-typeset details[open] > summary:after {
                transform: rotate(90deg) translateX(-50%) !important;
              }
  
              .md-typeset blockquote {
                color: var(--md-default-fg-color--light);
                border-left: 0.2rem solid var(--md-default-fg-color--light);
              }
  
              .md-typeset table:not([class]) {
                font-size: var(--md-typeset-font-size);
                border: 1px solid var(--md-default-fg-color);
                border-bottom: none;
                border-collapse: collapse;
              }
              .md-typeset table:not([class]) th {
                font-weight: bold;
              }
              .md-typeset table:not([class]) td, .md-typeset table:not([class]) th {
                border-bottom: 1px solid var(--md-default-fg-color);
              }
  
              .md-typeset pre > code::-webkit-scrollbar-thumb {
                background-color: hsla(0, 0%, 0%, 0.32);
              }
              .md-typeset pre > code::-webkit-scrollbar-thumb:hover {
                background-color: hsla(0, 0%, 0%, 0.87);
              }
            `,
        }),
        injectCss({
          // Animations
          css: `
              /*
                Disable CSS animations on link colors as they lead to issues in dark mode.
                The dark mode color theme is applied later and theirfore there is always an animation from light to dark mode when navigation between pages.
              */
              .md-dialog, .md-nav__link, .md-footer__link, .md-typeset a, .md-typeset a::before, .md-typeset .headerlink {
                transition: none;
              }
            `,
        }),
        injectCss({
          // Extensions
          css: `
              /* HIGHLIGHT */
              .highlight .md-clipboard:after {
                content: unset;
              }
  
              .highlight .nx {
                color: ${isDarkTheme ? '#ff53a3' : '#ec407a'};
              }
  
              /* CODE HILITE */
              .codehilite .gd {
                background-color: ${
                  isDarkTheme ? 'rgba(248,81,73,0.65)' : '#fdd'
                };
              }
  
              .codehilite .gi {
                background-color: ${
                  isDarkTheme ? 'rgba(46,160,67,0.65)' : '#dfd'
                };
              }
  
              /* TABBED */
              .tabbed-set>input:nth-child(1):checked~.tabbed-labels>:nth-child(1),
              .tabbed-set>input:nth-child(2):checked~.tabbed-labels>:nth-child(2),
              .tabbed-set>input:nth-child(3):checked~.tabbed-labels>:nth-child(3),
              .tabbed-set>input:nth-child(4):checked~.tabbed-labels>:nth-child(4),
              .tabbed-set>input:nth-child(5):checked~.tabbed-labels>:nth-child(5),
              .tabbed-set>input:nth-child(6):checked~.tabbed-labels>:nth-child(6),
              .tabbed-set>input:nth-child(7):checked~.tabbed-labels>:nth-child(7),
              .tabbed-set>input:nth-child(8):checked~.tabbed-labels>:nth-child(8),
              .tabbed-set>input:nth-child(9):checked~.tabbed-labels>:nth-child(9),
              .tabbed-set>input:nth-child(10):checked~.tabbed-labels>:nth-child(10),
              .tabbed-set>input:nth-child(11):checked~.tabbed-labels>:nth-child(11),
              .tabbed-set>input:nth-child(12):checked~.tabbed-labels>:nth-child(12),
              .tabbed-set>input:nth-child(13):checked~.tabbed-labels>:nth-child(13),
              .tabbed-set>input:nth-child(14):checked~.tabbed-labels>:nth-child(14),
              .tabbed-set>input:nth-child(15):checked~.tabbed-labels>:nth-child(15),
              .tabbed-set>input:nth-child(16):checked~.tabbed-labels>:nth-child(16),
              .tabbed-set>input:nth-child(17):checked~.tabbed-labels>:nth-child(17),
              .tabbed-set>input:nth-child(18):checked~.tabbed-labels>:nth-child(18),
              .tabbed-set>input:nth-child(19):checked~.tabbed-labels>:nth-child(19),
              .tabbed-set>input:nth-child(20):checked~.tabbed-labels>:nth-child(20) {
                color: var(--md-accent-fg-color);
                border-color: var(--md-accent-fg-color);
              }
  
              /* TASK-LIST */
              .task-list-control .task-list-indicator::before {
                background-color: ${theme.palette.action.disabledBackground};
              }
              .task-list-control [type="checkbox"]:checked + .task-list-indicator:before {
               background-color: ${theme.palette.success.main};
              }
  
              /* ADMONITION */
              .admonition {
                font-size: var(--md-typeset-font-size) !important;
              }
              .admonition .admonition-title {
                padding-left: 2.5rem !important;
              }
  
              .admonition .admonition-title:before {
                top: 50% !important;
                width: 20px !important;
                height: 20px !important;
                transform: translateY(-50%) !important;
              }
            `,
        }),
      ]),
    [
      kind,
      name,
      namespace,
      scmIntegrationsApi,
      techdocsSanitizer,
      techdocsStorageApi,
      theme,
      isDarkTheme,
      isPinned,
    ],
  );

  // a function that performs transformations that are executed after adding it to the DOM
  const postRender = useCallback(
    async (transformedElement: Element) =>
      transformer(transformedElement, [
        scrollIntoAnchor(),
        copyToClipboard(theme),
        addLinkClickListener({
          baseUrl: window.location.origin,
          onClick: (event: MouseEvent, url: string) => {
            // detect if CTRL or META keys are pressed so that links can be opened in a new tab with `window.open`
            const modifierActive = event.ctrlKey || event.metaKey;
            const parsedUrl = new URL(url);

            // hash exists when anchor is clicked on secondary sidebar
            if (parsedUrl.hash) {
              if (modifierActive) {
                window.open(`${parsedUrl.pathname}${parsedUrl.hash}`, '_blank');
              } else {
                navigate(`${parsedUrl.pathname}${parsedUrl.hash}`);
                // Scroll to hash if it's on the current page
                transformedElement
                  ?.querySelector(`#${parsedUrl.hash.slice(1)}`)
                  ?.scrollIntoView();
              }
            } else {
              if (modifierActive) {
                window.open(parsedUrl.pathname, '_blank');
              } else {
                navigate(parsedUrl.pathname);
              }
            }
          },
        }),
        onCssReady({
          docStorageUrl: await techdocsStorageApi.getApiOrigin(),
          onLoading: (renderedElement: Element) => {
            (renderedElement as HTMLElement).style.setProperty('opacity', '0');
          },
          onLoaded: (renderedElement: Element) => {
            (renderedElement as HTMLElement).style.removeProperty('opacity');
            // disable MkDocs drawer toggling ('for' attribute => checkbox mechanism)
            renderedElement
              .querySelector('.md-nav__title')
              ?.removeAttribute('for');
            setSidebars(
              Array.from(renderedElement.querySelectorAll('.md-sidebar')),
            );
          },
        }),
      ]),
    [theme, navigate, techdocsStorageApi],
  );

  useEffect(() => {
    if (!rawPage) return () => {};

    // if false, there is already a newer execution of this effect
    let shouldReplaceContent = true;

    // Pre-render
    preRender(rawPage, path).then(async preTransformedDomElement => {
      if (!preTransformedDomElement?.innerHTML) {
        return; // An unexpected error occurred
      }

      // don't manipulate the shadow dom if this isn't the latest effect execution
      if (!shouldReplaceContent) {
        return;
      }

      // Scroll to top after render
      window.scroll({ top: 0 });

      // Post-render
      const postTransformedDomElement = await postRender(
        preTransformedDomElement,
      );
      setDom(postTransformedDomElement as HTMLElement);
    });

    // cancel this execution
    return () => {
      shouldReplaceContent = false;
    };
  }, [rawPage, path, preRender, postRender]);

  return dom;
};
