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

import { screen, fireEvent, act } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { LinkButton } from './LinkButton';
import { Route, Routes } from 'react-router-dom';

describe('<LinkButton />', () => {
  it('navigates using react-router', async () => {
    const testString = 'This is test string';
    const linkButtonLabel = 'Navigate!';
    await renderInTestApp(
      <>
        <LinkButton to="/test">{linkButtonLabel}</LinkButton>
        <Routes>
          <Route path="/test" element={<p>{testString}</p>} />
        </Routes>
      </>,
    );

    expect(() => screen.getByText(testString)).toThrow();
    await act(async () => {
      fireEvent.click(screen.getByText(linkButtonLabel));
    });
    expect(screen.getByText(testString)).toBeInTheDocument();
  });
});
