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
import transformer, { addBaseUrl, rewriteDocLinks } from '../../transformers';
import { baseUrl } from '../../config';
import { Link } from '@backstage/core';
import { useLocation, useParams } from 'react-router-dom';

const useFetch = (url: string) => {
  const state = useAsync(async () => {
    const response = await fetch(url);
    const raw = await response.text();
    return raw;
  }, [url]);

  return state;
};

const normalizeUrl = (path: string) => {
  return path.replace(/\/\/index.html$/, '/index.html');
};

export const Reader = () => {
  const location = useLocation();
  const { componentId, '*': path } = useParams();
  const shadowDomRef = useShadowDom();
  const state = useFetch(
    normalizeUrl(
      `${baseUrl}${location.pathname.replace('/docs', '')}/index.html`,
    ),
  );
  // https://techdocs-mock-sites.storage.googleapis.com/mkdocs/user-guide/configuration/custom-themes/index.html
  React.useEffect(() => {
    const divElement = shadowDomRef.current;
    if (divElement?.shadowRoot && state.value) {
      divElement.shadowRoot.innerHTML = transformer(state.value, [
        addBaseUrl({
          baseUrl,
          componentId,
          path,
        }),
        rewriteDocLinks({
          componentId,
        }),
      ]);
    }
  }, [shadowDomRef, state, componentId, path]);

  return (
    <>
      <nav>
        <Link to="/docs/mkdocs">mkdocs</Link>
        <Link to="/docs/backstage-microsite">Backstage docs</Link>
      </nav>
      <div ref={shadowDomRef} />
    </>
  );
};
