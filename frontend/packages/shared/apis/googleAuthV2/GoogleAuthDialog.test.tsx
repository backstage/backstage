import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import Observable from 'zen-observable';
import GoogleAuthDialog from './GoogleAuthDialog';
import GoogleScopes from './GoogleScopes';
import { GoogleSession } from './types';
import { PendingRequest } from '../oauth/OAuthPendingRequests';
import { BasicOAuthScopes } from '../oauth/BasicOAuthScopes';
import { OAuthScopes } from '../oauth/types';

const mockPending = {
  scopes: BasicOAuthScopes.from('a b'),
  resolve: jest.fn(),
  reject: jest.fn(),
};

const mockSession: GoogleSession = {
  scopes: GoogleScopes.from('profile'),
  idToken: 'i',
  accessToken: 'a',
  expiresAt: new Date(),
};

describe('GoogleAuthDialog', () => {
  it('should render without exploding', () => {
    const rendered = render(
      <GoogleAuthDialog scopesRequest$={new Observable(() => {})} onRequestConsent={jest.fn()} />,
    );
    expect(rendered).toBeDefined();
  });

  it('should trigger the popup flow', async () => {
    let subscriber: ZenObservable.SubscriptionObserver<PendingRequest<GoogleSession> | undefined>;
    const onRequestConsent: (scopes: OAuthScopes) => Promise<GoogleSession> = () => Promise.resolve(mockSession);
    const onRequestConsentSpy = jest.fn(onRequestConsent);
    const rendered = render(
      <GoogleAuthDialog
        scopesRequest$={
          new Observable(s => {
            subscriber = s;
          })
        }
        onRequestConsent={onRequestConsentSpy}
      />,
    );

    subscriber!.next(mockPending);
    await rendered.findByText('Google Auth Required');
    fireEvent.click(rendered.getByText('Continue'));
    subscriber!.next(undefined);
    await waitForElementToBeRemoved(() => rendered.getByText('Google Auth Required'));

    expect(onRequestConsentSpy).toHaveBeenCalledTimes(1);
    expect(onRequestConsentSpy.mock.calls[0]![0].toString()).toBe('a b');
    expect(mockPending.resolve).toHaveBeenCalledTimes(1);
  });

  it('should handle rejection', async () => {
    let subscriber: ZenObservable.SubscriptionObserver<PendingRequest<GoogleSession> | undefined>;
    const onRequestConsent = jest.fn();
    const rendered = render(
      <GoogleAuthDialog
        scopesRequest$={
          new Observable(s => {
            subscriber = s;
          })
        }
        onRequestConsent={onRequestConsent}
      />,
    );

    subscriber!.next(mockPending);
    await rendered.findByText('Google Auth Required');
    fireEvent.click(rendered.getByText('Reject'));

    expect(onRequestConsent).not.toHaveBeenCalled();
    expect(mockPending.reject).toHaveBeenCalledTimes(1);
    expect(mockPending.reject.mock.calls[0][0].name).toBe('PopupClosedError');
  });

  it('should show consent errors', async () => {
    let subscriber: ZenObservable.SubscriptionObserver<PendingRequest<GoogleSession> | undefined>;
    const onRequestConsent = jest.fn(() => Promise.reject(new Error('BOOM')));
    const rendered = render(
      <GoogleAuthDialog
        scopesRequest$={
          new Observable(s => {
            subscriber = s;
          })
        }
        onRequestConsent={onRequestConsent}
      />,
    );

    subscriber!.next(mockPending);
    await rendered.findByText('Google Auth Required');
    fireEvent.click(rendered.getByText('Continue'));
    await rendered.findByText('BOOM');

    expect(onRequestConsent).toHaveBeenCalledTimes(1);
  });
});
