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

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  graphqlVoyagerPlugin,
  graphQlVoyagerApiRef,
  GraphQLVoyagerEndpoints,
  GraphqlVoyagerPage,
} from '../src';

createDevApp()
  .registerPlugin(graphqlVoyagerPlugin)
  .registerApi({
    api: graphQlVoyagerApiRef,
    deps: {},
    factory() {
      return GraphQLVoyagerEndpoints.from([
        {
          id: 'graphql-voyager-endpoint-id',
          title: 'Countries',
          introspectionErrorMessage:
            'Unable to perform introspection, make sure you are on the correct environment.',
          introspection: async query => {
            const res = await fetch('https://countries.trevorblades.com', {
              method: 'POST',
              body: JSON.stringify({ query }),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            return res.json();
          },
          voyagerProps: {
            hideDocs: true,
          },
        },
      ]);
    },
  })
  .addPage({
    title: 'GQL Voyager',
    element: <GraphqlVoyagerPage />,
  })
  .render();
