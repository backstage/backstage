import { fireEvent } from '@testing-library/react';
import OAuthGheSignInRequestPage from './OAuthGheSignInRequestPage';
import { buildComponentInApp } from 'testUtils';
import { validateLoginState } from './gheAuth';

describe('<OAuthGheSignInRequestPage />', () => {
  it('should render and initiate login', () => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http', host: 'localhost' },
      writable: true,
    });

    const rendered = buildComponentInApp(OAuthGheSignInRequestPage)
      .withTheme()
      .render({ targetUrl: '/here' });

    fireEvent.click(rendered.getByText('Sign in'));
    const [, state] = window.location.match(/&state=(.*?)&/);
    expect(validateLoginState(state)).toBe('/here');
  });
});
