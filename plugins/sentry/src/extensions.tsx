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

import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { sentryPlugin, rootRouteRef } from './plugin';
import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { Options } from '@material-table/core';

type SentryPageProps = {
  statsFor?: '24h' | '14d' | '';
  tableOptions?: Options<never>;
};

export const EntitySentryContent = sentryPlugin.provide(
  createRoutableExtension({
    name: 'EntitySentryContent',
    mountPoint: rootRouteRef,
    component: () =>
      import('./components/SentryIssuesWidget').then(
        ({ SentryIssuesWidget }) => {
          const SentryPage = ({ statsFor, tableOptions }: SentryPageProps) => {
            const { entity } = useEntity();
            const defaultOptions: Options<never> = {
              padding: 'dense',
              paging: true,
              search: false,
              pageSize: 5,
            };
            return (
              <SentryIssuesWidget
                entity={entity}
                statsFor={statsFor || '24h'}
                tableOptions={{ ...defaultOptions, ...tableOptions }}
              />
            );
          };
          return SentryPage;
        },
      ),
  }),
);

export const EntitySentryCard = sentryPlugin.provide(
  createComponentExtension({
    name: 'EntitySentryCard',
    component: {
      lazy: () =>
        import('./components/SentryIssuesWidget').then(
          ({ SentryIssuesWidget }) => {
            const SentryCard = ({
              statsFor,
              tableOptions,
            }: SentryPageProps) => {
              const { entity } = useEntity();
              return (
                <SentryIssuesWidget
                  entity={entity}
                  statsFor={statsFor || '24h'}
                  tableOptions={
                    tableOptions || {
                      padding: 'dense',
                      paging: true,
                      search: false,
                      pageSize: 5,
                    }
                  }
                />
              );
            };
            return SentryCard;
          },
        ),
    },
  }),
);
