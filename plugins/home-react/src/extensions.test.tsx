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

import { renderInTestApp } from '@backstage/test-utils';
import { render, screen } from '@testing-library/react';
import { CardExtension, type RendererProps } from './extensions';

describe('CardExtension', () => {
  it('renders a custom Renderer without requiring app context', () => {
    const Renderer = ({ title, Content }: RendererProps) => (
      <section>
        <h2>{title}</h2>
        <Content />
      </section>
    );

    // Intentionally render outside renderInTestApp / AppProvider — custom
    // Renderer widgets (e.g. module federation remotes) must not call useApp().
    render(
      <CardExtension
        title="Unread notifications"
        Renderer={Renderer}
        Content={() => <p>All caught up!</p>}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Unread notifications' }),
    ).toBeInTheDocument();
    expect(screen.getByText('All caught up!')).toBeInTheDocument();
  });

  it('renders the default InfoCard path when no Renderer is provided', async () => {
    await renderInTestApp(
      <CardExtension title="Default card" Content={() => <p>Card body</p>} />,
    );

    expect(screen.getByText('Default card')).toBeInTheDocument();
    expect(screen.getByText('Card body')).toBeInTheDocument();
  });
});
