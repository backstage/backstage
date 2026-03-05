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

import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../components/ui/popover';
import { cn } from '../../lib/utils';
import { Link } from '../../components/Link';
import { Header } from '../Header';
import { Page } from '../Page';
import { Breadcrumbs } from './Breadcrumbs';

export default {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['!manifest'],
};

export const InHeader = () => (
  <MemoryRouter>
    <h2>Standard breadcrumbs</h2>
    <p className="mb-4">
      Underlined pages are links. This should show a hierarchical relationship.
    </p>

    <Page themeId="other">
      <Header title="Current Page" type="General Page" typeLink="/" />
    </Page>
  </MemoryRouter>
);

export const OutsideOfHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <MemoryRouter>
      <p className="mb-4">
        It might be the case that you want to keep your breadcrumbs outside of
        the header. In that case, they should be positioned above the title of
        the page.
      </p>

      <h2>Standard breadcrumbs</h2>
      <p className="mb-4">
        Underlined pages are links. This should show a hierarchical
        relationship.
      </p>

      <Breadcrumbs />

      <Breadcrumbs>
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <span>Current page</span>
      </Breadcrumbs>

      <h2>Hidden breadcrumbs</h2>
      <p className="mb-4">
        Use this when you have more than three breadcrumbs. When user clicks on
        ellipses, expand the breadcrumbs out.
      </p>

      <Breadcrumbs>
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Link to="/">Third Page</Link>
        <Link to="/">Fourth Page</Link>
        <span>Current page</span>
      </Breadcrumbs>

      <h2>Layered breadcrumbs</h2>
      <p className="mb-4">
        Use this when you want to show alternative breadcrumbs on the same
        hierarchical level.
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <Breadcrumbs>
          <Link to="/">General Page</Link>
          <PopoverTrigger asChild>
            <Link to="/" onClick={e => e.preventDefault()}>
              <span className="flex items-center">
                <span>Second Page</span>
                {open ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </Link>
          </PopoverTrigger>
          <span>Current page</span>
        </Breadcrumbs>
        <PopoverContent align="start" className="w-auto p-1">
          <div className="flex flex-col">
            <button
              className={cn(
                'px-4 py-2 text-left underline hover:bg-accent rounded-sm',
              )}
            >
              Parallel second page
            </button>
            <button
              className={cn(
                'px-4 py-2 text-left underline hover:bg-accent rounded-sm',
              )}
            >
              Another parallel second page
            </button>
            <button
              className={cn(
                'px-4 py-2 text-left underline hover:bg-accent rounded-sm',
              )}
            >
              Yet another, parallel second page
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </MemoryRouter>
  );
};
