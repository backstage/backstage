/*
 * Copyright 2020 Spotify AB
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
import { EntityName } from '@backstage/catalog-model';
import { useApi } from '@backstage/core';
import { BackstageTheme } from '@backstage/theme';
import { useTheme } from '@material-ui/core';
<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
>>>>>>> 3ab0f7d4f (TechDocs: show outdated docs and asnyc build new)
import { useNavigate, useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { techdocsStorageApiRef } from '../../api';
import transformer, {
  addBaseUrl,
  addLinkClickListener,
  injectCss,
  onCssReady,
  removeMkdocsHeader,
  rewriteDocLinks,
  sanitizeDOM,
  simplifyMkdocsFooter,
} from '../transformers';
import { TechDocsNotFound } from './TechDocsNotFound';
import TechDocsProgressBar from './TechDocsProgressBar';

type Props = {
  entityId: EntityName;
  onReady?: () => void;
};

export const Reader = ({ entityId, onReady }: Props) => {
  const { kind, namespace, name } = entityId;
  const { '*': path } = useParams();
  const theme = useTheme<BackstageTheme>();

  const techdocsStorageApi = useApi(techdocsStorageApiRef);
<<<<<<< HEAD
  const [shadowDomRef, shadowRoot] = useShadowDom();
  const [sidebars, setSidebars] = useState<HTMLElement[]>();
=======
>>>>>>> 3ab0f7d4f (TechDocs: show outdated docs and asnyc build new)
  const navigate = useNavigate();
  const shadowDomRef = useRef(null);
  const [loadedPath, setLoadedPath] = useState('');
  const [atInitialLoad, setAtInitialLoad] = useState(true);
  const [newerDocsExist, setNewerDocsExist] = useState(false);

  const {
    value: isSynced,
    loading: syncInProgress,
    error: syncError,
  } = useAsync(async () => {
    // Attempt to sync only if `techdocs.builder` in app config is set to 'local'
    if ((await techdocsStorageApi.getBuilder()) !== 'local') {
      return Promise.resolve({
        value: true,
        loading: null,
        error: null,
      });
    }
    return techdocsStorageApi.syncEntityDocs({ kind, namespace, name });
  });

  const {
    value: rawPage,
    loading: docLoading,
    error: docLoadError,
  } = useAsync(async () => {
    // do not automatically load same page again if URL has not changed,
    // happens when generating new docs finishes
    if (newerDocsExist && path === loadedPath) {
      return null;
    }
    return techdocsStorageApi.getEntityDocs({ kind, namespace, name }, path);
  }, [techdocsStorageApi, kind, namespace, name, path, isSynced]);

  useEffect(() => {
    const updateSidebarPosition = () => {
      if (!!shadowRoot && !!shadowDomRef.current && !!sidebars) {
        sidebars!.forEach(sidebar => {
          const newTop = Math.max(
            shadowDomRef.current!.getBoundingClientRect().top,
            0,
          );
          sidebar.style.top = `${newTop}px`;
        });
      }
    };
    updateSidebarPosition();
    window.addEventListener('scroll', updateSidebarPosition);
    window.addEventListener('resize', updateSidebarPosition);
    return () => {
      window.removeEventListener('scroll', updateSidebarPosition);
      window.removeEventListener('resize', updateSidebarPosition);
    };
  }, [shadowDomRef, shadowRoot, sidebars]);

  useEffect(() => {
    if (rawPage) {
      setLoadedPath(path);
    }
  }, [rawPage, path]);

  useEffect(() => {
    if (atInitialLoad === false) {
      return;
    }
    setTimeout(() => {
      setAtInitialLoad(false);
    }, 5000);
  });

  useEffect(() => {
    if (!atInitialLoad && !!rawPage && syncInProgress) {
      setNewerDocsExist(true);
    }
  }, [atInitialLoad, rawPage, syncInProgress]);

  useEffect(() => {
    if (!rawPage || !shadowDomRef.current) {
      return;
    }
    if (onReady) {
      onReady();
    }
    // Pre-render
    const transformedElement = transformer(rawPage as string, [
      sanitizeDOM(),
      addBaseUrl({
        techdocsStorageApi,
        entityId: entityId,
        path,
      }),
      rewriteDocLinks(),
      removeMkdocsHeader(),
      simplifyMkdocsFooter(),
      injectCss({
        css: `
        body {
          font-family: ${theme.typography.fontFamily};
          --md-text-color: ${theme.palette.text.primary};
          --md-text-link-color: ${theme.palette.primary.main};

          --md-code-fg-color: ${theme.palette.text.primary};
          --md-code-bg-color: ${theme.palette.background.paper};
        }
        .md-main__inner { margin-top: 0; }
        .md-sidebar {  position: fixed; bottom: 100px; width: 20rem; }
        .md-sidebar--secondary { right: 2rem; }
        .md-content { margin-bottom: 50px }
        .md-footer { position: fixed; bottom: 0px; width: 100vw; }
        .md-footer-nav__link { width: 20rem;}
        .md-content { margin-left: 20rem; max-width: calc(100% - 20rem * 2 - 3rem); }
        .md-typeset { font-size: 1rem; }
        .md-nav { font-size: 1rem; }
        .md-grid { max-width: 90vw; margin: 0 }
        @media screen and (max-width: 76.1875em) {
          .md-nav { 
            background-color: ${theme.palette.background.default}; 
            transition: none !important
          }
          .md-sidebar--secondary { display: none; }
          .md-sidebar--primary { left: 72px; width: 10rem }
          .md-content { margin-left: 10rem; max-width: 100%; }
          .md-content__inner { font-size: 0.9rem }
          .md-footer { 
            position: static; 
            margin-left: 10rem; 
            width: calc(100% - 10rem); 
          }
          .md-nav--primary .md-nav__title {  
            white-space: normal;
            height: auto;
            line-height: 1rem;
            cursor: auto;
          }
          .md-nav--primary > .md-nav__title [for="none"] {
            padding-top: 0;
          } 
        }
        `,
      }),
    ]);

    if (!transformedElement) {
      return; // An unexpected error occurred
    }

    const shadowDiv: HTMLElement = shadowDomRef.current!;
    const shadowRoot =
      shadowDiv.shadowRoot || shadowDiv.attachShadow({ mode: 'open' });
    Array.from(shadowRoot.children).forEach(child =>
      shadowRoot.removeChild(child),
    );
    shadowRoot.appendChild(transformedElement);

    // Post-render
    transformer(shadowRoot.children[0], [
      dom => {
        setTimeout(() => {
          if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            shadowRoot?.getElementById(hash)?.scrollIntoView();
          }
        }, 200);
        return dom;
      },
      addLinkClickListener({
        baseUrl: window.location.origin,
        onClick: (_: MouseEvent, url: string) => {
          window.scroll({ top: 0 });
          const parsedUrl = new URL(url);
          if (newerDocsExist && isSynced) {
            // link navigation will load newer docs
            setNewerDocsExist(false);
          }
          if (parsedUrl.hash) {
            navigate(`${parsedUrl.pathname}${parsedUrl.hash}`);
          } else {
            navigate(parsedUrl.pathname);
          }
        },
      }),
      onCssReady({
        docStorageUrl: techdocsStorageApi.getApiOrigin(),
        onLoading: (dom: Element) => {
          (dom as HTMLElement).style.setProperty('opacity', '0');
        },
        onLoaded: (dom: Element) => {
          (dom as HTMLElement).style.removeProperty('opacity');
          // disable MkDocs drawer toggling ('for' attribute => checkbox mechanism)
          (dom as HTMLElement)
            .querySelector('.md-nav__title')
            ?.removeAttribute('for');
          const sideDivs: HTMLElement[] = Array.from(
            shadowRoot!.querySelectorAll('.md-sidebar'),
          );
          setSidebars(sideDivs);
          // set sidebar height so they don't initially render in wrong position
          const docTopPosition = (dom as HTMLElement).getBoundingClientRect()
            .top;
          sideDivs!.forEach(sidebar => {
            sidebar.style.top = `${docTopPosition}px`;
          });
        },
      }),
    ]);
  }, [
    rawPage,
    entityId,
    navigate,
    onReady,
    shadowDomRef,
    path,
    techdocsStorageApi,
    theme,
    kind,
    namespace,
    name,
    newerDocsExist,
    isSynced,
  ]);

  // docLoadError not considered an error state if sync request is still ongoing
  // or sync just completed and doc is loading again
  if ((docLoadError && !syncInProgress && !docLoading) || syncError) {
    let errMessage = '';
    if (docLoadError) {
      errMessage += ` Load error: ${docLoadError}`;
    }
    if (syncError) errMessage += ` Build error: ${syncError}`;
    return <TechDocsNotFound errorMessage={errMessage} />;
  }

  return (
    <>
      {newerDocsExist && !isSynced ? (
        <Alert variant="outlined" severity="info">
          A newer version of this documentation is being prepared and will be
          available shortly.
        </Alert>
      ) : null}
      {newerDocsExist && isSynced ? (
        <Alert variant="outlined" severity="success">
          A newer version of this documentation is now available, please refresh
          to view.
        </Alert>
      ) : null}
      {docLoading || (docLoadError && syncInProgress) ? (
        <TechDocsProgressBar />
      ) : null}
      <div ref={shadowDomRef} />
    </>
  );
};
