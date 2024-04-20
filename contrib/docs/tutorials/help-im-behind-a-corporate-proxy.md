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

1. Go to the entry file for the backend (typically `packages/backend/src/index.ts`), and add the following at the top:

````ts
import 'global-agent/bootstrap';
import { setGlobalDispatcher, ProxyAgent } from 'undici';

/**
 * Checks if a given URL matches the list of domain wildcards and specific domains.
 *
 * @param {string} origin - The URL to check for exclusion.
 * @param {string[]} domainList - An array of domain wildcards and specific domains to exclude.
 * @returns {boolean} - Returns true if the URL matches the list, false otherwise.
 *
 * @example
 * ```typescript
 * const domainList = ['localhost', '127.0.0.1', '*.my-corp.com'];
 * const origin = 'https://github.my-corp.com';
 *
 * const matched = isDomainMatch(origin, list);
 * console.log(matched); // Output: true
 * ```
 */
function isDomainMatch(origin: string, domainList: string[]): boolean {
  if (!origin) return false;
  const hostname = new URL(origin).hostname;

  for (const entry of domainList) {
    if (entry.startsWith('*')) {
      const domain = entry.slice(1);
      if (hostname.endsWith(domain)) {
        return true;
      }
    } else {
      if (hostname === entry) {
        return true;
      }
    }
  }

  return false;
}

/** Set up global network proxy */
function setGlobalNetworkProxy() {
  const proxyEnv =
    process.env.GLOBAL_AGENT_HTTP_PROXY || process.env.GLOBAL_AGENT_HTTPS_PROXY;

  if (proxyEnv) {
    const proxyUrl = new URL(proxyEnv);

    // Collect the list of domains that we should not use a proxy for
    const noProxyList =
      (process.env.GLOBAL_AGENT_NO_PROXY &&
        process.env.GLOBAL_AGENT_NO_PROXY.split(',')) ||
      [];

    // Create a default agent that will be used for no_proxy origins
    const defaultAgent = new Agent();

    // Create an interceptor that will use the appropriate agent
    // based on the origin and the no_proxy environment variable.
    const noProxyInterceptor = (
      dispatch: Dispatcher['dispatch'],
    ): Dispatcher['dispatch'] => {
      return (opts, handler) =>
        isDomainMatch(opts.origin?.toString() || '', noProxyList)
          ? defaultAgent.dispatch(opts, handler)
          : dispatch(opts, handler);
    };

    // Create a proxy agent that will send all requests through
    // the configured proxy, unless the noProxyInterceptor bypasses it.
    setGlobalDispatcher(
      new ProxyAgent({
        uri: proxyUrl.protocol + proxyUrl.host,
        token:
          proxyUrl.username && proxyUrl.password
            ? `Basic ${Buffer.from(
                `${proxyUrl.username}:${proxyUrl.password}`,
              ).toString('base64')}`
            : undefined,
      }).compose(noProxyInterceptor),
    );
  }
}

setGlobalNetworkProxy();
````

The first import automatically bootstraps `global-agent`, which addresses `node-fetch` proxying. The lines of code below that peeks into the same environment variables as `global-agent` uses, and also leverages them to set up the `undici` package which affects native `fetch`. Does that seem weird? Yes, we think so too. But in the current state of the Node.js ecosystem, that's how it works.

`GLOBAL_AGENT_NO_PROXY` environment variable is parsed for the comma-separated list of domains and domain wildcards which should bypass the proxy.

See [the `global-agent` docs](https://github.com/gajus/global-agent) for information about its configuration options.

1. Start the backend with the correct environment variables set. For example:

   ```sh
   export GLOBAL_AGENT_HTTP_PROXY=http://username:password@proxy.example.net:8888
   # Skip proxy for these hosts/domains
   export GLOBAL_AGENT_NO_PROXY=localhost,127.0.0.1,*.my-corp.com
   yarn start
   ```

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
