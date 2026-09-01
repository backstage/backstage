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

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BUIProvider } from '../../../provider';
import { CellProfile } from './CellProfile';
import { CellText } from './CellText';
import { Column } from './Column';
import { Row } from './Row';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { TableRoot } from './TableRoot';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

function renderCell(cell: React.ReactElement) {
  return render(
    <MemoryRouter
      basename="/app"
      initialEntries={['/app/catalog/entity']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <BUIProvider>
        <Routes>
          <Route
            path="catalog/entity/*"
            element={
              <>
                <TableRoot aria-label="Entities">
                  <TableHeader>
                    <Column isRowHeader>Name</Column>
                  </TableHeader>
                  <TableBody>
                    <Row id="entity">{cell}</Row>
                  </TableBody>
                </TableRoot>
                <LocationStatus />
              </>
            }
          />
        </Routes>
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('table cell navigation', () => {
  it('preserves the native title of a linked CellText', () => {
    renderCell(<CellText title="TechDocs" href="docs" />);

    expect(screen.getByRole('link', { name: 'TechDocs' })).toHaveAttribute(
      'title',
      'TechDocs',
    );
  });

  it.each([
    ['CellText', <CellText title="TechDocs" href="docs" />, 'TechDocs', 'docs'],
    [
      'CellProfile',
      <CellProfile name="Ada Lovelace" href="owner" />,
      'Ada Lovelace',
      'owner',
    ],
  ] as const)(
    'routes a relative %s link through the host router',
    (_name, cell, linkName, destination) => {
      renderCell(cell);

      const link = screen.getByRole('link', { name: linkName });
      expect(link).toHaveAttribute(
        'href',
        `/app/catalog/entity/${destination}`,
      );
      fireEvent.click(link);
      expect(screen.getByRole('status')).toHaveTextContent(
        `/catalog/entity/${destination}`,
      );
    },
  );
});
