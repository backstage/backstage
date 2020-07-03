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

import React from 'react';
import { useShadowDom } from '..';
import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';

import { useLocation, useParams, useNavigate } from 'react-router-dom';

import transformer, {
  addBaseUrl,
  rewriteDocLinks,
  addLinkClickListener,
  removeMkdocsHeader,
  modifyCss,
} from '../transformers';
import { docStorageURL } from '../../config';
import URLFormatter from '../urlFormatter';
import { TechDocsNotFound } from './TechDocsNotFound';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';

const useFetch = (url: string): AsyncState<string | Error> => {
  const state = useAsync(async () => {
    const request = await fetch(url);
    if (request.status === 404) {
      return [request.url, new Error('Page not found')];
    }
    const response = await request.text();
    return [request.url, response];
  }, [url]);

  const [fetchedUrl, fetchedValue] = state.value ?? [];

  if (url !== fetchedUrl) {
    // Fixes a race condition between two pages
    return { loading: true };
  }

  return Object.assign(state, fetchedValue ? { value: fetchedValue } : {});
};

const useEnforcedTrailingSlash = (): void => {
  React.useEffect(() => {
    const actualUrl = window.location.href;
    const expectedUrl = new URLFormatter(window.location.href).formatBaseURL();

    if (actualUrl !== expectedUrl) {
      window.history.replaceState({}, document.title, expectedUrl);
    }
  }, []);
};

export const Reader = () => {
  const location = useLocation();
  const { componentId, '*': path } = useParams();
  const [ref, shadowRoot] = useShadowDom(componentId, path);
  const navigate = useNavigate();
  const normalizedUrl = new URLFormatter(
    `${docStorageURL}${location.pathname.replace('/docs', '')}`,
  ).formatBaseURL();
  const state = useFetch(`${normalizedUrl}index.html`);

  useEnforcedTrailingSlash();

  React.useEffect(() => {
    const divElement = shadowDomRef.current;
    if (
      divElement?.shadowRoot &&
      state.value &&
      !(state.value instanceof Error)
    ) {
      const transformedElement = transformer(state.value, [
        addBaseUrl({
          docStorageURL,
          componentId,
          path,
        }),
        rewriteDocLinks(),
        modifyCss({
          cssTransforms: {
            '.md-main__inner': [{ 'margin-top': '0' }],
            '.md-sidebar': [{ top: '0' }, { width: '20rem' }],
            '.md-typeset': [{ 'font-size': '1rem' }],
            '.md-nav': [{ 'font-size': '1rem' }],
            '.md-grid': [{ 'max-width': '80vw' }],
          },
        }),
        removeMkdocsHeader(),
      ]);

      divElement.shadowRoot.innerHTML = '';

      if (transformedElement) {
        divElement.shadowRoot.appendChild(transformedElement);
        transformer(divElement.shadowRoot.children[0], [
          dom => {
            setTimeout(() => {
              if (window.location.hash) {
                const hash = window.location.hash.slice(1);
                divElement.shadowRoot?.getElementById(hash)?.scrollIntoView();
              }
            }, 200);
            return dom;
          },
          addLinkClickListener({
            onClick: (_: MouseEvent, url: string) => {
              const parsedUrl = new URL(url);
              navigate(`${parsedUrl.pathname}${parsedUrl.hash}`);

              divElement.shadowRoot
                ?.querySelector(parsedUrl.hash)
                ?.scrollIntoView();
            },
          }),
        ]);
      }
    }
  }, [shadowDomRef, state, componentId, path, navigate]);

  if (state.value instanceof Error) return <TechDocsNotFound />;

  return (
    <>
      <TechDocsPageWrapper title={componentId} subtitle={componentId}>
        <div ref={shadowDomRef} />
      </TechDocsPageWrapper>
    </>
  );
};
