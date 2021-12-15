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

import {
  AuthorizeRequest,
  AuthorizeRequestOptions,
  AuthorizeResponse,
  AuthorizeResult,
  PermissionClient,
} from '@backstage/plugin-permission-common';

const isDefined = <T>(input: T | undefined): input is T => {
  return typeof input !== 'undefined';
};

export const filterUnauthorized = async <T>(options: {
  entries: T[];
  toAuthorizeRequest: (entry: T) => AuthorizeRequest | undefined;
  requestOptions?: AuthorizeRequestOptions;
  permissions: PermissionClient;
}): Promise<T[]> => {
  const { entries, toAuthorizeRequest, permissions, requestOptions } = options;

  if (!entries.some(toAuthorizeRequest)) {
    // no entries require authorization, we can return
    // the results without any extra work.
    return entries;
  }

  const authorizeRequests = entries.map(toAuthorizeRequest).filter(isDefined);

  const authorizeResponses = await permissions.authorize(
    authorizeRequests,
    requestOptions,
  );

  const authorizationMap = new Map<AuthorizeRequest, AuthorizeResponse>(
    authorizeRequests.map((request, i) => [request, authorizeResponses[i]]),
  );

  return entries.filter(entry => {
    const authorizeRequest = toAuthorizeRequest(entry);

    return (
      !authorizeRequest ||
      authorizationMap.get(authorizeRequest)?.result === AuthorizeResult.ALLOW
    );
  });
};
