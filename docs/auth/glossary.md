---
id: glossary
title: Glossary
description: All Glossaries related to auth
---

- **Popup** - A separate browser window opened on top of the previous one.
- **OAuth** - More specifically OAuth 2.0, a standard protocol for
  authorization. See [oauth.net/2/](https://oauth.net/2/).
- **OpenID Connect** - A layer on top of OAuth which standardises
  authentication. See
  [en.wikipedia.org/wiki/OpenID_Connect](https://en.wikipedia.org/wiki/OpenID_Connect).
- **JWT** - JSON Web Token, a popular JSON based token format that is commonly
  encrypted and/or signed, see
  [en.wikipedia.org/wiki/JSON_Web_Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
- **Scope** - A string that describes a certain type of access that can be
  granted to a user using OAuth.
- **Access token** - A token that gives access to perform actions on behalf of a
  user. It will commonly have a short expiry time, and be limited to a set of
  scopes. Part of the OAuth protocol.
- **ID token** - A JWT used to prove a user's identity, containing for example
  the user's email. Part of OpenID Connect.
- **Offline access** - OAuth flow that results in both a refresh and access
  token, where the refresh token has a long expiration or never expires, and can
  be used to request more access tokens in the future. This lets the user go
  "offline" with respect to the token issuer, but still be able to request more
  tokens at a later time without further direct interaction for the user.
- **Code grant** - OAuth flow where the client receives an authorization code
  that is passed to the backend to be exchanged for an access token and possibly
  refresh token.
