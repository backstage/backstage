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

const useFetch = (url: string) => {
  const state = useAsync(async () => {
    const response = await fetch(url);
    const raw = await response.text();
    return raw;
  }, [url]);

  return state;
};

const addBaseUrl = (htmlString: string, baseUrl: string): string => {
  const domParser = new DOMParser().parseFromString(htmlString, 'text/html');

  const updateDom = <T extends Element>(
    list: Array<T>,
    attributeName: string,
  ): void => {
    Array.from(list).forEach((elem: T) => {
      const newUrl = new URL(
        elem.getAttribute(attributeName)!,
        baseUrl,
      ).toString();
      elem.setAttribute(attributeName, newUrl);
    });
  };

  updateDom<HTMLImageElement>(Array.from(domParser.images), 'src');
  updateDom<HTMLAnchorElement | HTMLAreaElement>(
    Array.from(domParser.links),
    'href',
  );
  updateDom<HTMLLinkElement>(
    Array.from(domParser.querySelectorAll('link')),
    'href',
  );

  return domParser.body.parentElement?.outerHTML || htmlString;
};

export const Reader = () => {
  const shadowDomRef = useShadowDom();
  const state = useFetch(
    'https://techdocs-mock-sites.storage.googleapis.com/mkdocs/index.html',
  );

  React.useEffect(() => {
    const divElement = shadowDomRef.current;
    if (divElement?.shadowRoot && state.value) {
      divElement.shadowRoot.innerHTML = addBaseUrl(
        state.value,
        'https://techdocs-mock-sites.storage.googleapis.com/mkdocs/',
      );
    }
  }, [shadowDomRef, state]);

  return (
    <>
      <h3>Shadow DOM should be underneath</h3>
      <div ref={shadowDomRef} />
    </>
  );
};
