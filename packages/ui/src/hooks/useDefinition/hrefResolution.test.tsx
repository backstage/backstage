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

import { type ComponentType, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  createPath,
  resolvePath,
} from 'react-router-dom';
import { BUIProvider, type BUIRouter } from '../../provider';
import { isExternalLink } from '../../utils/linkUtils';
import { Link } from '../../components/Link';
import { ButtonLink } from '../../components/ButtonLink';
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

const DEPLOY_BASENAME = '/portal';
const PAGE_PATH = '/pages/entity';

/**
 * Stands in for the resolver a host app hands to `BUIProvider`: it knows the
 * page an anchor is written in and applies the app's deploy basename, the same
 * contract as `useHref` from `@backstage/frontend-plugin-api`. Declared at
 * module scope so the reference never changes identity, exactly as the app
 * declares its own.
 */
function usePageScopedHref(target: string): string {
  if (isExternalLink(target)) {
    return target;
  }
  return `${DEPLOY_BASENAME}${createPath(resolvePath(target, PAGE_PATH))}`;
}

const scopedRouter: BUIRouter = {
  navigate: () => {},
  useHref: usePageScopedHref,
  useLocation: () => ({ pathname: PAGE_PATH, search: '', hash: '' }),
};

/**
 * Page chrome under the new frontend system: the host resolver is in charge,
 * and the react-router context around it is the app root projection rather than
 * the page — it matches no route, so a target react-router resolves here has
 * already lost the page, and it carries no basename of its own because the
 * host resolver is the one that applies it.
 */
function ScopedHarness({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={[PAGE_PATH]}>
      <BUIProvider router={scopedRouter}>{children}</BUIProvider>
    </MemoryRouter>
  );
}

/**
 * The old frontend system: no resolver is injected, so react-router is the only
 * authority and the page is a matched route.
 */
function LegacyHarness({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter
      basename={DEPLOY_BASENAME}
      initialEntries={[`${DEPLOY_BASENAME}${PAGE_PATH}`]}
    >
      <BUIProvider>
        <Routes>
          <Route path={PAGE_PATH} element={children} />
        </Routes>
      </BUIProvider>
    </MemoryRouter>
  );
}

type Item = { id: string; name: string };

function columnsFor(href: string): ColumnConfig<Item>[] {
  return [
    {
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} href={href} />,
    },
  ];
}

/**
 * Every surface that turns a target into an href, rendered rather than
 * reasoned about. A component that grows an href path of its own around
 * `useDefinition` fails here.
 */
function Surfaces({ href }: { href: string }) {
  const columns = columnsFor(href);
  return (
    <>
      <Link href={href}>A link</Link>
      <ButtonLink href={href}>A button link</ButtonLink>
      <Card href={href} label="A card">
        Card body
      </Card>
      <Tabs>
        <TabList>
          <Tab id="t1" href={href}>
            A tab
          </Tab>
        </TabList>
      </Tabs>
      <TagGroup aria-label="Tags">
        <Tag href={href}>A tag</Tag>
      </TagGroup>
      <HeaderNav
        tabs={[{ id: 'overview', label: 'Overview', href }]}
        activeTabId={null}
      />
      <TableRoot aria-label="Rows">
        <TableHeader columns={columns}>
          {column => <Column id={column.id}>{column.label}</Column>}
        </TableHeader>
        <TableBody items={[{ id: 'a', name: 'Alpha' }]}>
          {item => (
            <Row id={String(item.id)} columns={columns} href={href}>
              {column => column.cell(item as Item)}
            </Row>
          )}
        </TableBody>
      </TableRoot>
    </>
  );
}

