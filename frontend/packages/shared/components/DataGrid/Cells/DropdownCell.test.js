import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import DropdownCell from './DropdownCell';
import { wrapInTestApp } from 'testUtils';
import { snackbarOpenSuccess } from 'shared/apis/snackbar/actions';

jest.mock('shared/apis/snackbar/actions');

describe('<DropdownCell />', () => {
  it('renders the title', () => {
    const { getByText } = render(<DropdownCell title="title" />);
    expect(getByText('title')).toBeInTheDocument();
  });

  it('is disabled if no value is passed down', () => {
    const { getByTestId } = render(<DropdownCell />);
    expect(getByTestId('datagrid-dropdown-btn')).toHaveAttribute('disabled');
  });

  it('renders the content from value when open', () => {
    const { queryByText, getByText } = render(
      <DropdownCell
        title="open"
        value={[
          <DropdownCell.Action key="a">a</DropdownCell.Action>,
          <DropdownCell.Action key="b">b</DropdownCell.Action>,
        ]}
      />,
    );
    expect(queryByText('a')).not.toBeInTheDocument();
    expect(queryByText('b')).not.toBeInTheDocument();
    fireEvent.click(getByText('open'));
    expect(getByText('a')).toBeInTheDocument();
    expect(getByText('b')).toBeInTheDocument();
  });
});

describe('<DropdownCell.ConfirmAction />', () => {
  const action = jest.fn();
  const close = jest.fn();

  afterEach(() => {
    action.mockClear();
    close.mockClear();
    snackbarOpenSuccess.mockClear();
  });

  it('renders the content', () => {
    const { getByText } = render(wrapInTestApp(<DropdownCell.ConfirmAction>Hello</DropdownCell.ConfirmAction>));
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('opens a ConfirmPrompt with passed down values if clicked', () => {
    const { getByText } = render(
      wrapInTestApp(
        <DropdownCell.ConfirmAction promptTitle="Prompt" promptText="Content" confirmText="Confirm">
          Open
        </DropdownCell.ConfirmAction>,
      ),
    );
    fireEvent.click(getByText('Open'));
    expect(getByText('Prompt')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();
  });

  it('calls action and close on confirmation', async () => {
    const { getByText, getByTestId } = render(
      wrapInTestApp(
        <DropdownCell.ConfirmAction action={action} close={close} successMessage="Success">
          Action
        </DropdownCell.ConfirmAction>,
      ),
    );
    fireEvent.click(getByText('Action'));
    fireEvent.click(getByTestId('prompt-confirm'));
    await wait(() => expect(action).toHaveBeenCalled());
    expect(close).toHaveBeenCalled();
    expect(snackbarOpenSuccess).toHaveBeenCalledWith('Success');
  });

  it('propagates errors to the ConfirmPrompt', async () => {
    action.mockImplementationOnce(() => Promise.reject());
    const { getByText, getByTestId } = render(
      wrapInTestApp(
        <DropdownCell.ConfirmAction action={action} failureMessage="Failed">
          Action
        </DropdownCell.ConfirmAction>,
      ),
    );
    fireEvent.click(getByText('Action'));
    fireEvent.click(getByTestId('prompt-confirm'));
    await wait(() => expect(action).toHaveBeenCalled());
    expect(getByText('Failed')).toBeInTheDocument();
  });

  it('does not call close if keepOpen is true', async () => {
    const { getByText, getByTestId } = render(
      wrapInTestApp(
        <DropdownCell.ConfirmAction keepOpen action={action} close={close}>
          Action
        </DropdownCell.ConfirmAction>,
      ),
    );
    fireEvent.click(getByText('Action'));
    fireEvent.click(getByTestId('prompt-confirm'));
    await wait(() => expect(action).toHaveBeenCalled());
    expect(close).not.toHaveBeenCalled();
  });
});

describe('<DropdownCell.Action />', () => {
  const action = jest.fn();
  const close = jest.fn();

  afterEach(() => {
    action.mockClear();
    close.mockClear();
  });

  it('renders the content', () => {
    const { getByText } = render(<DropdownCell.Action>Hello</DropdownCell.Action>);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('performs action on click and closes the menu', async () => {
    const { getByText } = render(
      <DropdownCell.Action action={action} close={close}>
        Action
      </DropdownCell.Action>,
    );
    fireEvent.click(getByText('Action'));
    await wait(() => expect(action).toHaveBeenCalled());
    expect(close).toHaveBeenCalled();
  });

  it('does not call close if keepOpen is true', async () => {
    const { getByText } = render(
      <DropdownCell.Action keepOpen action={action} close={close}>
        Action
      </DropdownCell.Action>,
    );
    fireEvent.click(getByText('Action'));
    await wait(() => expect(action).toHaveBeenCalled());
    expect(close).not.toHaveBeenCalled();
  });
});

describe('<DropdownCell.Link />', () => {
  it('renders the content', () => {
    const { getByText } = render(wrapInTestApp(<DropdownCell.Link>Link</DropdownCell.Link>));
    expect(getByText('Link')).toBeInTheDocument();
  });
});
