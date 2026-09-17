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

/**
 * The module `github` for the Backstage backend plugin "events-backend"
 * adding an event router and signature validator for GitHub.
 *
 * @packageDocumentation
 */

import { createBackendFeatureLoader } from '@backstage/backend-plugin-api';

export default createBackendFeatureLoader({
  loader() {
    return [
      import('./service/eventsModuleGithubEventRouter'),
      import('./service/eventsModuleGithubWebhook'),
    ];
  },
});

// TODO(freben): This is not exported at the moment since it depends on the octokit provider.
// Until we have made that a core thing in integrations, we can't export it
// export { createGithubSignatureValidator } from './http/createGithubSignatureValidator';

export { GithubEventRouter } from './router/GithubEventRouter';
