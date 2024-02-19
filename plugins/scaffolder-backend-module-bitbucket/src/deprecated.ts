/*
 * Copyright 2024 The Backstage Authors
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
import * as bitbucketCloud from '@backstage/plugin-scaffolder-backend-module-bitbucket-cloud';
import * as bitbucketServer from '@backstage/plugin-scaffolder-backend-module-bitbucket-server';

export { createPublishBitbucketAction } from './actions/bitbucket';

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-cloud instead
 */
export const createPublishBitbucketCloudAction =
  bitbucketCloud.createPublishBitbucketCloudAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-cloud instead
 */
export const createBitbucketPipelinesRunAction =
  bitbucketCloud.createBitbucketPipelinesRunAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-server instead
 */
export const createPublishBitbucketServerAction =
  bitbucketServer.createPublishBitbucketServerAction;

/**
 * @public @deprecated use import from \@backstage/plugin-scaffolder-backend-module-bitbucket-server instead
 */
export const createPublishBitbucketServerPullRequestAction =
  bitbucketServer.createPublishBitbucketServerPullRequestAction;
