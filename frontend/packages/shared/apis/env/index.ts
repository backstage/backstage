import Api from 'shared/pluginApi/Api';

/** The different types of hosting environment. */
export type HostingEnv = 'development' | 'test' | 'staging' | 'production';

/** Decides whether the given input is a valid HostingEnv. */
export function isHostingEnv(s: any): s is HostingEnv {
  return ['development', 'test', 'staging', 'production'].includes(s);
}

/**
 * Properties of the current execution environment.
 *
 * Example usage:
 *
 * ```typescript
 * import { env } from 'shared/apis/env';
 * if (env.hostingEnv === 'production') {
 *   // ...
 * }
 * ```
 */
export type Env = {
  /** Inspects the type of hosting environment that we are currently in. */
  hostingEnv: HostingEnv;
  /** Checks whether we are currently in a development environment. */
  isDevelopment: boolean;
  /** Checks whether we are currently in a test environment. */
  isTest: boolean;
  /** Checks whether we are currently in a staging environment. */
  isStaging: boolean;
  /** Checks whether we are currently in a production environment. */
  isProduction: boolean;
};

function getHostingEnv() {
  const { NODE_ENV, REACT_APP_NODE_ENV = false } = process.env;
  const nodeEnv = REACT_APP_NODE_ENV || NODE_ENV;
  const hostname = (window && window.location && window.location.hostname) || '';

  // End-to-end tests run on the docker host address
  if (hostname === '10.99.0.1') {
    return 'staging';
  }

  // Slingshot builds are treated as staging as well
  if (Boolean(process.env.SLINGSHOT_BUILD)) {
    return 'staging';
  }

  // If running a prod build locally (rare, but happens)
  if (
    nodeEnv === 'production' &&
    (hostname === 'localhost' ||
      hostname === '[::1]' ||
      hostname === '0.0.0.0' ||
      Boolean(hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)))
  ) {
    return 'development';
  }

  if (isHostingEnv(nodeEnv)) {
    return nodeEnv;
  }

  return 'development';
}

export const env: Env = {
  get hostingEnv() {
    return getHostingEnv();
  },
  get isDevelopment() {
    return getHostingEnv() === 'development';
  },
  get isTest() {
    return getHostingEnv() === 'test';
  },
  get isStaging() {
    return getHostingEnv() === 'staging';
  },
  get isProduction() {
    return getHostingEnv() === 'production';
  },
};

export const envApi = new Api<Env>({
  id: 'env',
  title: 'Properties of the current execution environment',
  description: 'A collection of properties that are useful to inspect the current execution environment.',
});
