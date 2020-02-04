import { render } from '@testing-library/react';
import Error from './Error';
import React from 'react';

describe('<Error/>', () => {
  it('error with mapping', () => {
    const { getByText, getByAltText } = render(
      <Error error="GetUserGroups short-circuited and fallback failed" skipTestEnvOutput />,
    );
    expect(
      getByText(
        'The Backstage backend is updating its cache and should be back online for you within a couple of minutes',
      ),
    );
    expect(getByAltText('Aw snap'));
  });

  it('error without mapping', () => {
    const { getByText, getByAltText } = render(<Error error="Anything else" skipTestEnvOutput />);
    expect(getByText('Anything else'));
    expect(getByAltText('Aw snap'));
  });

  it('undefined error', () => {
    const { getByText, getByAltText } = render(<Error skipTestEnvOutput />);
    expect(getByText('Something went wrong!'));
    expect(getByAltText('Aw snap'));
  });

  /**
   * When running tests, sometimes the ErrorBoundary can get triggered.
   *
   * When this happens, it just says an error occurred and to check the console. Instead, when
   * running tests we want Error.js to just dump the error directly into the DOM. This makes
   * things much easier to debug.
   */
  it('outputs the actual JSON error during tests', () => {
    const { getByText } = render(<Error error="Some testing environment error. EXPECTED BEHAVIOR" />);
    expect(getByText('Some testing environment error. EXPECTED BEHAVIOR')).toBeTruthy();
  });
});
