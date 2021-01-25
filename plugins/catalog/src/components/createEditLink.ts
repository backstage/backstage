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

import { LocationSpec } from '@backstage/catalog-model';
import parseGitUrl from 'git-url-parse';

/**
 * Creates the edit link for components yaml file
 * @see LocationSpec
 * @param location The LocationSpec being used to determine entity SCM location
 * @returns string representing the edit location based on SCM path
 */

export const createEditLink = (location: LocationSpec): string | undefined => {
  try {
    const urlData = parseGitUrl(location.target);
    const url = new URL(location.target);
    switch (location.type) {
      case 'github':
      case 'gitlab':
        return location.target.replace('/blob/', '/edit/');
      case 'bitbucket':
        url.searchParams.set('mode', 'edit');
        url.searchParams.set('spa', '0');
        url.searchParams.set('at', urlData.ref);
        return url.toString();
      case 'url':
        if (
          urlData.source === 'github.com' ||
          urlData.source === 'gitlab.com/'
        ) {
          return location.target.replace('/blob/', '/edit/');
        } else if (urlData.source === 'bitbucket.org') {
          url.searchParams.set('mode', 'edit');
          url.searchParams.set('spa', '0');
          url.searchParams.set('at', urlData.ref);
          return url.toString();
        }
        return location.target;
      default:
        return location.target;
    }
  } catch {
    return undefined;
  }
};

/**
 * Determines type based on passed in url. This is used to set the icon associated with the type of entity
 * @param url
 * @returns string representing type of icon to be used
 */
export const determineUrlType = (url: string): string => {
  const urlData = parseGitUrl(url);

  if (urlData.source === 'github.com') {
    return 'github';
  } else if (urlData.source === 'bitbucket.org') {
    return 'bitbucket';
  } else if (urlData.source === 'gitlab.com') {
    return 'gitlab';
  }
  return 'url';
};
