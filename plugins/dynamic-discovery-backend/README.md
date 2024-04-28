# dynamic-discovery

**NOTE** This is a highly experimental plugin and should not be used in production. If you do not use an mTLS service-to-service proxy, the use of this plugin may result in attackers registering pods into your Backstage instance.

## Getting started

To start development, you'll want to run both the `backend-next-split-leaf` and `backend-next-split-gateway` projects at the same time. I use different terminals for both. The leaf project has some additional required config.
