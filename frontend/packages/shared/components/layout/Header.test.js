import React from 'react';
import { render } from '@testing-library/react';
import { Header } from 'shared/components/layout';
import { wrapInThemedTestApp } from 'testUtils';

jest.mock('react-helmet', () => {
  return ({ defaultTitle }) => <div>defaultTitle: {defaultTitle}</div>;
});

describe('<Header/>', () => {
  it('should render with title', () => {
    const rendered = render(wrapInThemedTestApp(<Header title="Title" />));
    rendered.getByText('Title');
  });

  it('should set document title', () => {
    const rendered = render(wrapInThemedTestApp(<Header title="Title1" />));
    rendered.getByText('Title1');
    rendered.getByText('defaultTitle: Title1 | Backstage');
  });

  it('should override document title', () => {
    const rendered = render(wrapInThemedTestApp(<Header title="Title1" pageTitleOverride="Title2" />));
    rendered.getByText('Title1');
    rendered.getByText('defaultTitle: Title2 | Backstage');
  });

  it('should have subtitle', () => {
    const rendered = render(wrapInThemedTestApp(<Header title="Title" subtitle="Subtitle" />));
    rendered.getByText('Subtitle');
  });

  it('should have type rendered', () => {
    const rendered = render(wrapInThemedTestApp(<Header title="Title" type="service" />));
    rendered.getByText('service');
  });
});
