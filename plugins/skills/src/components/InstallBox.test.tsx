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
import { fireEvent, screen } from '@testing-library/react';
import { InstallBox } from './InstallBox';

describe('InstallBox', () => {
  const writeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(globalThis.navigator, {
      clipboard: { writeText },
    });
  });

  it('copies the install command', async () => {
    writeText.mockResolvedValue(undefined);

    await renderInTestApp(
      <InstallBox
        description="Use the skills CLI to install skills"
        command="npx skills install http://localhost:7007/.well-known/skills"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith(
      'npx skills install http://localhost:7007/.well-known/skills',
    );
    expect(
      await screen.findByRole('button', { name: 'Copied' }),
    ).toBeInTheDocument();
  });
});
