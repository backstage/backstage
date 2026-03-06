# Running the backend behind a Corporate Proxy

This article helps you get your backend installation up and running making calls through corporate proxies.

## Background

Let's admit it, we've all been there. Sometimes you have to run stuff with no way out to the public internet, except via the smallest of corporate proxy tunnels. It's most likely that you're going to run into these issues from the backend part of Backstage as that's the part that isn't helped by your browser or OS settings for the corporate proxy.

## Using Node.js built-in proxy support (recommended)

Starting with Node.js 22.21.0 and 24.5.0, Node.js has built-in support for proxy environment variables. When enabled, native `fetch()`, `node:http`, and `node:https` all respect the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables without any additional packages. See the [Node.js enterprise network configuration docs](https://nodejs.org/en/learn/http/enterprise-network-configuration#proxy-configuration) for full details.

This also covers libraries built on top of these modules. Both `node-fetch` and `cross-fetch` (used by many Backstage plugins and [community plugins](https://github.com/backstage/community-plugins/)) work with the built-in proxy support, as long as the calling code does not override the HTTP agent. See [Compatibility with third-party fetch libraries](#compatibility-with-third-party-fetch-libraries) for details.

To enable the built-in proxy support, set the `NODE_USE_ENV_PROXY` environment variable along with your proxy settings:

```sh
export HTTP_PROXY=http://username:password@proxy.example.net:8888
export HTTPS_PROXY=http://username:password@proxy.example.net:8888
export NO_PROXY=localhost,127.0.0.1,.internal.company.com
export NODE_USE_ENV_PROXY=1
yarn start
```

No code changes or extra dependencies are needed.

### Compatibility with third-party fetch libraries

Per [ADR014](https://backstage.io/docs/architecture-decisions/adrs-adr014), Backstage backend code should use native `fetch()`, which works with `NODE_USE_ENV_PROXY` out of the box.

Some core packages and many [community plugins](https://github.com/backstage/community-plugins/) still use `node-fetch` (see [ADR013](https://backstage.io/docs/architecture-decisions/adrs-adr013)) or `cross-fetch` (for isomorphic packages). Both libraries delegate to `node:http`/`node:https` internally and do **not** set a custom HTTP agent by default, which means `NODE_USE_ENV_PROXY` works for them as well.

The exception is code that explicitly passes a custom `agent` to its fetch calls (e.g. the Kubernetes plugins, which use `new https.Agent(...)` for TLS client certificates). In those cases, the custom agent takes precedence and the built-in proxy is bypassed. This is generally the desired behavior, since those agents are configured for direct connections to specific endpoints like cluster APIs.

## Legacy approach using `undici` and `global-agent`

If you are on a Node.js version older than 22.21.0, neither native `fetch` nor `node-fetch` respect `HTTP(S)_PROXY` environment variables by default. You can work around this using the `undici` and `global-agent` packages.

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

### Alternatives to `global-agent`

The `proxy-agent` package can be used as an alternative to `global-agent` (do not install both!), and also ensures that the `node-fetch` library correctly respects proxy settings, but [does NOT work](https://github.com/TooTallNate/proxy-agents/issues/239) for modern `undici` based native Node.js `fetch`, so you'll still have to also do the `undici` steps in the section above in addition to this.

`proxy-agent` is a library that you can use to override the `globalAgents` of `node` land with a tunnel to use for each request.

1. Install `proxy-agent` using `yarn add proxy-agent`
2. Go to the entry file for the backend (`src/index.ts`)
3. At the top of the file paste the following:

   ```ts
   import ProxyAgent from 'proxy-agent';
   import http from 'http';
   import https from 'https';

   if (process.env.HTTP_PROXY) {
     http.globalAgent = new ProxyAgent(process.env.HTTP_PROXY);
   }

   if (process.env.HTTPS_PROXY) {
     https.globalAgent = new ProxyAgent(process.env.HTTPS_PROXY);
   }
   ```

4. Start the backend with `yarn start`

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

## Backstage CLI

The Backstage CLI [versions:bump](https://backstage.io/docs/tooling/cli/commands#versionsbump) command also supports proxies via `global-agent` environment variable configuration. See the [keeping Backstage updated](https://backstage.io/docs/getting-started/keeping-backstage-updated/#proxy) docs for more information.
