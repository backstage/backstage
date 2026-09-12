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
import { BUIProvider } from '../../provider';
import { Card } from './Card';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

function renderCard() {
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
                <Card href="overview" label="Entity overview">
                  <div>Card content</div>
                </Card>
                <LocationStatus />
              </>
            }
          />
        </Routes>
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('Card navigation', () => {
  it('delegates an ordinary surface click to its relative real anchor', () => {
    renderCard();

    expect(
      screen.getByRole('link', { name: 'Entity overview' }),
    ).toHaveAttribute('href', '/app/catalog/entity/overview');
    fireEvent.click(screen.getByText('Card content'));
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/overview',
    );
  });

  it('preserves modifier keys when delegating surface clicks', () => {
    renderCard();
    const anchor = screen.getByRole('link', { name: 'Entity overview' });
    const content = screen.getByText('Card content');
    const received: MouseEvent[] = [];
    anchor.addEventListener('click', event => received.push(event));

    fireEvent.click(content, { metaKey: true });
    expect(received.at(-1)?.metaKey).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/entity');

    fireEvent.click(content, { ctrlKey: true });
    expect(received.at(-1)?.ctrlKey).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/entity');

    fireEvent.click(content, { shiftKey: true });
    expect(received.at(-1)?.shiftKey).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/entity');

    fireEvent.click(content, { altKey: true });
    expect(received.at(-1)?.altKey).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/entity');
  });
});
