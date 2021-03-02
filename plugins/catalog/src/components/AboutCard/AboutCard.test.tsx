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

import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  SOURCE_LOCATION_ANNOTATION,
  EDIT_URL_ANNOTATION,
} from '@backstage/catalog-model';
import { render, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { AboutCard } from './AboutCard';

describe('<AboutCard /> GitHub', () => {
  it('renders info and "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/managed-by-location':
            'github:https://github.com/backstage/backstage/blob/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText, getByTitle } = render(
      <EntityProvider entity={entity}>
        <AboutCard />
      </EntityProvider>,
    );
    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/blob/master/software.yaml',
    );

    const editButton = getByTitle('Edit Metadata');
    window.open = jest.fn();
    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(window.open).toHaveBeenCalledWith(
      `https://github.com/backstage/backstage/edit/master/software.yaml`,
      '_blank',
    );
  });
});

describe('<AboutCard /> GitLab', () => {
  it('renders info and "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/managed-by-location':
            'gitlab:https://gitlab.com/backstage/backstage/-/blob/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText, getByTitle } = render(
      <EntityProvider entity={entity}>
        <AboutCard />
      </EntityProvider>,
    );

    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://gitlab.com/backstage/backstage/-/blob/master/software.yaml',
    );

    const editButton = getByTitle('Edit Metadata');
    window.open = jest.fn();
    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(window.open).toHaveBeenCalledWith(
      `https://gitlab.com/backstage/backstage/-/edit/master/software.yaml`,
      '_blank',
    );
  });
});

describe('<AboutCard /> BitBucket', () => {
  it('renders info and "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/managed-by-location':
            'bitbucket:https://bitbucket.org/backstage/backstage/src/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText, getByTitle } = render(
      <EntityProvider entity={entity}>
        <AboutCard />
      </EntityProvider>,
    );
    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://bitbucket.org/backstage/backstage/src/master/software.yaml',
    );

    const editButton = getByTitle('Edit Metadata');
    window.open = jest.fn();
    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(window.open).toHaveBeenCalledWith(
      `https://bitbucket.org/backstage/backstage/src/master/software.yaml?mode=edit&spa=0&at=master`,
      '_blank',
    );
  });
});

describe('<AboutCard /> custom links', () => {
  it('renders info and "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/managed-by-location':
            'bitbucket:https://bitbucket.org/backstage/backstage/src/master/software.yaml',
          [EDIT_URL_ANNOTATION]: 'https://another.place',
          [SOURCE_LOCATION_ANNOTATION]:
            'url:https://another.place/backstage.git',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText, getByTitle } = render(
      <EntityProvider entity={entity}>
        <AboutCard />
      </EntityProvider>,
    );
    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://another.place/backstage.git',
    );

    const editButton = getByTitle('Edit Metadata');
    window.open = jest.fn();
    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(window.open).toHaveBeenCalledWith(`https://another.place`, '_blank');
  });
});
