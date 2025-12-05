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

import type { Theme } from '@material-ui/core/styles';
import type { AnalyticsTracker, ConfigApi } from '@backstage/core-plugin-api';
import type { TechDocsStorageApi } from '@backstage/plugin-techdocs-react';
import type { CompoundEntityRef } from '@backstage/catalog-model';
import type { ScmIntegrationRegistry } from '@backstage/integration';
import type {
  TechDocsTransformerOptions,
  Transformer,
} from '@backstage/plugin-techdocs-react/alpha';

import {
  addBaseUrl,
  addGitFeedbackLink,
  addLinkClickListener,
  addSidebarToggle,
  onCssReady,
  removeMkdocsHeader,
  rewriteDocLinks,
  simplifyMkdocsFooter,
  scrollIntoNavigation,
  copyToClipboard,
  handleMetaRedirects,
  addNavLinkKeyboardToggle,
} from './index';

/**
 * Dependencies required for default transformers
 * @alpha
 */
export interface DefaultTransformerDependencies {
  // Pre-render dependencies
  sanitizerTransformer: Transformer;
  stylesTransformer: Transformer;
  techdocsStorageApi: TechDocsStorageApi;
  scmIntegrationsApi: ScmIntegrationRegistry;
  entityRef: CompoundEntityRef;
  contentPath: string;

  // Post-render dependencies
  theme: Theme;
  navigate: (url: string) => void;
  analytics: AnalyticsTracker;
  configApi: ConfigApi;
}

/**
 * Returns the default TechDocs transformers with proper priorities.
 * These match the built-in transformers that were previously hardcoded.
 * @alpha
 */
export const getDefaultTransformers = (
  deps: DefaultTransformerDependencies,
): TechDocsTransformerOptions[] => {
  const baseUrl =
    deps.configApi.getOptionalString('app.baseUrl') || window.location.origin;

  return [
    // Pre-render transformers (run before DOM attachment)
    {
      name: 'sanitizer',
      transformer: deps.sanitizerTransformer,
      phase: 'pre',
      priority: 10,
    },
    {
      name: 'addBaseUrl',
      transformer: addBaseUrl({
        techdocsStorageApi: deps.techdocsStorageApi,
        entityId: deps.entityRef,
        path: deps.contentPath,
      }),
      phase: 'pre',
      priority: 20,
    },
    {
      name: 'rewriteDocLinks',
      transformer: rewriteDocLinks(),
      phase: 'pre',
      priority: 30,
    },
    {
      name: 'addSidebarToggle',
      transformer: addSidebarToggle(),
      phase: 'pre',
      priority: 40,
    },
    {
      name: 'removeMkdocsHeader',
      transformer: removeMkdocsHeader(),
      phase: 'pre',
      priority: 50,
    },
    {
      name: 'simplifyMkdocsFooter',
      transformer: simplifyMkdocsFooter(),
      phase: 'pre',
      priority: 60,
    },
    {
      name: 'addGitFeedbackLink',
      transformer: addGitFeedbackLink(deps.scmIntegrationsApi),
      phase: 'pre',
      priority: 70,
    },
    {
      name: 'styles',
      transformer: deps.stylesTransformer,
      phase: 'pre',
      priority: 80,
    },

    // Post-render transformers (run after DOM attachment)
    {
      name: 'handleMetaRedirects',
      transformer: handleMetaRedirects(deps.navigate, deps.entityRef.name),
      phase: 'post',
      priority: 10,
    },
    {
      name: 'scrollIntoNavigation',
      transformer: scrollIntoNavigation(),
      phase: 'post',
      priority: 20,
    },
    {
      name: 'copyToClipboard',
      transformer: copyToClipboard(deps.theme),
      phase: 'post',
      priority: 30,
    },
    {
      name: 'addLinkClickListener',
      transformer: addLinkClickListener({
        baseUrl,
        onClick: (event: MouseEvent, url: string) => {
          // detect if CTRL or META keys are pressed so that links can be opened in a new tab with `window.open`
          const modifierActive = event.ctrlKey || event.metaKey;
          const parsedUrl = new URL(url);

          // capture link clicks within documentation
          const linkText =
            (event.target as HTMLAnchorElement | undefined)?.innerText || url;
          const to = url.replace(window.location.origin, '');
          deps.analytics.captureEvent('click', linkText, {
            attributes: { to },
          });

          // hash exists when anchor is clicked on secondary sidebar
          if (parsedUrl.hash) {
            if (modifierActive) {
              window.open(url, '_blank');
            } else {
              // If it's in a different page, we navigate to it
              if (window.location.pathname !== parsedUrl.pathname) {
                deps.navigate(url);
              } else {
                // If it's in the same page we avoid using navigate that causes
                // the page to rerender.
                window.history.pushState(null, document.title, parsedUrl.hash);
              }
              // Note: The actual scrolling logic needs the transformedElement,
              // which will be handled in the transformer itself
            }
          } else {
            if (modifierActive) {
              window.open(url, '_blank');
            } else {
              deps.navigate(url);
            }
          }
        },
      }),
      phase: 'post',
      priority: 40,
    },
    {
      name: 'onCssReady-disableDrawerToggle',
      transformer: onCssReady({
        onLoading: () => {},
        onLoaded: (transformedElement: Element) => {
          transformedElement
            .querySelector('.md-nav__title')
            ?.removeAttribute('for');
        },
      }),
      phase: 'post',
      priority: 50,
    },
    {
      name: 'onCssReady-hideSidebars',
      transformer: onCssReady({
        onLoading: (transformedElement: Element) => {
          const sidebars = Array.from(
            transformedElement.querySelectorAll<HTMLElement>('.md-sidebar'),
          );
          sidebars.forEach(element => {
            element.style.setProperty('opacity', '0');
          });
        },
        onLoaded: () => {},
      }),
      phase: 'post',
      priority: 51,
    },
    {
      name: 'addNavLinkKeyboardToggle',
      transformer: addNavLinkKeyboardToggle(),
      phase: 'post',
      priority: 60,
    },
  ];
};
