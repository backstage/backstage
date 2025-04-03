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

import { atlassian } from './atlassian';
import { auth0 } from './auth0';
import { awsAlb } from './aws-alb';
import { bitbucket } from './bitbucket';
import { cfAccess } from './cloudflare-access';
import { gcpIap } from './gcp-iap';
import { github } from './github';
import { gitlab } from './gitlab';
import { google } from './google';
import { microsoft } from './microsoft';
import { oauth2 } from './oauth2';
import { oauth2Proxy } from './oauth2-proxy';
import { oidc } from './oidc';
import { okta } from './okta';
import { onelogin } from './onelogin';
import { saml } from './saml';
import { bitbucketServer } from './bitbucketServer';
import { easyAuth } from './azure-easyauth';
import { AuthProviderFactory } from '@backstage/plugin-auth-node';

/**
 * All built-in auth provider integrations.
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const providers = Object.freeze({
  atlassian,
  auth0,
  awsAlb,
  bitbucket,
  bitbucketServer,
  cfAccess,
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
  easyAuth,
});

/**
 * All auth provider factories that are installed by default.
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const defaultAuthProviderFactories: {
  [providerId: string]: AuthProviderFactory;
} = {
  google: google.create(),
  github: github.create(),
  gitlab: gitlab.create(),
  saml: saml.create(),
  okta: okta.create(),
  auth0: auth0.create(),
  microsoft: microsoft.create(),
  easyAuth: easyAuth.create(),
  oauth2: oauth2.create(),
  oidc: oidc.create(),
  onelogin: onelogin.create(),
  awsalb: awsAlb.create(),
  bitbucket: bitbucket.create(),
  bitbucketServer: bitbucketServer.create(),
  atlassian: atlassian.create(),
};
