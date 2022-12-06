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

import { render } from '@testing-library/react';
import React from 'react';
import { Avatar } from './Avatar';
import { stringToColor } from './utils';

describe('<Avatar />', () => {
  it('renders without exploding', async () => {
    const { getByText } = render(<Avatar displayName="John Doe" />);

    expect(getByText('JD')).toBeInTheDocument();
  });

  it('generates a background color', async () => {
    const bgcolor = stringToColor('John Doe');
    const { getByText } = render(<Avatar displayName="John Doe" />);
    expect(getByText('JD').parentElement).toHaveStyle(
      `background-color: ${bgcolor}`,
    );
  });

  it('does not generate a background color when a picture is given', async () => {
    const bgcolor = stringToColor('John Doe');
    const { getByAltText } = render(
      <Avatar
        displayName="John Doe"
        picture="https://backstage.io/test/john-doe.png"
      />,
    );

    expect(getByAltText('John Doe')).not.toHaveStyle(
      `background-color: ${bgcolor}`,
    );
  });
});
