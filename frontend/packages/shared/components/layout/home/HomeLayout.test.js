import React from 'react';
import { buildComponentInApp } from 'testUtils';
import HomeLayout from './HomeLayout';

describe('<HomeLayout />', () => {
  it('renders without exploding', () => {
    const rendered = buildComponentInApp(() => <HomeLayout children={'Hello world'} />)
      .withApolloLoading()
      .withTheme()
      .render();
    rendered.getByText('Hello world');
  });
});
