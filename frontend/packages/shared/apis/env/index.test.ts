import { env } from './index';

function runTest(
  fn: () => boolean,
  hostname: string | undefined,
  env: { [key: string]: string } | undefined,
  expectedSuccess: boolean,
) {
  let oldLocation: PropertyDescriptor | undefined;
  if (hostname !== undefined) {
    oldLocation = Object.getOwnPropertyDescriptor(window, 'location');
    delete window.location;
    Object.defineProperty(window, 'location', { configurable: true, value: { hostname } });
  }

  let oldEnv: NodeJS.ProcessEnv | undefined;
  if (env !== undefined) {
    oldEnv = { ...process.env };
    process.env = env;
  }

  const outcome = fn();
  if (expectedSuccess) {
    expect(outcome).toBeTruthy();
  } else {
    expect(outcome).toBeFalsy();
  }

  if (oldLocation !== undefined) {
    Object.defineProperty(window, 'location', oldLocation!);
  }

  if (oldEnv !== undefined) {
    process.env = oldEnv;
  }
}

describe('env api', () => {
  it('matches localhost addresses to the development type', () => {
    runTest(() => env.hostingEnv === 'development', 'localhost', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isDevelopment, 'localhost', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isDevelopment, 'localhosts', { NODE_ENV: 'development' }, true);
    runTest(() => env.isDevelopment, '[::1]', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isDevelopment, '127.0.0.1', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isDevelopment, '127.0.6.1', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isDevelopment, '0.0.0.0', { NODE_ENV: 'blblbl' }, true);
  });

  it('matches the docker host address to the staging type', () => {
    runTest(() => env.hostingEnv === 'staging', '10.99.0.1', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isStaging, '10.99.0.1', { NODE_ENV: 'blblbl' }, true);
    runTest(() => env.isStaging, 'localhost', { NODE_ENV: 'blblbl' }, false);
  });

  it('matches the SLINGSHOT_BUILD env var to the staging type', () => {
    runTest(() => env.hostingEnv === 'staging', undefined, { SLINGSHOT_BUILD: 'dfd' }, true);
    runTest(() => env.isStaging, undefined, { SLINGSHOT_BUILD: 'dfd' }, true);
  });
});
