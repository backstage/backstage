/*
 * Copyright 2023 The Backstage Authors
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
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Resolve a URL to a relative URL given a base URL that may or may not include subpaths.
 * @param url - URL to parse into a relative url based on the baseUrl.
 * @param baseUrl - Application base url, where the application is currently hosted.
 * @returns relative path without any subpaths from website config.
 */
export function resolveUrlToRelative(url: string, baseUrl: string) {
  const parsedAppUrl = new URL(baseUrl);
  const appUrlPath = `${parsedAppUrl.origin}${parsedAppUrl.pathname.replace(
    /\/$/,
    '',
  )}`;

  const relativeUrl = url
    .replace(appUrlPath, '')
    // Remove any leading and trailing slashes.
    .replace(/\/+$/, '')
    .replace(/^\/+/, '');
  const parsedUrl = new URL(`http://localhost/${relativeUrl}`);
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}

/**
 * A helper hook that allows for full internal website urls to be processed through the navigate
 *  hook provided by `react-router-dom`.
 *
 * NOTE: This does not support routing to external URLs. That should be done with a `Link` or `a`
 *  element instead, or just `window.location.href`.
 *
 * @returns Navigation function that is a wrapper over `react-router-dom`'s
 *  to support passing full URLs for navigation.
 *
 * @public
 */
export function useNavigateUrl() {
  const navigate = useNavigate();
  const configApi = useApi(configApiRef);
  const appBaseUrl = configApi.getString('app.baseUrl');
  const navigateFn = useCallback(
    (to: string) => {
      let url = to;
      try {
        url = resolveUrlToRelative(to, appBaseUrl);
      } catch (err) {
        // URL passed in was relative.
      }
      navigate(url);
    },
    [navigate, appBaseUrl],
  );
  return navigateFn;
}
