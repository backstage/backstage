/*
 * Copyright 2022 The Backstage Authors
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

import { atlassian } from './atlassian/provider';
import { auth0 } from './auth0/provider';
import { awsAlb } from './aws-alb/provider';
import { bitbucket } from './bitbucket/provider';
import { gcpIap } from './gcp-iap/provider';
import { github } from './github/provider';
import { gitlab } from './gitlab/provider';
import { google } from './google/provider';
import { microsoft } from './microsoft/provider';
import { oauth2 } from './oauth2/provider';
import { oauth2Proxy } from './oauth2-proxy/provider';
import { oidc } from './oidc/provider';
import { okta } from './okta/provider';
import { onelogin } from './onelogin/provider';
import { saml } from './saml/provider';

/**
 * All built-in auth provider integrations.
 *
 * @public
 */
export const providers = Object.freeze({
  atlassian,
  auth0,
  awsAlb,
  bitbucket,
  gcpIap,
  github,
  gitlab,
  google,
  microsoft,
  oauth2,
  oauth2Proxy,
  oidc,
  okta,
  onelogin,
  saml,
});
