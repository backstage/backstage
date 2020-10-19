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

const determineBitBucketBranch = (url: string): string => {
  const delimiter = '/';
  const start = 6;
  const result = url?.split(delimiter).slice(start)[0];
  return result;
};

/**
 * Creates the edit link for components yaml file
 * @see LocationSpec
 * @param location The LocationSpec being used to determine entity SCM location
 * @returns string representing the edit location based on SCM path
 */

export const createEditLink = (location: LocationSpec): string => {
  switch (location.type) {
    case 'github':
    case 'gitlab':
      return location.target.replace('/blob/', '/edit/');
    case 'bitbucket':
      return location.target.concat(
        `?mode=edit&spa=0&at=${determineBitBucketBranch(location.target)}`,
      );
    case 'url':
      if (
        location.target.includes('https://github.com') ||
        location.target.includes('https://gitlab.com/')
      ) {
        return location.target.replace('/blob/', '/edit/');
      } else if (location.target.includes('https://bitbucket.org')) {
        return location.target.concat(
          `?mode=edit&spa=0&at=${determineBitBucketBranch(location.target)}`,
        );
      }
      return location.target;
    default:
      return location.target;
  }
};

/**
 * Determines type based on passed in url. This is used to set the icon associated with the type of entity
 * @param url
 * @returns string representing type of icon to be used
 */
export const determineUrlType = (url: string): string => {
  if (url.includes('https://github.com/')) {
    return 'github';
  } else if (url.includes('https://bitbucket.org/')) {
    return 'bitbucket';
  } else if (url.includes('https://gitlab.com/')) {
    return 'gitlab';
  }
  return 'url';
};
