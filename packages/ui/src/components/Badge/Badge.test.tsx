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
import { BUIProvider } from '../../provider';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders neutral by default and sets a data attribute for the status', () => {
    const { rerender } = render(
      <BUIProvider>
        <Badge icon={<svg data-icon="custom" />}>Banana</Badge>
      </BUIProvider>,
    );

    const badge = screen.getByText('Banana');
    expect(badge).toHaveClass('bui-Badge');
    expect(badge).not.toHaveAttribute('data-status');
    expect(badge).not.toHaveAttribute('data-ispending');
    expect(badge.querySelector('[data-icon="custom"]')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    rerender(
      <BUIProvider>
        <Badge status="success">Banana</Badge>
      </BUIProvider>,
    );
    expect(screen.getByText('Banana')).toHaveAttribute(
      'data-status',
      'success',
    );
  });

  it('shows the status icon unless a custom icon is given or icons are disabled', () => {
    const { rerender } = render(
      <BUIProvider>
        <Badge status="success">Banana</Badge>
      </BUIProvider>,
    );

    const badge = screen.getByText('Banana');
    expect(badge.querySelector('.bui-BadgeIcon svg')).toBeInTheDocument();

    rerender(
      <BUIProvider>
        <Badge status="success" icon={<svg data-icon="custom" />}>
          Banana
        </Badge>
      </BUIProvider>,
    );
    expect(badge.querySelectorAll('.bui-BadgeIcon svg')).toHaveLength(1);
    expect(badge.querySelector('[data-icon="custom"]')).toBeInTheDocument();

    rerender(
      <BUIProvider>
        <Badge status="success" icon={false}>
          Banana
        </Badge>
      </BUIProvider>,
    );
    expect(badge.querySelector('.bui-BadgeIcon')).not.toBeInTheDocument();

    rerender(
      <BUIProvider>
        <Badge>Banana</Badge>
      </BUIProvider>,
    );
    expect(badge.querySelector('.bui-BadgeIcon')).not.toBeInTheDocument();
  });

  it('shows a loading indicator after the text while pending', () => {
    render(
      <BUIProvider>
        <Badge status="info" isPending icon={<svg data-icon="custom" />}>
          Deploying
        </Badge>
      </BUIProvider>,
    );

    const badge = screen.getByText('Deploying');
    expect(badge).toHaveAttribute('data-ispending', 'true');
    expect(badge).toHaveAttribute('data-status', 'info');
    expect(badge.querySelector('[data-icon="custom"]')).toBeInTheDocument();
    const spinner = screen.getByRole('progressbar', { name: 'Loading' });
    expect(spinner).toBeInTheDocument();
    expect(badge.lastElementChild).toContainElement(spinner);
  });
});
