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

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from './Link';

// eslint-disable-next-line no-script-url
const SCRIPT_HREF = 'javascript:alert(document.cookie)';
// Browsers strip the leading tab and run this exactly like the one above.
const DISGUISED_SCRIPT_HREF = '\tjavascript:alert(document.cookie)';

describe('Link', () => {
  it('renders an inert href for executable schemes, inside and outside a router', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Link href={SCRIPT_HREF}>Routed</Link>
        <Link href={DISGUISED_SCRIPT_HREF}>Disguised</Link>
      </MemoryRouter>,
    );
    // BUI is a standalone design system, so it has to hold up with no router
    // at all — that path skips react-router's resolution entirely.
    render(<Link href={SCRIPT_HREF}>Bare</Link>);

    for (const name of ['Routed', 'Disguised', 'Bare']) {
      const link = await screen.findByRole('link', { name });
      expect(link).toHaveAttribute('href', 'about:blank');
    }

    // Nothing executable may survive anywhere in the rendered markup, not just
    // in the attribute we happened to assert on.
    expect(document.body.innerHTML).not.toContain('javascript:');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
