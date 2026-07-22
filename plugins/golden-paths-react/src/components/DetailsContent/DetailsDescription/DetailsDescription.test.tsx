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
import userEvent from '@testing-library/user-event';

import { DetailsDescription } from './DetailsDescription';
import { useDescription } from './DetailsDescription.utils';

jest.mock('./DetailsDescription.utils.ts', () => ({
  useDescription: jest.fn(),
}));

describe('DetailsDescription', () => {
  afterEach(() => jest.clearAllMocks());

  it("should render 'No description' when there is no description provided", async () => {
    (useDescription as jest.Mock).mockReturnValue({});
    const { getByText } = await renderInTestApp(<DetailsDescription />);

    expect(getByText('No description.')).toBeInTheDocument();
  });

  it('should render a description, when it is provided', async () => {
    (useDescription as jest.Mock).mockReturnValue({ description: '123' });
    const { getByText } = await renderInTestApp(<DetailsDescription />);

    expect(getByText('123')).toBeInTheDocument();
  });

  it("should render a button 'Read more', when it should be visible", async () => {
    (useDescription as jest.Mock).mockReturnValue({
      description: '123',
      showButton: true,
    });
    const { getByText } = await renderInTestApp(<DetailsDescription />);

    expect(getByText('Read more')).toBeInTheDocument();
  });

  it("should call 'toggleOpen', when the button is clicked", async () => {
    (useDescription as jest.Mock).mockReturnValue({
      description: '123',
      showButton: true,
      toggleOpen: jest.fn(),
    });

    const user = userEvent.setup();
    const { getByText } = await renderInTestApp(<DetailsDescription />);

    const button = getByText('Read more');
    expect(button).toBeInTheDocument();

    expect(useDescription().toggleOpen).not.toHaveBeenCalled();
    await user.click(button);
    expect(useDescription().toggleOpen).toHaveBeenCalled();
  });

  it("should render a button 'Read less', when it should be visible and the text is expanded", async () => {
    (useDescription as jest.Mock).mockReturnValue({
      description: '123',
      showButton: true,
      open: true,
    });
    const { getByText } = await renderInTestApp(<DetailsDescription />);

    expect(getByText('Read less')).toBeInTheDocument();
  });
});
