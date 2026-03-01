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

import { LinkButton } from '@backstage/core-components';
import { FileSearch, Users } from 'lucide-react';
import { MemoryRouter } from 'react-router-dom';
import { DefaultResultListItem } from './DefaultResultListItem';

export default {
  title: 'Plugins/Search/DefaultResultListItem',
  component: DefaultResultListItem,
  decorators: [
    (Story: () => JSX.Element) => (
      <MemoryRouter>
        <div className="grid grid-cols-1 gap-4 w-full">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  tags: ['!manifest'],
};

const mockSearchResult = {
  location: 'search/search-result',
  title: 'Search Result 1',
  text: 'some text from the search result',
  owner: 'some-example-owner',
};

export const Default = () => {
  return <DefaultResultListItem result={mockSearchResult} />;
};

export const WithIcon = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      icon={<FileSearch className="text-primary" />}
    />
  );
};

export const WithSecondaryAction = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      secondaryAction={
        <LinkButton
          to="#"
          size="sm"
          aria-label="owner"
          variant="ghost"
          style={{ textTransform: 'lowercase' }}
        >
          <Users className="mr-1 h-4 w-4" />
          {mockSearchResult.owner}
        </LinkButton>
      }
    />
  );
};
export const WithHighlightedResults = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      highlight={{
        preTag: '<tag>',
        postTag: '</tag>',
        fields: { text: 'some <tag>text</tag> from the search result' },
      }}
    />
  );
};

export const WithCustomHighlightedResults = () => {
  return (
    <div className="[&_mark]:text-inherit [&_mark]:bg-inherit [&_mark]:font-bold [&_mark]:underline">
      <DefaultResultListItem
        result={mockSearchResult}
        highlight={{
          preTag: '<tag>',
          postTag: '</tag>',
          fields: { text: 'some <tag>text</tag> from the search result' },
        }}
      />
    </div>
  );
};
