/*
 * Copyright 2026 The Backstage Authors
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

import { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Link } from '../../components/Link';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tabs, TabList, Tab } from '../../components/Tabs';
import { MenuTrigger, Menu, MenuItem } from '../../components/Menu';
import { TagGroup, Tag } from '../../components/TagGroup';
import { HeaderNav } from '../../components/Header/HeaderNav';
import {
  TableRoot,
  TableHeader,
  TableBody,
  Column,
  Row,
  CellText,
  type ColumnConfig,
} from '../../components/Table';

// eslint-disable-next-line no-script-url
const SCRIPT_HREF = 'javascript:alert(document.cookie)';

type Item = { id: string; name: string };

const columns: ColumnConfig<Item>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    cell: item => <CellText title={item.name} href={SCRIPT_HREF} />,
  },
];

function Harness({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/catalog']}>
      <BUIProvider>{children}</BUIProvider>
    </MemoryRouter>
  );
}

/**
 * `useDefinition` is the one place every BUI component's href is produced, and
 * making it safe there is what covers all of them at once. This is the test
 * that holds that claim to account: it renders every surface that accepts an
 * href and checks the rendered DOM, so a component that grows its own href
 * path around the hook fails here rather than shipping a link that runs script
 * when someone clicks it.
 */
describe('href safety across components', () => {
  it('renders no executable href for any component that takes one', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Harness>
        <Link href={SCRIPT_HREF}>A link</Link>
        <Card href={SCRIPT_HREF} label="A card">
          Card body
        </Card>
        <Tabs>
          <TabList>
            <Tab id="t1" href={SCRIPT_HREF}>
              A tab
            </Tab>
          </TabList>
        </Tabs>
        <TagGroup aria-label="Tags">
          <Tag href={SCRIPT_HREF}>A tag</Tag>
        </TagGroup>
        <HeaderNav
          tabs={[{ id: 'overview', label: 'Overview', href: SCRIPT_HREF }]}
          activeTabId={null}
        />
        <TableRoot aria-label="Rows">
          <TableHeader columns={columns}>
            {column => <Column id={column.id}>{column.label}</Column>}
          </TableHeader>
          <TableBody items={[{ id: 'a', name: 'Alpha' }]}>
            {item => (
              <Row id={String(item.id)} columns={columns} href={SCRIPT_HREF}>
                {column => column.cell(item as Item)}
              </Row>
            )}
          </TableBody>
        </TableRoot>
      </Harness>,
    );

    // Named one by one so the test cannot pass by rendering nothing at all.
    // Tab carries a role of its own rather than being exposed as a link.
    for (const [role, name] of [
      ['link', 'A link'],
      ['link', 'A card'],
      ['tab', 'A tab'],
      ['link', 'Overview'],
      ['link', 'Alpha'],
    ]) {
      expect(await screen.findByRole(role, { name })).toHaveAttribute(
        'href',
        'about:blank',
      );
    }

    // The menu is a modal portal, which marks everything else in the document
    // aria-hidden, so it needs a render of its own to stay queryable.
    render(
      <Harness>
        <MenuTrigger defaultOpen>
          <Button>Open menu</Button>
          <Menu>
            <MenuItem href={SCRIPT_HREF}>A menu item</MenuItem>
          </Menu>
        </MenuTrigger>
      </Harness>,
    );

    expect(
      await screen.findByRole('menuitem', { name: 'A menu item' }),
    ).toHaveAttribute('href', 'about:blank');

    // Tag and the table row itself hand their href to react-aria instead of
    // projecting it onto the DOM, so the sweep is what covers them: not one
    // executable URL anywhere in the markup, whichever element it landed on.
    const hrefs = Array.from(document.querySelectorAll('[href]')).map(el =>
      el.getAttribute('href'),
    );

    expect(new Set(hrefs)).toEqual(new Set(['about:blank']));
    expect(document.body.innerHTML).not.toContain('javascript:');
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it('leaves ordinary hrefs untouched, including the router basename', async () => {
    render(
      <MemoryRouter basename="/portal" initialEntries={['/portal/catalog']}>
        <BUIProvider>
          <Link href="https://example.com/docs">External</Link>
          <Link href="mailto:someone@example.com">Mail</Link>
          <Link href="//example.com/x">Protocol relative</Link>
          <Link href="/component/foo">Internal</Link>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('link', { name: 'External' }),
    ).toHaveAttribute('href', 'https://example.com/docs');
    expect(await screen.findByRole('link', { name: 'Mail' })).toHaveAttribute(
      'href',
      'mailto:someone@example.com',
    );
    expect(
      await screen.findByRole('link', { name: 'Protocol relative' }),
    ).toHaveAttribute('href', '//example.com/x');
    expect(
      await screen.findByRole('link', { name: 'Internal' }),
    ).toHaveAttribute('href', '/portal/component/foo');
  });
});
