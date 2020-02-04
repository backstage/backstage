import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { createStore } from 'core/store';
import GlobalSnackbar from './GlobalSnackbar';
import { wrapInThemedTestApp } from 'testUtils';
import { snackbarOpenDefault, snackbarOpenSuccess, snackbarOpenError } from './actions';

describe('<GlobalSnackbar />', () => {
  let store = null;

  function renderSnackbar() {
    return render(wrapInThemedTestApp(<Provider store={store} children={<GlobalSnackbar />} />));
  }

  beforeEach(() => {
    store = createStore();
  });

  it('renders an empty snackbar', async () => {
    const rendered = renderSnackbar();

    expect(rendered.container.childElementCount).toBe(1);
    expect(rendered.container.children[0]).toBeEmpty();
  });

  it('opens the snackbar with a message', () => {
    const rendered = renderSnackbar();

    expect(rendered.queryByText('Hello!')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenDefault('Hello!'));
    rendered.getByText('Hello!');
  });

  it('opens the snackbar with a success message', () => {
    const rendered = renderSnackbar();

    expect(rendered.queryByText('Success!')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenSuccess('Success!'));
    rendered.getByText('Success!');
  });

  it('opens the snackbar with an error message', () => {
    const rendered = renderSnackbar();

    expect(rendered.queryByText('fail :(')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenError('fail :('));
    rendered.getByText('fail :(');
  });

  it('should close when clicking the close button', async () => {
    const rendered = renderSnackbar();

    expect(rendered.queryByText('Hello!')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenDefault('Hello!'));
    rendered.getByText('Hello!');
    fireEvent.click(rendered.getByLabelText('Close'));
    await waitForElementToBeRemoved(() => rendered.getByText('Hello!'));
  });

  it('open error log when clicking error message', async () => {
    const rendered = renderSnackbar();
    const error = new Error('fail :(');

    expect(store.getState().errorLog.open).toBe(false);

    expect(rendered.queryByText('fail :(')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenError(error.message, error, 'what terrible failure'));
    rendered.getByText('fail :(');

    // Only when opening error log, but we don't have a log here
    expect(rendered.queryByText('what terrible failure')).not.toBeInTheDocument();

    fireEvent.click(rendered.getByText('VIEW LOG'));

    await waitForElementToBeRemoved(() => rendered.getByText('fail :('));

    expect(store.getState().errorLog.open).toBe(true);
  });

  it('should not hide on clickaway', () => {
    const rendered = renderSnackbar();

    expect(rendered.queryByText('Success!')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenSuccess('Success!'));

    expect(store.getState().snackbar.open).toBe(true);
    fireEvent.click(rendered.container);
    expect(store.getState().snackbar.open).toBe(true);
  });

  it('should close after timeout if not error', async () => {
    const rendered = renderSnackbar();

    expect(rendered.queryByText('Success!')).not.toBeInTheDocument();
    store.dispatch(snackbarOpenSuccess('Success!', { duration: 50 }));

    expect(store.getState().snackbar.open).toBe(true);
    rendered.getByText('Success!');

    await waitForElementToBeRemoved(() => rendered.getByText('Success!'));
    expect(store.getState().snackbar.open).toBe(false);
  });
});
