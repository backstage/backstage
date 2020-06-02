# Auth Backend

WORK IN PROGRESS

This is the backend part of the auth plugin.

It responds to auth requests from the frontend, and fulfills them by delegating
to the appropriate provider in the backend.

## Requirements

Needs AUTH_GOOGLE_CLIENT_ID and AUTH_GOOGLE_CLIENT_SECRET set in the environment for the backend to startup

## Local development

export AUTH_GOOGLE_CLIENT_ID=<INSERT_CLIENT_ID_HERE>
read -r AUTH_GOOGLE_CLIENT_SECRET
<COPY_PASTE_CLIENT_SECRET_HERE>
export AUTH_GOOGLE_CLIENT_SECRET
run `yarn start` in packages/backend folder

### SAML

To try out SAML, you can use the mock identity provider:

```bash
./scripts/start-saml-idp.sh
```

## Links

- (The Backstage homepage)[https://backstage.io]
