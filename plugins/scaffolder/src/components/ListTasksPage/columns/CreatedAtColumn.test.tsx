/*
 * Copyright 2022 The Backstage Authors
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
import { CreatedAtColumn } from './CreatedAtColumn';
import { renderInTestApp } from '@backstage/test-utils';

describe('<CreatedAtColumn />', () => {
  const testDate = '2024-09-22T13:30:00Z';

  const mockNavigatorLanguage = (language: string) => {
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValue(language);
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the column using mocked locale (de-DE)', async () => {
    mockNavigatorLanguage('de-DE');
    const { getByText } = await renderInTestApp(
      <CreatedAtColumn createdAt={testDate} />,
    );
    expect(getByText('22.9.2024, 13:30:00')).toBeDefined();
  });

  it('should render the column with the default locale (en-US)', async () => {
    mockNavigatorLanguage('');
    const { getByText } = await renderInTestApp(
      <CreatedAtColumn createdAt={testDate} />,
    );
    expect(getByText('9/22/2024, 1:30:00 PM')).toBeDefined();
  });

  it('should render the column with a specified locale (fr-FR)', async () => {
    const { getByText } = await renderInTestApp(
      <CreatedAtColumn createdAt={testDate} locale="fr-FR" />,
    );
    expect(getByText('22/09/2024 13:30:00')).toBeDefined();
  });

  it('should render the column with a specified locale (en-DE)', async () => {
    const { getByText } = await renderInTestApp(
      <CreatedAtColumn createdAt={testDate} locale="en-DE" />,
    );
    expect(getByText('22/09/2024, 13:30:00')).toBeDefined();
  });
});
