import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { wrapInThemedTestApp, Keyboard } from '../../testUtils';
import HeaderActionMenu from './HeaderActionMenu';

describe('<ComponentContextMenu />', () => {
  it('renders without any items and without exploding', () => {
    render(wrapInThemedTestApp(<HeaderActionMenu actionItems={[]} />));
  });

  it('can open the menu and click menu items', () => {
    const onClickFunction = jest.fn();
    const rendered = render(
      wrapInThemedTestApp(<HeaderActionMenu actionItems={[{ label: 'Some label', onClick: onClickFunction }]} />),
    );
    expect(rendered.queryByText('Some label')).not.toBeInTheDocument();
    expect(onClickFunction).not.toHaveBeenCalled();
    fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(onClickFunction).not.toHaveBeenCalled();
    expect(rendered.getByTestId('header-action-item')).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(rendered.queryByText('Some label'));
    expect(onClickFunction).toHaveBeenCalled();
    // We do not expect the dropdown to disappear after click
    expect(rendered.queryByText('Some label')).toBeInTheDocument();
  });

  it('Disabled', async () => {
    const rendered = render(
      wrapInThemedTestApp(<HeaderActionMenu actionItems={[{ label: 'Some label', disabled: true }]} />),
    );

    fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(rendered.getByTestId('header-action-item')).toHaveAttribute('aria-disabled', 'true');
  });

  it('Test wrapper, and secondary label', () => {
    const onClickFunction = jest.fn();
    const rendered = render(
      wrapInThemedTestApp(
        <HeaderActionMenu
          actionItems={[
            {
              label: 'Some label',
              secondaryLabel: 'Secondary label',
              WrapperComponent: ({ children }) => <button onClick={onClickFunction}>{children}</button>,
            },
          ]}
        />,
      ),
    );

    expect(onClickFunction).not.toHaveBeenCalled();
    fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(onClickFunction).not.toHaveBeenCalled();
    fireEvent.click(rendered.queryByText('Secondary label'));
    expect(onClickFunction).toHaveBeenCalled();
    // We do not expect the dropdown to disappear after click
    expect(rendered.queryByText('Some label')).toBeInTheDocument();
  });

  it('should close when hitting escape', async () => {
    const rendered = render(wrapInThemedTestApp(<HeaderActionMenu actionItems={[{ label: 'Some label' }]} />));

    expect(rendered.container.getAttribute('aria-hidden')).toBeNull();
    fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(rendered.container.getAttribute('aria-hidden')).toBe('true');
    await Keyboard.type(rendered, '<Esc>');
    expect(rendered.container.getAttribute('aria-hidden')).toBeNull();
  });
});
