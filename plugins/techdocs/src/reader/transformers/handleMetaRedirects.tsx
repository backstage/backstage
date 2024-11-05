/*
 * Copyright 2024 The Backstage Authors
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

import { Transformer } from './transformer';
import { normalizeUrl } from './rewriteDocLinks';
import React from 'react';
import { renderReactElement } from './renderReactElement';
import { TechDocsRedirectNotification } from '../components/TechDocsRedirectNotification';

export const handleMetaRedirects = (entityName: string): Transformer => {
  const redirectAfterMs = 3000;

  const determineRedirectURL = (metaUrl: string) => {
    const normalizedCurrentUrl = normalizeUrl(window.location.href);
    // When creating URL object, if the metaUrl is relative, it will be resolved with base href. If it is absolute, it will replace the base href.
    const absoluteRedirectObj = new URL(metaUrl, normalizedCurrentUrl);
    const isExternalRedirect =
      absoluteRedirectObj.hostname !== window.location.hostname;

    if (isExternalRedirect) {
      const currentTechDocPath = window.location.pathname;
      const indexOfSiteHome = currentTechDocPath.indexOf(entityName);
      const siteHomePath = currentTechDocPath.slice(
        0,
        indexOfSiteHome + entityName.length,
      );
      return new URL(siteHomePath, normalizedCurrentUrl).href;
    }
    return absoluteRedirectObj.href;
  };

  return dom => {
    for (const elem of Array.from(dom.querySelectorAll('meta'))) {
      if (elem.getAttribute('http-equiv') === 'refresh') {
        const metaContentParameters = elem
          .getAttribute('content')
          ?.split('url=');

        if (!metaContentParameters || metaContentParameters.length < 2) {
          return dom;
        }
        const metaUrl = metaContentParameters[1];
        const redirectURL = determineRedirectURL(metaUrl);

        // If the current URL is the same as the redirect URL, do not proceed with the redirect.
        if (window.location.href === redirectURL) {
          return dom;
        }

        const container = document.createElement('div');

        renderReactElement(
          <TechDocsRedirectNotification
            message="This TechDocs page is no longer maintained. Will automatically redirect to the designated replacement."
            handleButtonClick={() => {
              window.location.href = redirectURL;
            }}
            autoHideDuration={redirectAfterMs}
          />,
          container,
        );
        document.body.appendChild(container);

        setTimeout(() => {
          window.location.href = redirectURL;
        }, redirectAfterMs);

        return dom;
      }
    }
    return dom;
  };
};
