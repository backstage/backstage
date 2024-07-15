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

export const replaceMetaRedirects = (): Transformer => {
  return dom => {
    for (const elem of Array.from(dom.querySelectorAll('meta'))) {
      const metaContent = elem.getAttribute('content');
      const metaRefresh = elem.getAttribute('http-equiv');

      const metaContentParameters = metaContent?.split(';');
      const urlParam = metaContentParameters?.find(parameter =>
        parameter.includes('url='),
      );

      if (urlParam && metaRefresh === 'refresh') {
        const redirectUrl = urlParam.split('url=')[1];

        const link = document.createElement('a');
        link.setAttribute('href', redirectUrl);
        link.textContent = 'techdocs_redirect';
        elem.replaceWith(link);
        return dom;
      }
    }
    return dom;
  };
};
