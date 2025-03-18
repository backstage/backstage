# Running the backend behind a Corporate Proxy

This article helps you get your backend installation up and running making calls through corporate proxies.

## Background

Let's admit it, we've all been there. Sometimes you have to run stuff with no way out to the public internet, except via the smallest of corporate proxy tunnels. It's most likely that you're going to run into these issues from the backend part of Backstage as that's the part that isn't helped by your browser or OS settings for the corporate proxy.

Unfortunately, neither the Node.js native `fetch` nor the other frequently used library `node-fetch` (see [ADR013](https://backstage.io/docs/architecture-decisions/adrs-adr013)) respect `HTTP(S)_PROXY` environment variables by default. As an additional complication, there is no single solution for configuring both native `fetch` and `node-fetch` at once, uniformly.

There are however some ways to get this to work without too much effort.

## Installation

**Note:** You're going to want to be in your backend working directory for these solutions as that's where the requests come from that don't go through this proxy.

1. Install the required packages in your backend, by running the following command inside your backend directory (typically `packages/backend` under your repository root).

   ```bash
   yarn add undici global-agent
   ```

   `undici` exposes the settings for native `fetch`, and `global-agent` can set things up for `node-fetch`.

1. Go to the entry file for the backend (typically `packages/backend/src/index.ts`), and add the following at the VERY top, before all other imports etc:

   ```ts
   import 'global-agent/bootstrap';
   import { setGlobalDispatcher, EnvHttpProxyAgent } from 'undici';

   setGlobalDispatcher(new EnvHttpProxyAgent());
   ```

   The first import automatically bootstraps `global-agent`, which addresses `node-fetch` proxying. The lines below that set up the `undici` package which affects native `fetch`.

1. Start the backend with the correct environment variables set. For example:

   ```sh
   export HTTP_PROXY=http://username:password@proxy.example.net:8888
   export GLOBAL_AGENT_HTTP_PROXY=${HTTP_PROXY}
   yarn start
   ```

   The default for `global-agent` is to have a prefix on the variable names, hence the need for specifying it twice. For further information about `HTTP(S)_PROXY` and `NO_PROXY` excludes, see [the global-agent documentation](https://github.com/gajus/global-agent) and [undici documentation](https://github.com/nodejs/undici).

## Configuration

If your development environment is in the cloud (like with [AWS Cloud9](https://aws.amazon.com/cloud9/) or an instance of [Theia](https://theia-ide.org/)), you will need to update your configuration.

You will probably need to make some changes in `app-config.yaml` (or another config file like `app-config.local.yaml` if you've created it, see the [configuration doc](https://backstage.io/docs/conf/#supplying-configuration)).
The exact values will depend on your setup but for instance, if your public URL is `https://your-public-url.com` and the port `3000` and `8080` are open:

```yaml
app:
  baseUrl: https://your-public-url.com:3000
  listen:
    host: 0.0.0.0 # This makes the dev server bind to all IPv4 interfaces and not just the baseUrl hostname

backend:
  baseUrl: https://your-public-url.com:8080
  listen:
    port: 8080
  cors:
    origin: https://your-public-url.com:3000
```

The app port must proxy web socket connections in order to make hot reloading work.

## Alternatives to `global-agent`

The `proxy-agent` package can be used as an alternative to `global-agent` (do not install both!), and also ensures that the `node-fetch` library correctly respects proxy settings, but [does NOT work](https://github.com/TooTallNate/proxy-agents/issues/239) for modern `undici` based native Node.js `fetch`, so you'll still have to also do the `undici` steps in the section above in addition to this.

`proxy-agent` is a library that you can use to override the `globalAgents` of `node` land with a tunnel to use for each request.

1. Install `proxy-agent` using `yarn add proxy-agent`
2. Go to the entry file for the backend (`src/index.ts`)
3. At the top of the file paste the following:

   ```ts
   import ProxyAgent from 'proxy-agent';
   import http from 'http';
   import https from 'https';

   /*
     Something to note here, this might need different configuration depending on your own setup.
     If you only have an http_proxy then you'll need to set that as both the http and https globalAgent instead.
   */
   if (process.env.HTTP_PROXY) {
     http.globalAgent = new ProxyAgent(process.env.HTTP_PROXY);
   }

   if (process.env.HTTPS_PROXY) {
     https.globalAgent = new ProxyAgent(process.env.HTTPS_PROXY);
   }
   ```

4. Start the backend with `yarn start`

## Backstage CLI

The Backstage CLI [versions:bump](https://backstage.io/docs/tooling/cli/commands#versionsbump) command also supports proxies via `global-agent` environment variable configuration. See the [keeping Backstage updated](https://backstage.io/docs/getting-started/keeping-backstage-updated/#proxy) docs for more information.
