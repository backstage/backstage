/*
 * Copyright 2020 The Backstage Authors
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
  googleAuthApiRef,
  gitlabAuthApiRef,
  oktaAuthApiRef,
  githubAuthApiRef,
  microsoftAuthApiRef,
  oneloginAuthApiRef,
  bitbucketAuthApiRef,
  bitbucketServerAuthApiRef,
} from '@backstage/core-plugin-api';

export const providers = [
  {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign In using Google',
    apiRef: googleAuthApiRef,
  },
  {
    id: 'microsoft-auth-provider',
    title: 'Microsoft',
    message: 'Sign In using Microsoft Azure AD',
    apiRef: microsoftAuthApiRef,
  },
  {
    id: 'gitlab-auth-provider',
    title: 'GitLab',
    message: 'Sign In using GitLab',
    apiRef: gitlabAuthApiRef,
  },
  {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Sign In using GitHub',
    apiRef: githubAuthApiRef,
  },
  {
    id: 'okta-auth-provider',
    title: 'Okta',
    message: 'Sign In using Okta',
    apiRef: oktaAuthApiRef,
  },
  {
    id: 'onelogin-auth-provider',
    title: 'OneLogin',
    message: 'Sign In using OneLogin',
    apiRef: oneloginAuthApiRef,
  },
  {
    id: 'bitbucket-auth-provider',
    title: 'Bitbucket',
    message: 'Sign In using Bitbucket',
    apiRef: bitbucketAuthApiRef,
  },
  {
    id: 'bitbucket-server-auth-provider',
    title: 'Bitbucket Server',
    message: 'Sign In using Bitbucket Server',
    apiRef: bitbucketServerAuthApiRef,
  },
];