async function expectEverySurfaceToRender(
  Harness: ComponentType<{ children: ReactNode }>,
  href: string,
  expected: string,
) {
  render(
    <Harness>
      <Surfaces href={href} />
    </Harness>,
  );

  // Named one by one so the test cannot pass by rendering nothing at all.
  for (const [role, name] of [
    ['link', 'A link'],
    ['link', 'A button link'],
    ['link', 'A card'],
    ['tab', 'A tab'],
    ['link', 'Overview'],
    ['link', 'Alpha'],
  ]) {
    expect(await screen.findByRole(role, { name })).toHaveAttribute(
      'href',
      expected,
    );
  }

  // Tag and the table row hand their href to react-aria rather than projecting
  // it onto the DOM, so they carry it as `data-href` instead.
  const syntheticHrefs = Array.from(
    document.querySelectorAll('[data-href]'),
  ).map(el => el.getAttribute('data-href'));

  expect(syntheticHrefs).toEqual([expected, expected]);

  // The menu is a modal portal, which marks everything else in the document
  // aria-hidden, so it needs a render of its own to stay queryable.
  render(
    <Harness>
      <MenuTrigger defaultOpen>
        <Button>Open menu</Button>
        <Menu>
          <MenuItem href={href}>A menu item</MenuItem>
        </Menu>
      </MenuTrigger>
    </Harness>,
  );

  expect(
    await screen.findByRole('menuitem', { name: 'A menu item' }),
  ).toHaveAttribute('href', expected);
}

/**
 * A target is resolved by exactly one authority. When the host app injects a
 * resolver into `BUIProvider`, that resolver sees the target as it was written
 * — react-router must not have resolved it first, because at page-chrome scope
 * react-router's context is the app root and resolving there turns a target
 * written inside a page into one pointing at the app root.
 */
describe('href resolution across components', () => {
  describe('with an injected href resolver', () => {
    it.each`
      description        | href                          | expected
      ${'fragment only'} | ${'#tab'}                     | ${'/portal/pages/entity#tab'}
      ${'query only'}    | ${'?tab=x'}                   | ${'/portal/pages/entity?tab=x'}
      ${'relative'}      | ${'widgets'}                  | ${'/portal/pages/entity/widgets'}
      ${'app absolute'}  | ${'/settings'}                | ${'/portal/settings'}
      ${'external'}      | ${'https://example.com/docs'} | ${'https://example.com/docs'}
    `(
      'resolves a $description target through the injected resolver alone',
      async ({ href, expected }: { href: string; expected: string }) => {
        await expectEverySurfaceToRender(ScopedHarness, href, expected);
      },
    );

    // Handing resolution over does not hand the safety guard over with it: a
    // target a browser would execute is made inert before anything else looks
    // at it, so the resolver is never even offered one.
    it('makes an executable target inert before the resolver sees it', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const targets: string[] = [];
      const useRecordingHref = (target: string) => {
        targets.push(target);
        return usePageScopedHref(target);
      };

      render(
        <MemoryRouter initialEntries={[PAGE_PATH]}>
          <BUIProvider router={{ ...scopedRouter, useHref: useRecordingHref }}>
            {/* eslint-disable-next-line no-script-url */}
            <Surfaces href="javascript:alert(document.cookie)" />
          </BUIProvider>
        </MemoryRouter>,
      );

      expect(
        await screen.findByRole('link', { name: 'A link' }),
      ).toHaveAttribute('href', 'about:blank');
      expect(targets).toContain('about:blank');
      expect(targets.filter(target => /javascript/i.test(target))).toEqual([]);
      expect(document.body.innerHTML).not.toContain('javascript:');
      expect(warn).toHaveBeenCalled();

      warn.mockRestore();
    });
  });

  describe('without an injected href resolver', () => {
    it.each`
      description        | href                          | expected
      ${'fragment only'} | ${'#tab'}                     | ${'/portal/pages/entity#tab'}
      ${'query only'}    | ${'?tab=x'}                   | ${'/portal/pages/entity?tab=x'}
      ${'relative'}      | ${'widgets'}                  | ${'/portal/pages/entity/widgets'}
      ${'app absolute'}  | ${'/settings'}                | ${'/portal/settings'}
      ${'external'}      | ${'https://example.com/docs'} | ${'https://example.com/docs'}
    `(
      'leaves react-router the sole authority for a $description target',
      async ({ href, expected }: { href: string; expected: string }) => {
        await expectEverySurfaceToRender(LegacyHarness, href, expected);
      },
    );
  });
});
