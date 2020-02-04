import React from 'react';
import { render } from '@testing-library/react';
import { Documentation } from 'shared/components/layout';

describe('<Documentation />', () => {
  it('renders without exploding', () => {
    const rendered = render(<Documentation />);
    rendered.getByText('Documentation');
  });

  it('renders a single text child', () => {
    const rendered = render(<Documentation>a</Documentation>);
    rendered.getByText('a');
  });

  it('renders a single element child', () => {
    const rendered = render(
      <Documentation>
        <div>a</div>
      </Documentation>,
    );
    rendered.getByText('a');
  });

  it('renders multiple children', () => {
    const rendered = render(
      <Documentation>
        <div>a</div>
        <div>b</div>
      </Documentation>,
    );
    rendered.getByText('a');
    rendered.getByText('b');
  });

  it('renders a mix of children', () => {
    const rendered = render(
      <Documentation>
        a<div>b</div>c
      </Documentation>,
    );
    rendered.getByText('a');
    rendered.getByText('b');
    rendered.getByText('c');
  });
});
