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

import { MemoryRouter } from 'react-router-dom';
import { LinkButton } from '../../components/LinkButton/LinkButton';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { ItemCardGrid } from './ItemCardGrid';
import { ItemCardHeader } from './ItemCardHeader';

export default {
  title: 'Layout/Item Cards',
  tags: ['!manifest'],
};

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const Default = () => (
  <MemoryRouter>
    <p className="mb-4">
      The most basic setup is to place a bunch of cards into a large grid,
      leaving styling to the defaults. Try to resize the window to see how they
      rearrange themselves to fit the viewport.
    </p>
    <ItemCardGrid>
      {[...Array(10).keys()].map(index => (
        <Card key={index}>
          <ItemCardHeader title={`Card #${index}`} subtitle="Subtitle" />
          <CardContent>
            {text
              .split(' ')
              .slice(0, 5 + Math.floor(Math.random() * 30))
              .join(' ')}
          </CardContent>
          <CardFooter>
            <LinkButton color="primary" to="/catalog">
              Go There!
            </LinkButton>
          </CardFooter>
        </Card>
      ))}
    </ItemCardGrid>
  </MemoryRouter>
);

export const Styling = () => (
  <MemoryRouter>
    <p className="mb-4">
      Both the grid and the header can be styled, using the{' '}
      <span className="text-xs font-mono">classes</span> property. This lets you
      for example tweak the column sizes and the background of the header.
    </p>
    <ItemCardGrid classes={{ root: 'grid-cols-[repeat(auto-fill,12em)]' }}>
      {[...Array(10).keys()].map(index => (
        <Card key={index}>
          <ItemCardHeader
            title={`Card #${index}`}
            subtitle="Subtitle"
            classes={{
              root: 'text-black bg-gradient-to-br from-red-500 to-yellow-500',
            }}
          />
          <CardContent>
            {text
              .split(' ')
              .slice(0, 5 + Math.floor(Math.random() * 30))
              .join(' ')}
          </CardContent>
          <CardFooter>
            <LinkButton color="primary" to="/catalog">
              Go There!
            </LinkButton>
          </CardFooter>
        </Card>
      ))}
    </ItemCardGrid>
  </MemoryRouter>
);
