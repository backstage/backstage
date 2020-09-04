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

import {
  googleAuthApiRef,
  gitlabAuthApiRef,
  oktaAuthApiRef,
  githubAuthApiRef,
  samlAuthApiRef,
} from '@backstage/core';

export const providers = [
  {
    id: 'google-auth-provider',
    title: 'Google',
    message: 'Sign In using Google',
    apiRef: googleAuthApiRef,
  },
  {
    id: 'gitlab-auth-provider',
    title: 'Gitlab',
    message: 'Sign In using Gitlab',
    apiRef: gitlabAuthApiRef,
  },
  {
    id: 'github-auth-provider',
    title: 'Github',
    message: 'Sign In using Github',
    apiRef: githubAuthApiRef,
  },
  {
    id: 'okta-auth-provider',
    title: 'Okta',
    message: 'Sign In using Okta',
    apiRef: oktaAuthApiRef,
  },
  {
    id: 'saml-auth-provider',
    title: 'SAML',
    message: 'Sign In using SAML',
    apiRef: samlAuthApiRef,
  },
];
