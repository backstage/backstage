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
import transformer, {
  addBaseUrl,
  rewriteDocLinks,
  addEventListener,
} from '../transformers';
import { docStorageURL } from '../../config';
import { Grid } from '@material-ui/core';
import { Header, Content, ItemCard } from '@backstage/core';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import URLParser from '../urlParser';

const useFetch = (url: string) => {
  const state = useAsync(async () => {
    const response = await fetch(url);
    const raw = await response.text();
    return raw;
  }, [url]);

  return state;
};

const useEnforcedTrailingSlash = (): void => {
  React.useEffect(() => {
    const actualUrl = window.location.href;
    const expectedUrl = new URLParser(window.location.href, '.').parse();

    if (actualUrl !== expectedUrl) {
      window.history.replaceState({}, document.title, expectedUrl);
    }
  }, []);
};

export const Reader = () => {
  const location = useLocation();
  const { componentId, '*': path } = useParams();
  const shadowDomRef = useShadowDom();
  const navigate = useNavigate();
  const normalizedUrl = new URLParser(
    `${docStorageURL}${location.pathname.replace('/docs', '')}`,
    '.',
  ).parse();
  const state = useFetch(`${normalizedUrl}index.html`);

  useEnforcedTrailingSlash();

  React.useEffect(() => {
    const divElement = shadowDomRef.current;
    if (divElement?.shadowRoot && state.value) {
      const transformedElement = transformer(state.value, [
        addBaseUrl({
          docStorageURL,
          componentId,
          path,
        }),
        rewriteDocLinks({
          componentId,
        }),
      ]);

      divElement.shadowRoot.innerHTML = '';
      if (transformedElement) {
        divElement.shadowRoot.appendChild(transformedElement);
        transformer(divElement.shadowRoot.children[0], [
          addEventListener({
            onClick: navigate,
          }),
        ]);
      }
    }
  }, [shadowDomRef, state, componentId, path, navigate]);

  return (
    <>
      {componentId ? (
        <div ref={shadowDomRef} />
      ) : (
        <>
          <Header
            title="Documentation"
            subtitle="Documentation available in Backstage"
          />

          <Content>
            <Grid container>
              <Grid item xs={12} sm={6} md={3}>
                <ItemCard
                  onClick={() => navigate('/docs/mkdocs')}
                  tags={['Developer Tool']}
                  title="MkDocs"
                  label="Read Docs"
                  description="MkDocs is a fast, simple and downright gorgeous static site generator that's geared towards building project documentation. "
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ItemCard
                  onClick={() => navigate('/docs/backstage-microsite')}
                  tags={['Service']}
                  title="Backstage"
                  label="Read Docs"
                  description="Getting started guides, API Overview, documentation around how to Create a Plugin and more. "
                />
              </Grid>
            </Grid>
          </Content>
        </>
      )}
    </>
  );
};
