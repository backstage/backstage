# OpenIdConnectApi

The OpenIdConnectApi type is defined at
[packages/core-api/src/apis/definitions/auth.ts:104](https://github.com/spotify/backstage/blob/53a229ea7576b1432835e54e41e0b9526038afa4/packages/core-api/src/apis/definitions/auth.ts#L104).

The following Utility APIs implement this type:

- [googleAuthApiRef](./README.md#googleauth)

- [oauth2ApiRef](./README.md#oauth2)

- [oktaAuthApiRef](./README.md#oktaauth)

## Members

### getIdToken()

Requests an OpenID Connect ID Token.

This method is cheap and should be called each time an ID token is used. Do not
for example store the id token in React component state, as that could cause the
token to expire. Instead fetch a new id token for each request.

If the user has not yet logged in to Google inside Backstage, the user will be
prompted to log in. The returned promise will not resolve until the user has
successfully logged in. The returned promise can be rejected, but only if the
user rejects the login request.

<pre>
getIdToken(options?: <a href="#authrequestoptions">AuthRequestOptions</a>): Promise&lt;string&gt;
</pre>

### logout()

Log out the user's session. This will reload the page.

<pre>
logout(): Promise&lt;void&gt;
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AuthRequestOptions

<pre>
export type AuthRequestOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty response will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in, or if you don't
   * want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * If this is set to true, the request will bypass the regular oauth login modal
   * and open the login popup directly.
   *
   * The method must be called synchronously from a user action for this to work in all browsers.
   *
   * @default false
   */
  instantPopup?: boolean;
}
</pre>

Defined at
[packages/core-api/src/apis/definitions/auth.ts:40](https://github.com/spotify/backstage/blob/53a229ea7576b1432835e54e41e0b9526038afa4/packages/core-api/src/apis/definitions/auth.ts#L40).

Referenced by: [getIdToken](#getidtoken).
