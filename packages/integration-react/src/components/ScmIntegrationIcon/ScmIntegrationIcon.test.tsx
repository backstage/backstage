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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { ScmIntegrationIcon } from './ScmIntegrationIcon';

describe('<ScmIntegrationIcon />', () => {
  it('renders the registered system icon', async () => {
    await renderInTestApp(<ScmIntegrationIcon type="custom" />, {
      icons: {
        custom: () => <svg role="img" aria-label="Custom integration" />,
      },
    });
    expect(
      screen.getByRole('img', { name: 'Custom integration' }),
    ).toBeInTheDocument();
  });

  it.each(['unknown', undefined])(
    'renders a decorative fallback for type %s',
    async type => {
      const { container } = await renderInTestApp(
        <ScmIntegrationIcon type={type} />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('remixicon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('focusable', 'false');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
    },
  );
});
