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

import {
  createPlugin,
  createComponentExtension,
  createApiFactory,
  configApiRef,
} from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home';
import { StackOverflowQuestionsContentProps } from './types';
import { stackOverflowApiRef, StackOverflowClient } from './api';

/**
 * The Backstage plugin that holds stack overflow specific components
 *
 * @public
 */
export const stackOverflowPlugin = createPlugin({
  id: 'stack-overflow',
  apis: [
    createApiFactory({
      api: stackOverflowApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => StackOverflowClient.fromConfig(configApi),
    }),
  ],
});

/**
 * A component to display a stack overflow search result
 *
 * @public
 */
export const StackOverflowSearchResultListItem = stackOverflowPlugin.provide(
  createComponentExtension({
    name: 'StackOverflowResultListItem',
    component: {
      lazy: () =>
        import('./search/StackOverflowSearchResultListItem').then(
          m => m.StackOverflowSearchResultListItem,
        ),
    },
  }),
);

/**
 * A component to display a list of stack overflow questions on the homepage.
 *
 * @public
 */
export const HomePageStackOverflowQuestions = stackOverflowPlugin.provide(
  createCardExtension<StackOverflowQuestionsContentProps>({
    name: 'HomePageStackOverflowQuestions',
    title: 'Stack Overflow Questions',
    components: () => import('./home/StackOverflowQuestions'),
  }),
);
