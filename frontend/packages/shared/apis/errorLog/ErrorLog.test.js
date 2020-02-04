import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

import ErrorLog from './ErrorLog';
import { wrapInThemedTestApp } from 'testUtils';
import { createStore } from 'core/store';
import { errorLogAdd, errorLogOpen, errorLogClose, unselectError } from './actions';

describe('<ErrorLog />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<ErrorLog />));
    expect(rendered.queryByText('ERROR LOG')).not.toBeInTheDocument();
  });

  it('should open and close', () => {
    const store = createStore();
    const rendered = render(wrapInThemedTestApp(<Provider store={store} children={<ErrorLog />} />));

    expect(rendered.queryByText('ERROR LOG')).not.toBeInTheDocument();
    store.dispatch(errorLogOpen());
    rendered.getByText('ERROR LOG');
    rendered.getByText('All good');

    expect(rendered.getByTestId('error-log-modal').getAttribute('aria-hidden')).toBe(null);
    store.dispatch(errorLogClose());
    expect(rendered.getByTestId('error-log-modal').getAttribute('aria-hidden')).toBe('true');
  });

  it('should close on click', () => {
    const store = createStore();
    const rendered = render(wrapInThemedTestApp(<Provider store={store} children={<ErrorLog />} />));
    store.dispatch(errorLogOpen());

    expect(rendered.getByTestId('error-log-modal').getAttribute('aria-hidden')).toBe(null);
    fireEvent.click(rendered.getByLabelText('Close'));
    expect(rendered.getByTestId('error-log-modal').getAttribute('aria-hidden')).toBe('true');
  });

  it('should add an error to the log without opening', () => {
    const store = createStore();
    const rendered = render(wrapInThemedTestApp(<Provider store={store} children={<ErrorLog />} />));

    expect(rendered.queryByText('ERROR LOG')).not.toBeInTheDocument();
    store.dispatch(errorLogAdd('msg-a', 'err-b', 'err-id', 'long-msg'));
    expect(rendered.queryByText('ERROR LOG')).not.toBeInTheDocument();
    expect(rendered.queryByText('msg-a')).not.toBeInTheDocument();

    store.dispatch(errorLogOpen());
    rendered.getByText('ERROR LOG');
    rendered.getByText('msg-a');
    // only when selected
    expect(rendered.queryByText('long-msg')).not.toBeInTheDocument();
  });

  it('should open the details of an error when selecting it on open', () => {
    const store = createStore();
    const rendered = render(wrapInThemedTestApp(<Provider store={store} children={<ErrorLog />} />));

    store.dispatch(errorLogAdd('msg-a', 'err-b', 'err-id', 'long-msg'));
    store.dispatch(errorLogOpen('err-id'));

    rendered.getByText('ERROR LOG');
    rendered.getByText('msg-a');
    expect(hasCollapsedAncestor(rendered.getByText('long-msg'))).toBe(false);

    store.dispatch(unselectError());

    rendered.getByText('ERROR LOG');
    rendered.getByText('msg-a');
    expect(hasCollapsedAncestor(rendered.getByText('long-msg'))).toBe(true);
  });
});

function hasCollapsedAncestor(element) {
  if (!element || element === document.body) {
    return false;
  }
  const isCollapsed = window.getComputedStyle(element).height === '0px';
  return isCollapsed || hasCollapsedAncestor(element.parentElement);
}
