Welcome to the DX Prortal Gerrit plugin

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/gerrit](http://localhost:3000/gerrit).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Gerrit environment variables
### First set Gerrit token
Create a token for Gerrit at https://gerrit-review.gic.ericsson.se/settings/#HTTPCredentials 
Make this token available by setting the GERRIT_TOKEN environment variable
```
export GERRIT_TOKEN=<generated token>
```
### Set other Gerrit variables

```
export GERRIT_USER=$<xid username>
export GERRIT_CREDENTIAL=$(echo -n "${GERRIT_USER}:${GERRIT_TOKEN}" | base64)
export GERRIT_HOST=gerrit-review.gic.ericsson.se
export GERRIT_BASE_URL=https://${GERRIT_HOST}
```
