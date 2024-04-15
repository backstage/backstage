/*
 * Copyright 2023 The Backstage Authors
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
  createExtensionInput,
  createPageExtension,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { SearchResult } from '@backstage/plugin-search-common';
import { screen } from '@testing-library/react';
import React from 'react';
import {
  BaseSearchResultListItemProps,
  createSearchResultListItemExtension,
} from './alpha';

describe('createSearchResultListItemExtension', () => {
  it('Should use the correct result component', async () => {
    type TechDocsSearchResultListItemProps = BaseSearchResultListItemProps<{
      lineClamp: number;
    }>;
    const TechDocsSearchResultItemComponent = (
      props: TechDocsSearchResultListItemProps,
    ) => (
      <div>
        TechDocs - Rank: {props.rank} - Line clamp: {props.lineClamp}
      </div>
    );

    const TechDocsSearchResultItemExtension =
      createSearchResultListItemExtension({
        namespace: 'techdocs',
        configSchema: createSchemaFromZod(z =>
          z
            .object({
              noTrack: z.boolean().default(true),
              lineClamp: z.number().default(5),
            })
            .default({}),
        ),
        predicate: result => result.type === 'techdocs',
        component:
          async ({ config }) =>
          props => <TechDocsSearchResultItemComponent {...props} {...config} />,
      });

    const ExploreSearchResultItemComponent = (
      props: BaseSearchResultListItemProps,
    ) => <div>Explore - Rank: {props.rank}</div>;

    const ExploreSearchResultItemExtension =
      createSearchResultListItemExtension({
        namespace: 'explore',
        predicate: result => result.type === 'explore',
        component: async () => ExploreSearchResultItemComponent,
      });

    const SearchPageExtension = createPageExtension({
      namespace: 'search',
      defaultPath: '/',
      inputs: {
        items: createExtensionInput({
          item: createSearchResultListItemExtension.itemDataRef,
        }),
      },
      loader: async ({ inputs }) => {
        const results = [
          {
            type: 'techdocs',
            rank: 1,
            document: {
              title: 'Title1',
              text: 'Text1',
              location: '/location1',
            },
          },
          {
            type: 'explore',
            rank: 2,
            document: {
              title: 'Title2',
              text: 'Text2',
              location: '/location2',
            },
          },
          {
            type: 'other',
            rank: 3,
            document: {
              title: 'Title3',
              text: 'Text3',
              location: '/location3',
            },
          },
        ];

        const DefaultResultItem = (props: BaseSearchResultListItemProps) => (
          <div>Default - Rank: {props.rank}</div>
        );

        const getResultItemComponent = (result: SearchResult) => {
          const value = inputs.items.find(item =>
            item?.output.item.predicate?.(result),
          );
          return value?.output.item.component ?? DefaultResultItem;
        };

        const Component = () => {
          return (
            <div>
              <h1>Search Page</h1>
              <ul>
                {results.map((result, index) => {
                  const SearchResultListItem = getResultItemComponent(result);
                  return (
                    <SearchResultListItem
                      key={index}
                      rank={result.rank}
                      result={result.document}
                    />
                  );
                })}
              </ul>
            </div>
          );
        };

        return <Component />;
      },
    });

    createExtensionTester(SearchPageExtension)
      .add(TechDocsSearchResultItemExtension, {
        // TODO(Rugvip): We need to make the config input type available for use here
        config: {
          lineClamp: 3,
        } as any,
      })
      .add(ExploreSearchResultItemExtension)
      .render();

    expect(await screen.findByText(/Search Page/)).toBeInTheDocument();

    expect(
      await screen.findByText(/TechDocs - Rank: 1 - Line clamp: 3/, {
        exact: false,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/Explore - Rank: 2/, { exact: false }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/Default - Rank: 3/, { exact: false }),
    ).toBeInTheDocument();
  });
});
