import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import SupportButton from './SupportButton';
import { wrapInThemedTestApp, Keyboard } from '../../testUtils';

describe('<SupportButton />', () => {
  it('renders without exploding', () => {
    const rendered = render(<SupportButton />);
    rendered.getByText('Support');

    fireEvent.click(rendered.baseElement);
  });

  it('should show popover', () => {
    const rendered = render(
      wrapInThemedTestApp(<SupportButton email="a@b.com" plugin={{ stackoverflowTags: ['a-tag'] }} />),
    );

    expect(rendered.queryByText('Contact')).not.toBeInTheDocument();
    fireEvent.click(rendered.getByText('Support'));
    expect(rendered.queryByText('Contact')).toBeInTheDocument();
    rendered.getByText('a@b.com');
    rendered.getByText('a-tag');
  });

  it('should close popover when hitting escape', async () => {
    const rendered = render(wrapInThemedTestApp(<SupportButton email="a@b.com" />));

    fireEvent.click(rendered.getByText('Support'));
    expect(rendered.queryByText('Contact')).toBeInTheDocument();
    await Keyboard.type(rendered, '<Esc>');
    await waitForElement(() => !rendered.queryByText('Contact'));
    expect(rendered.queryByText('Contact')).not.toBeInTheDocument();
  });
});
