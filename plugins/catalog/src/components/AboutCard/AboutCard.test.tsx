/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import { render } from '@testing-library/react';
import { AboutCard } from './AboutCard';

describe('<AboutCard />', () => {
  it('renders info and "view source" link', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/managed-by-location':
            'github:https://github.com/spotify/backstage/blob/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText } = render(<AboutCard entity={entity} />);
    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/spotify/backstage/blob/master/software.yaml',
    );
  });
});
