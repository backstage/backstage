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

import { screen } from '@testing-library/react';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { homePageWidgetDataRef } from '@backstage/plugin-home-react/alpha';
import homePlugin from './alpha';

describe('random-joke widget', () => {
  it('fetches from the baseUrl set in the extension config', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ setup: 'configured setup', punchline: 'punchline' }),
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );
    const widget = createExtensionTester(
      homePlugin.getExtension('home-page-widget:home/random-joke'),
      { config: { baseUrl: 'https://jokes.example' } },
    ).get(homePageWidgetDataRef);

    renderInTestApp(widget.component);

    expect(await screen.findByText('configured setup')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://jokes.example/jokes/programming/random',
      expect.anything(),
    );
    fetchMock.mockRestore();
  });
});
