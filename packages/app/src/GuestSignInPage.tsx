/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ProxiedSignInIdentity } from '../../core-components/src/layout/ProxiedSignInPage/ProxiedSignInIdentity';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GuestUserIdentity } from '../../core-components/src/layout/SignInPage/GuestUserIdentity';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { UserIdentity } from '../../core-components/src/layout/SignInPage/UserIdentity';
import {
  discoveryApiRef,
  githubAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

function SignInPage({
  onSignInSuccess,
}: {
  onSignInSuccess: (identityApi: any) => void;
}) {
  const discoveryApi = useApi(discoveryApiRef);
  const githubAuthApi = useApi(githubAuthApiRef);
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [signingIn, setSigningIn] = useState(false);

  const handleGuestSignIn = useCallback(() => {
    setSigningIn(true);
    setError(undefined);

    const identity = new ProxiedSignInIdentity({
      provider: 'guest',
      discoveryApi,
    });

    identity
      .start()
      .then(() => {
        onSignInSuccess(identity);
        navigate('/catalog');
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn(
          'Guest backend auth failed, falling back to legacy guest token:',
          err.message,
        );
        onSignInSuccess(new GuestUserIdentity());
        navigate('/catalog');
      });
  }, [discoveryApi, onSignInSuccess, navigate]);

  const handleGitHubSignIn = useCallback(async () => {
    setSigningIn(true);
    setError(undefined);

    try {
      const identityResponse = await githubAuthApi.getBackstageIdentity({
        instantPopup: true,
      });

      if (!identityResponse) {
        throw new Error('GitHub sign-in did not return an identity');
      }

      const profile = await githubAuthApi.getProfile();

      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          profile,
          authApi: githubAuthApi,
        }),
      );
      navigate('/catalog');
    } catch (err: any) {
      setSigningIn(false);
      setError(err.message || 'GitHub sign-in failed');
    }
  }, [githubAuthApi, onSignInSuccess, navigate]);

  /* GitHub mark as a data URI — renders at exactly 20×20, immune to CSS sizing bugs */
  const gitHubIcon = (
    <img
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E"
      alt=""
      width={20}
      height={20}
      style={{ display: 'block', flexShrink: 0 }}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '16px',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'var(--background, #09090b)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '380px',
          borderRadius: '16px',
          border: '1px solid var(--border, rgba(255,255,255,0.1))',
          background: 'var(--card, #111)',
          padding: '40px 32px 32px',
        }}
      >
        {/* Blitzy logo */}
        <svg
          width="120"
          height="45"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 151 57"
          fill="none"
          style={{ display: 'block', marginBottom: '12px' }}
        >
          <path
            d="M56.7604 13.175H68.4708C70.3297 13.175 71.9395 13.4744 73.2973 14.0703C74.6551 14.6691 75.6898 15.5141 76.4043 16.6051C77.1158 17.699 77.4745 18.9709 77.4745 20.4235C77.4745 21.8762 77.1691 23.0621 76.5584 24.1412C75.9477 25.2204 75.0939 26.0594 74.0029 26.6553C72.9089 27.2541 71.6638 27.5595 70.2674 27.5713L70.3089 26.7768C71.9246 26.8035 73.3477 27.1415 74.5751 27.7848C75.8024 28.4281 76.757 29.3146 77.4359 30.4411C78.1149 31.5677 78.4528 32.8455 78.4528 34.2685C78.4528 35.8991 78.0882 37.3221 77.3648 38.5436C76.6385 39.765 75.5979 40.7078 74.24 41.3748C72.8822 42.0389 71.2724 42.3739 69.4136 42.3739H56.7693V13.175H56.7604ZM60.8339 37.9981H68.0825C69.6834 37.9981 70.9048 37.6304 71.7468 36.8982C72.5887 36.1659 73.0097 35.0986 73.0097 33.7023C73.0097 32.386 72.6065 31.375 71.7972 30.6694C70.9878 29.9638 69.8316 29.611 68.3255 29.611H61.3201V25.2737H67.7356C69.1052 25.2737 70.1755 24.9209 70.9433 24.2154C71.7112 23.5098 72.0936 22.5047 72.0936 21.2003C72.0936 20.047 71.6993 19.1517 70.9137 18.5113C70.1251 17.8739 69.0815 17.5538 67.7771 17.5538H60.7716L62.076 16.7177V39.0564L60.8339 37.9981Z"
            fill="currentColor"
          />
          <path
            d="M80.3621 13.175H85.5354V42.3769H80.3621V13.175Z"
            fill="currentColor"
          />
          <path
            d="M88.2659 12.9911H93.8246V17.9599H88.2659V12.9911ZM88.4497 20.9957H93.623V42.3769H88.4497V20.9957Z"
            fill="currentColor"
          />
          <path
            d="M102.054 42.1426C101.091 41.7276 100.344 41.0665 99.8132 40.1563C99.2825 39.2462 99.0187 38.0514 99.0187 36.5721V24.9862H95.3544V20.9957H95.802C96.7122 20.9957 97.4533 20.8564 98.0314 20.5777C98.6096 20.299 99.0424 19.8484 99.3359 19.2229C99.6264 18.5973 99.8014 17.7702 99.8547 16.7385L99.9555 14.6395H104.171V21.4197L103.519 20.9928H108.835V24.9832H104.171V36.0206C104.171 36.9456 104.403 37.6008 104.865 37.9951C105.327 38.3894 105.986 38.5851 106.839 38.5851C107.424 38.5851 107.966 38.5228 108.47 38.4012V42.3709C108.034 42.4925 107.575 42.5874 107.086 42.6555C106.596 42.7237 106.08 42.7563 105.538 42.7563C104.18 42.7563 103.021 42.5488 102.054 42.1367V42.1426Z"
            fill="currentColor"
          />
          <path
            d="M110.954 38.3242L123.661 23.071V25.0455H110.934V20.9928H128.283V25.1047L115.312 40.4587V38.3005H128.65V42.3739H110.954V38.3212V38.3242Z"
            fill="currentColor"
          />
          <path
            d="M132.774 50.3785C132.264 50.3103 131.793 50.2095 131.36 50.0731V45.635C131.713 45.7714 132.081 45.8692 132.46 45.9315C132.84 45.9937 133.219 46.0234 133.601 46.0234C134.322 46.0234 134.941 45.887 135.463 45.6172C135.985 45.3445 136.45 44.9087 136.86 44.3039C137.266 43.6991 137.666 42.869 138.06 41.8106L138.487 44.295L129.875 20.9987H135.454L141.582 39.5901H139.504L145.104 20.9987H150.5L142.804 43.2959C142.235 44.9531 141.556 46.305 140.767 47.3575C139.978 48.4099 139.062 49.1926 138.019 49.7085C136.972 50.2243 135.766 50.4822 134.393 50.4822C133.824 50.4822 133.284 50.4467 132.774 50.3814V50.3785Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.7786 13.1196C13.0094 11.8889 15.0047 11.8889 16.2354 13.1196L29.1347 26.0189C29.7257 26.6099 30.0577 27.4115 30.0577 28.2473C30.0577 29.0831 29.7257 29.8847 29.1347 30.4757L16.2354 43.3749C15.0047 44.6056 13.0094 44.6056 11.7786 43.3749C10.5479 42.1442 10.5479 40.1488 11.7786 38.9181L22.4495 28.2473L11.7786 17.5765C10.5479 16.3457 10.5479 14.3504 11.7786 13.1196Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.5 11.574C0.5 5.18199 5.68199 0 12.074 0H26.0257C38.2344 0 44.3511 14.7641 35.7162 23.399L34.0945 25.0207C32.8638 26.2514 30.8684 26.2514 29.6377 25.0207C28.407 23.79 28.407 21.7946 29.6377 20.5639L31.2594 18.9422C35.9239 14.2777 32.6189 6.30287 26.0257 6.30287H12.074C9.16297 6.30287 6.80287 8.66297 6.80287 11.574V44.9176C6.80287 47.8286 9.16297 50.1887 12.074 50.1887H26.0257C32.621 50.1887 35.9246 42.2146 31.2594 37.5494L29.6377 35.9277C28.407 34.697 28.407 32.7016 29.6377 31.4709C30.8684 30.2402 32.8638 30.2402 34.0945 31.4709L35.7162 33.0926C44.3505 41.7269 38.2383 56.4916 26.0257 56.4916H12.074C5.68199 56.4916 0.5 51.3096 0.5 44.9176V11.574Z"
            fill="currentColor"
          />
        </svg>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--muted-foreground, #a1a1aa)',
            margin: '0 0 32px',
          }}
        >
          Sign in to Blitzy Sandbox
        </p>

        {/* Sign-in buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          {/* GitHub button — Blitzy primary style: pill, brand purple */}
          <button
            type="button"
            onClick={handleGitHubSignIn}
            disabled={signingIn}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              height: '44px',
              padding: '0 24px',
              borderRadius: '32px',
              border: 'none',
              background: '#5B39F3',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: signingIn ? 'not-allowed' : 'pointer',
              opacity: signingIn ? 0.6 : 1,
              transition: 'background 150ms, opacity 150ms',
            }}
            onMouseEnter={e => {
              if (!signingIn) e.currentTarget.style.background = '#4a2dd4';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#5B39F3';
            }}
          >
            {gitHubIcon}
            <span>
              {signingIn ? 'Signing in\u2026' : 'Continue with GitHub'}
            </span>
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '4px 0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--border, rgba(255,255,255,0.1))',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: 'var(--muted-foreground, #a1a1aa)',
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--border, rgba(255,255,255,0.1))',
              }}
            />
          </div>

          {/* Guest button — Blitzy secondary style: pill, outlined */}
          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={signingIn}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '44px',
              padding: '0 24px',
              borderRadius: '32px',
              border: '1px solid var(--border, rgba(255,255,255,0.15))',
              background: 'transparent',
              color: 'var(--muted-foreground, #a1a1aa)',
              fontSize: '15px',
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: signingIn ? 'not-allowed' : 'pointer',
              opacity: signingIn ? 0.6 : 1,
              transition: 'background 150ms, color 150ms, border-color 150ms',
            }}
            onMouseEnter={e => {
              if (!signingIn) {
                e.currentTarget.style.background =
                  'var(--accent, rgba(255,255,255,0.06))';
                e.currentTarget.style.color = 'var(--foreground, #fff)';
                e.currentTarget.style.borderColor =
                  'var(--foreground, rgba(255,255,255,0.3))';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--muted-foreground, #a1a1aa)';
              e.currentTarget.style.borderColor =
                'var(--border, rgba(255,255,255,0.15))';
            }}
          >
            Continue as Guest
          </button>
        </div>

        {error && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--destructive, #ef4444)',
              textAlign: 'center',
              marginTop: '16px',
            }}
          >
            {error}
          </p>
        )}

        <p
          style={{
            fontSize: '12px',
            color: 'var(--muted-foreground, #a1a1aa)',
            opacity: 0.5,
            textAlign: 'center',
            lineHeight: 1.6,
            marginTop: '24px',
          }}
        >
          Sign in with GitHub to track your identity.
          <br />
          Guest access is read-only.
        </p>
      </div>
    </div>
  );
}

export const guestSignInPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    SignInPageBlueprint.make({
      params: {
        loader: async () => props => <SignInPage {...props} />,
      },
    }),
  ],
});
