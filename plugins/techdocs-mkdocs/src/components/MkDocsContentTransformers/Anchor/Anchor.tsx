/*
 * Copyright 2021 The Backstage Authors
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
import { useNavigate } from 'react-router-dom';

import { useTechDocsBaseUrl } from '../hooks';
import { FeedbackLink } from './FeedbackLink';

/** Make sure that the input url always ends with a '/' */
const normalizeUrl = (url: string) => {
  const value = new URL(url);

  if (!value.pathname.endsWith('/') && !value.pathname.endsWith('.html')) {
    value.pathname += '/';
  }

  return value.toString();
};

export const AnchorTransformer = () => {
  const navigate = useNavigate();

  useTechDocsBaseUrl(
    'a',
    'href',
    (attributeName, attributeValue, baseUrl, element) => {
      if (element.hasAttribute('download')) {
        element.setAttribute(attributeName, baseUrl);
        return;
      }

      // if link is external, add target to open in a new window or tab
      if (attributeValue.match(/^https?:\/\//i)) {
        element.setAttribute('target', '_blank');
      }

      const base = normalizeUrl(window.location.href);
      const href = new URL(attributeValue, base).toString();

      element.setAttribute('href', href);

      element.addEventListener('click', (event: MouseEvent) => {
        if (!href.startsWith(origin)) return;

        event.preventDefault();

        const { pathname, hash } = new URL(href);
        const url = pathname.concat(hash);

        // detect if CTRL or META keys are pressed
        // so that links can be opened in a new tab
        if (event.ctrlKey || event.metaKey) {
          window.open(url, '_blank');
          return;
        }

        navigate(url);
      });
    },
  );

  return <FeedbackLink />;
};
