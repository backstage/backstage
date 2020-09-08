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
  alertApiRef,
  errorApiRef,
  ErrorApiForwarder,
  AlertApi,
  createApiFactory,
  ErrorAlerter,
  AlertApiForwarder,
  oauthRequestApiRef,
  OAuthRequestManager,
  UrlPatternDiscovery,
  discoveryApiRef,
  GoogleAuth,
  googleAuthApiRef,
  GithubAuth,
  githubAuthApiRef,
  GitlabAuth,
  gitlabAuthApiRef,
  Auth0Auth,
  auth0AuthApiRef,
} from '@backstage/core';

// TODO(rugvip): We should likely figure out how to reuse all of these between apps
// and plugin serve with minimal boilerplate. For example we might move everything
// to DI, and provide factories for the default implementations, so this just becomes
// a list of things like `[ErrorApiForwarder.factory, AlertApiDialog.factory]`.

export const alertApiFactory = createApiFactory({
  implements: alertApiRef,
  deps: {},
  factory: (): AlertApi => new AlertApiForwarder(),
});

export const errorApiFactory = createApiFactory({
  implements: errorApiRef,
  deps: { alertApi: alertApiRef },
  factory: ({ alertApi }) =>
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
});

export const oauthRequestApiFactory = createApiFactory({
  implements: oauthRequestApiRef,
  deps: {},
  factory: () => new OAuthRequestManager(),
});

export const discoveryApiFactory = createApiFactory({
  implements: discoveryApiRef,
  deps: {},
  factory: () =>
    UrlPatternDiscovery.compile(`http://localhost:7000/{{ pluginId }}`),
});

export const googleAuthApiFactory = createApiFactory({
  implements: googleAuthApiRef,
  deps: { discoveryApi: discoveryApiRef, oauthRequestApi: oauthRequestApiRef },
  factory: ({ discoveryApi, oauthRequestApi }) =>
    GoogleAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
});

export const githubAuthApiFactory = createApiFactory({
  implements: githubAuthApiRef,
  deps: { discoveryApi: discoveryApiRef, oauthRequestApi: oauthRequestApiRef },
  factory: ({ discoveryApi, oauthRequestApi }) =>
    GithubAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
});

export const gitlabAuthApiFactory = createApiFactory({
  implements: gitlabAuthApiRef,
  deps: { discoveryApi: discoveryApiRef, oauthRequestApi: oauthRequestApiRef },
  factory: ({ discoveryApi, oauthRequestApi }) =>
    GitlabAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
});

export const auth0AuthApiFactory = createApiFactory({
  implements: auth0AuthApiRef,
  deps: { discoveryApi: discoveryApiRef, oauthRequestApi: oauthRequestApiRef },
  factory: ({ discoveryApi, oauthRequestApi }) =>
    Auth0Auth.create({
      discoveryApi,
      oauthRequestApi,
    }),
});
