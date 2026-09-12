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

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  // useRef,
  useState,
} from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { configApiRef, useAnalytics, useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

import {
  techdocsStorageApiRef,
  useShadowDomStylesLoading,
} from '@backstage/plugin-techdocs-react';

import { useTechDocsReader } from '../TechDocsReaderProvider';

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
  transform as transformer,
  copyToClipboard,
  useSanitizerTransformer,
  useStylesTransformer,
  handleMetaRedirects,
  addNavLinkKeyboardToggle,
} from '../../transformers';
import { useNavigateUrl } from './useNavigateUrl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { TechDocsReaderLayout } from '../../TechDocsReaderLayout';
import { useReaderLayoutEffects } from './useReaderLayoutEffects';

const MOBILE_MEDIA_QUERY = 'screen and (max-width: 76.1875em)';

// If a defaultPath is specified then we should navigate to that path replacing the
// current location in the history. This should only happen on the initial load so
// navigating to the root of the docs doesn't also redirect.
export const useInitialRedirect = (defaultPath?: string) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { '*': currPath = '' } = useParams();

  useLayoutEffect(() => {
    if (currPath === '' && defaultPath) {
      navigate(`${location.pathname}${defaultPath}`, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * Hook that encapsulates the behavior of getting raw HTML and applying
 * transforms to it in order to make it function at a basic level in the
 * Backstage UI.
 */
export const useTechDocsReaderDom = (
  entityRef: CompoundEntityRef,
  defaultPath?: string,
  layout: TechDocsReaderLayout = 'legacy',
): Element | null => {
  const navigate = useNavigateUrl();
  const theme = useTheme();
  const isMobileMedia = useMediaQuery(MOBILE_MEDIA_QUERY);
  const sanitizerTransformer = useSanitizerTransformer();
  const stylesTransformer = useStylesTransformer(layout);
  const analytics = useAnalytics();

  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const configApi = useApi(configApiRef);

  const { state, path, content: rawPage } = useTechDocsReader();
  const { '*': currPath = '' } = useParams();

  const [dom, setDom] = useState<HTMLElement | null>(null);
  const isStyleLoading = useShadowDomStylesLoading(dom);

  useInitialRedirect(defaultPath);

  useReaderLayoutEffects({
    dom,
    isMobileMedia,
    isStyleLoading,
    layout,
    state,
  });

  // a function that performs transformations that are executed prior to adding it to the DOM
  const preRender = useCallback(
    (rawContent: string, contentPath: string) =>
      transformer(rawContent, [
        sanitizerTransformer,
        addBaseUrl({
          techdocsStorageApi,
          entityId: entityRef,
          path: contentPath,
        }),
        rewriteDocLinks(),
        addSidebarToggle(),
        removeMkdocsHeader(),
        simplifyMkdocsFooter(),
        addGitFeedbackLink(scmIntegrationsApi),
        stylesTransformer,
      ]),
    [
      // only add dependencies that are in state or memorized variables to avoid unnecessary calls between re-renders
      entityRef,
      scmIntegrationsApi,
      techdocsStorageApi,
      sanitizerTransformer,
      stylesTransformer,
    ],
  );

  // a function that performs transformations that are executed after adding it to the DOM
  const postRender = useCallback(
    async (transformedElement: Element) =>
      transformer(transformedElement, [
        handleMetaRedirects(navigate, entityRef.name),
        scrollIntoNavigation(),
        copyToClipboard(theme),
        addLinkClickListener({
          baseUrl:
            configApi.getOptionalString('app.baseUrl') ||
            window.location.origin,
          onClick: (event: MouseEvent, url: string) => {
            // detect if CTRL or META keys are pressed so that links can be opened in a new tab with `window.open`
            const modifierActive = event.ctrlKey || event.metaKey;
            const parsedUrl = new URL(url);

            // capture link clicks within documentation
            const linkText =
              (event.target as HTMLAnchorElement | undefined)?.innerText || url;
            const to = url.replace(window.location.origin, '');
            analytics.captureEvent('click', linkText, { attributes: { to } });

            // hash exists when anchor is clicked on secondary sidebar
            if (parsedUrl.hash) {
              if (modifierActive) {
                window.open(url, '_blank');
              } else {
                // If it's in a different page, we navigate to it
                if (window.location.pathname !== parsedUrl.pathname) {
                  navigate(url);
                } else {
                  // If it's in the same page we avoid using navigate that causes
                  // the page to rerender.
                  window.history.pushState(
                    null,
                    document.title,
                    parsedUrl.hash,
                  );
                }
                // Scroll to hash if it's on the current page
                transformedElement
                  ?.querySelector(`[id="${parsedUrl.hash.slice(1)}"]`)
                  ?.scrollIntoView();

                // Focus first focusable element in the target section
                (
                  transformedElement
                    ?.querySelector(`[id="${parsedUrl.hash.slice(1)}"]`)
                    ?.querySelector('a, button, [tabindex]') as HTMLElement
                )?.focus();
              }
            } else {
              if (modifierActive) {
                window.open(url, '_blank');
              } else {
                navigate(url);
              }
            }
          },
        }),
        // disable MkDocs drawer toggling ('for' attribute => checkbox mechanism)
        onCssReady({
          onLoading: () => {},
          onLoaded: () => {
            transformedElement
              .querySelector('.md-nav__title')
              ?.removeAttribute('for');
          },
        }),
        // hide sidebars until their positions are updated
        onCssReady({
          onLoading: () => {
            if (layout !== 'legacy') return;
            const sidebars = Array.from(
              transformedElement.querySelectorAll<HTMLElement>('.md-sidebar'),
            );
            sidebars.forEach(element => {
              element.style.setProperty('opacity', '0');
            });
          },
          onLoaded: () => {},
        }),
        addNavLinkKeyboardToggle(),
      ]),
    [theme, navigate, analytics, entityRef.name, configApi, layout],
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

      // Skip this update if the location's path has changed but the state
      // contains a page that isn't loaded yet.
      if (currPath !== path) {
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
  }, [rawPage, currPath, path, preRender, postRender]);

  return dom;
};
