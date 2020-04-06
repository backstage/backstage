# @backstage/plugin-lighthouse

A frontend for [lighthouse-audit-service](https://github.com/spotify/lighthouse-audit-service), this plugin allows you to trigger Lighthouse audits on websites and track them over time.

## Getting Started

### Use cases

Google's [Lighthouse](https://developers.google.com/web/tools/lighthouse) auditing tool for websites
is a great open-source resource forbenchmarking and improving the accessibility, performance, SEO, and best practices of your site.
At Spotify, we keep track of Lighthouse audit scores over time to look at trends and overall areas for investment.

This plugin allows you to generate on-demand Lighthouse audits for websites, and to track the trends for the
top-level categories of Lighthouse at a glance.

In the future, we hope to add support for scheduling audits (which we do internally), as well as allowing
custom runs of Lighthouse to be ingested (for auditing sites that require authentication or some session state).

### Installation

To get started, you will need a running instance of [lighthouse-audit-service](https://github.com/spotify/lighthouse-audit-service).
_It's likely you will need to enable CORS when running lighthouse-audit-service. Initialize the app
with the environment variable `LAS_CORS` set to `true`._

When you have an instance running that Backstage can hook into, make sure to export the plugin in
your app's [`plugins.ts`](https://github.com/spotify/backstage/blob/master/packages/app/src/plugins.ts)
to enable the plugin:

```js
export { default as LighthousePlugin } from '@backstage/plugin-lighthouse';
```

Then, you need to use the `lighthouseApiRef` exported from the plugin to initialize the Rest API in
your [`apis.ts`](https://github.com/spotify/backstage/blob/master/packages/app/src/apis.ts).

```js
import { ApiHolder, ApiRegistry } from '@backstage/core';
import {
  lighthouseApiRef,
  LighthouseRestApi,
} from '@backstage/lighthouse-audits';

const builder = ApiRegistry.builder();

export const lighthouseApi =
  new LighthouseRestApi(/* your service url here! */);
builder.add(lighthouseApiRef, lighthouseApi);

export default builder.build() as ApiHolder;
```
