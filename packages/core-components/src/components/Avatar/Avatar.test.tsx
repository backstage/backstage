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

import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('<Avatar />', () => {
  it('renders initials from displayName', () => {
    render(<Avatar displayName="John Doe" />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders an img element when picture is provided', () => {
    const { container } = render(
      <Avatar displayName="John Doe" picture="https://example.com/photo.jpg" />,
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders without crashing when no props are provided', () => {
    const { container } = render(<Avatar />);

    expect(container.firstChild).toBeTruthy();
  });

  it('provides alt text for accessibility when displayName is set', () => {
    const { container } = render(
      <Avatar displayName="John Doe" picture="https://example.com/photo.jpg" />,
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });
});
