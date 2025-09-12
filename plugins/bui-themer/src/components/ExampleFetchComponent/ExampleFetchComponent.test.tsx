/*
 * Copyright 2025 The Backstage Authors
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
import { ExampleFetchComponent } from './ExampleFetchComponent';

describe('ExampleFetchComponent', () => {
  it('renders the user table', async () => {
    const { getAllByText, getByAltText, getByText, findByRole } =
      await renderInTestApp(<ExampleFetchComponent />);

    // Wait for the table to render
    const table = await findByRole('table');
    const nationality = getAllByText('GB');
    // Assert that the table contains the expected user data
    expect(table).toBeInTheDocument();
    expect(getByAltText('Carolyn')).toBeInTheDocument();
    expect(getByText('Carolyn Moore')).toBeInTheDocument();
    expect(getByText('carolyn.moore@example.com')).toBeInTheDocument();
    expect(nationality[0]).toBeInTheDocument();
  });
});
