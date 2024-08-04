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

export const handleMetaRedirects = (
  navigate: (to: string) => void,
  entityName: string,
): Transformer => {
  return dom => {
    for (const elem of Array.from(dom.querySelectorAll('meta'))) {
      if (elem.getAttribute('http-equiv') === 'refresh') {
        const metaContentParameters = elem
          .getAttribute('content')
          ?.split('url=');
        if (!metaContentParameters || metaContentParameters.length < 2) {
          continue;
        }

        const metaUrl = metaContentParameters[1];
        const normalizedCurrentUrl = normalizeUrl(window.location.href);
        // If metaUrl is relative, it will be resolved with base href. If it is absolute, it will replace the base href when creating URL object.
        const absoluteRedirectObj = new URL(metaUrl, normalizedCurrentUrl);
        const isExternalRedirect =
          absoluteRedirectObj.hostname !== window.location.hostname;

        if (isExternalRedirect) {
          // If the redirect is external, navigate to the documentation site home instead of the external url.
          const currentTechDocPath = window.location.pathname;
          const indexOfSiteHome = currentTechDocPath.indexOf(entityName);
          const siteHomePath = currentTechDocPath.slice(
            0,
            indexOfSiteHome + entityName.length,
          );
          navigate(siteHomePath);
        } else {
          // The navigate function from dom.tsx is a wrapper around react-router navigate function that helps absolute url redirects.
          navigate(absoluteRedirectObj.href);
        }
        return dom;
      }
    }
    return dom;
  };
};
