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
  useMemo,
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
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';

import { useTechDocsReader } from '../TechDocsReaderProvider';

import {
  transform as transformer,
  useSanitizerTransformer,
  useStylesTransformer,
  getDefaultTransformers,
} from '../../transformers';
import { useNavigateUrl } from './useNavigateUrl';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
): Element | null => {
  const navigate = useNavigateUrl();
  const theme = useTheme();
  const isMobileMedia = useMediaQuery(MOBILE_MEDIA_QUERY);
  const sanitizerTransformer = useSanitizerTransformer();
  const stylesTransformer = useStylesTransformer();
  const analytics = useAnalytics();

  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const configApi = useApi(configApiRef);

  const { state, path, content: rawPage } = useTechDocsReader();
  const { transformersApi } = useTechDocsReaderPage();
  const { '*': currPath = '' } = useParams();

  const [dom, setDom] = useState<HTMLElement | null>(null);
  const isStyleLoading = useShadowDomStylesLoading(dom);

  useInitialRedirect(defaultPath);

  const updateSidebarPositionAndHeight = useCallback(() => {
    if (!dom) return;

    const sidebars = dom.querySelectorAll<HTMLElement>('.md-sidebar');

    sidebars.forEach(element => {
      // set sidebar position to render in correct position
      if (isMobileMedia) {
        element.style.top = '0px';
      } else {
        const page = document?.querySelector('.techdocs-reader-page');
        const pageTop = page?.getBoundingClientRect().top ?? 0;
        let domTop = dom.getBoundingClientRect().top ?? 0;

        const tabs = dom.querySelector('.md-container > .md-tabs');
        const tabsHeight = tabs?.getBoundingClientRect().height ?? 0;

        // the sidebars should not scroll beyond the total height of the header and tabs
        if (domTop < pageTop) {
          domTop = pageTop;
        }

        const scrollbarTopPx = Math.max(domTop, 0) + tabsHeight;

        element.style.top = `${scrollbarTopPx}px`;

        // set scrollbar height to ensure all links can be seen when content is small
        const footer = dom.querySelector('.md-container > .md-footer');
        // if no footer, fallback to using the bottom of the window
        const scrollbarEndPx =
          footer?.getBoundingClientRect().top ?? window.innerHeight;

        element.style.height = `${scrollbarEndPx - scrollbarTopPx}px`;
      }

      // show the sidebar only after updating its position
      element.style.setProperty('opacity', '1');
    });
  }, [dom, isMobileMedia]);

  useEffect(() => {
    window.addEventListener('resize', updateSidebarPositionAndHeight);
    window.addEventListener('scroll', updateSidebarPositionAndHeight, true);
    return () => {
      window.removeEventListener('resize', updateSidebarPositionAndHeight);
      window.removeEventListener(
        'scroll',
        updateSidebarPositionAndHeight,
        true,
      );
    };
  }, [dom, updateSidebarPositionAndHeight]);

  // dynamically set width of footer to accommodate for pinning of the sidebar
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
  }, [dom, updateFooterWidth]);

  // an update to "state" might lead to an updated UI so we include it as a trigger
  useEffect(() => {
    if (!isStyleLoading) {
      updateFooterWidth();
      updateSidebarPositionAndHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,
    isStyleLoading,
    updateFooterWidth,
    updateSidebarPositionAndHeight,
  ]);

  // Compute defaults and let the API customize them
  const allTransformers = useMemo(() => {
    const defaults = getDefaultTransformers({
      sanitizerTransformer,
      stylesTransformer,
      techdocsStorageApi,
      scmIntegrationsApi,
      entityRef,
      contentPath: path,
      theme,
      navigate,
      analytics,
      configApi,
    });

    // If no transformers API, just use defaults
    if (!transformersApi) {
      return defaults;
    }

    // Let the API customize/filter defaults and add custom transformers
    const transformed = transformersApi.getTransformers(defaults);

    // Sort by priority
    transformed.sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50));
    return transformed;
  }, [
    sanitizerTransformer,
    stylesTransformer,
    techdocsStorageApi,
    scmIntegrationsApi,
    entityRef,
    path,
    theme,
    navigate,
    analytics,
    configApi,
    transformersApi,
  ]);

  // Split transformers by phase
  const preRenderTransformers = useMemo(
    () =>
      allTransformers.filter(t => t.phase === 'pre').map(t => t.transformer),
    [allTransformers],
  );

  const postRenderTransformers = useMemo(
    () =>
      allTransformers.filter(t => t.phase === 'post').map(t => t.transformer),
    [allTransformers],
  );

  // a function that performs transformations that are executed prior to adding it to the DOM
  const preRender = useCallback(
    (rawContent: string, _contentPath: string) =>
      transformer(rawContent, preRenderTransformers),
    [preRenderTransformers],
  );

  // a function that performs transformations that are executed after adding it to the DOM
  const postRender = useCallback(
    async (transformedElement: Element) =>
      transformer(transformedElement, postRenderTransformers),
    [postRenderTransformers],
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
