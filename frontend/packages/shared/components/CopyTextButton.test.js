import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import CopyTextButton from 'shared/components/CopyTextButton';

const props = {
  text: 'mockText',
  tooltipDelay: 2,
  tooltipText: 'mockTooltip',
};

describe('<CopyTextButton />', () => {
  it('renders without exploding', () => {
    const { getByDisplayValue } = render(wrapInThemedTestApp(<CopyTextButton {...props} />));
    getByDisplayValue('mockText');
  });

  it('displays tooltip on click', () => {
    const spy = jest.fn();
    Object.defineProperty(document, 'execCommand', { value: spy });
    const rendered = render(wrapInThemedTestApp(<CopyTextButton {...props} />));
    const button = rendered.getByTitle('mockTooltip');
    button.click();
    expect(spy).toHaveBeenCalled();
    rendered.getByText('mockTooltip');
  });
});
