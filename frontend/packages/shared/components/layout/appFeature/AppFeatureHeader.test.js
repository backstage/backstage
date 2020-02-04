import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp, ApolloMock } from 'testUtils';
import AppFeatureHeader from './AppFeatureHeader';

describe('<AppFeatureHeader />', () => {
  it('renders without exploding', () => {
    const data = {
      id: 'app-feature-id',
      componentType: 'app-feature',
      componentInfoLocationUri: 'ghe:/a/b/c.yaml',
      owner: {
        name: 'app-feature-owner',
        type: 'squad',
      },
      lifecycle: 'app-feature-lifecycle',
      codeCoverage: {},
    };
    const { getByText } = render(
      wrapInThemedTestApp(
        <ApolloMock>
          <AppFeatureHeader appFeature={data} />
        </ApolloMock>,
      ),
    );
    getByText('app-feature-id');
    getByText('app-feature-owner');
    getByText('app-feature-lifecycle');
  });

  it('renders coverage', () => {
    const data = {
      id: 'app-feature-id',
      componentType: 'app-feature',
      componentInfoLocationUri: 'ghe:/a/b/c.yaml',
      owner: {
        name: 'app-feature-owner',
        type: 'squad',
      },
      lifecycle: 'app-feature-lifecycle',
      codeCoverage: {
        line: { covered: 666, available: 1000 },
      },
    };
    const rendered = render(
      wrapInThemedTestApp(
        <ApolloMock>
          <AppFeatureHeader appFeature={data} />
        </ApolloMock>,
      ),
    );
    rendered.getByText('67%');
  });
});
