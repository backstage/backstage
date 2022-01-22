/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { readPackageRole, detectPackageRole } from './packageRoles';

describe('readPackageRole', () => {
  it('reads explicit package roles', () => {
    expect(
      readPackageRole({
        backstage: {
          role: 'web-library',
        },
      }),
    ).toEqual({
      role: 'web-library',
      platform: 'web',
    });

    expect(
      readPackageRole({
        backstage: {
          role: 'app',
        },
      }),
    ).toEqual({
      role: 'app',
      platform: 'web',
    });

    expect(() =>
      readPackageRole({
        name: 'test',
        backstage: {},
      }),
    ).toThrow('Package test must specify a role in the "backstage" field');

    expect(() =>
      readPackageRole({
        name: 'test',
        backstage: { role: 'invalid' },
      }),
    ).toThrow(`Unknown role 'invalid' in package test`);
  });
});

describe('detectPackageRole', () => {
  it('detects the role of example-app', () => {
    expect(
      detectPackageRole({
        name: 'example-app',
        private: true,
        bundled: true,
        scripts: {
          start: 'backstage-cli app:serve',
          build: 'backstage-cli app:build',
          clean: 'backstage-cli clean',
          test: 'backstage-cli test',
          'test:e2e':
            'start-server-and-test start http://localhost:3000 cy:dev',
          'test:e2e:ci':
            'start-server-and-test start http://localhost:3000 cy:run',
          lint: 'backstage-cli lint',
          'cy:dev': 'cypress open',
          'cy:run': 'cypress run',
        },
      }),
    ).toEqual({
      role: 'app',
      platform: 'web',
    });
  });

  it('detects the role of example-backend', () => {
    expect(
      detectPackageRole({
        name: 'example-backend',
        main: 'dist/index.cjs.js',
        types: 'src/index.ts',
        scripts: {
          build: 'backstage-cli backend:bundle',
          'build-image':
            'docker build ../.. -f Dockerfile --tag example-backend',
          start: 'backstage-cli backend:dev',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          clean: 'backstage-cli clean',
          'migrate:create': 'knex migrate:make -x ts',
        },
      }),
    ).toEqual({
      role: 'backend',
      platform: 'node',
    });
  });

  it('detects the role of @backstage/plugin-catalog', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-catalog',
        main: 'src/index.ts',
        types: 'src/index.ts',
        publishConfig: {
          access: 'public',
          main: 'dist/index.esm.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          build: 'backstage-cli plugin:build',
          start: 'backstage-cli plugin:serve',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          diff: 'backstage-cli plugin:diff',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'plugin-frontend',
      platform: 'web',
    });
  });

  it('detects the role of @backstage/plugin-catalog-backend', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-catalog-backend',
        main: 'src/index.ts',
        types: 'src/index.ts',
        publishConfig: {
          access: 'public',
          main: 'dist/index.cjs.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          start: 'backstage-cli backend:dev',
          build: 'backstage-cli backend:build',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'plugin-backend',
      platform: 'node',
    });
  });

  it('detects the role of @backstage/plugin-catalog-react', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-catalog-react',
        main: 'src/index.ts',
        types: 'src/index.ts',
        publishConfig: {
          access: 'public',
          main: 'dist/index.esm.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          build: 'backstage-cli build',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'web-library',
      platform: 'web',
    });
  });

  it('detects the role of @backstage/plugin-catalog-common', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-catalog-common',
        main: 'src/index.ts',
        types: 'src/index.ts',
        publishConfig: {
          access: 'public',
          main: 'dist/index.cjs.js',
          module: 'dist/index.esm.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          build: 'backstage-cli build',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test --passWithNoTests',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'common-library',
      platform: 'common',
    });
  });

  it('detects the role of @backstage/plugin-catalog-backend-module-ldap', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-catalog-backend-module-ldap',
        main: 'src/index.ts',
        types: 'src/index.ts',
        publishConfig: {
          access: 'public',
          main: 'dist/index.cjs.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          build: 'backstage-cli backend:build',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'plugin-backend-module',
      platform: 'node',
    });
  });

  it('detects the role of @backstage/plugin-permission-node', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-permission-node',
        main: 'src/index.ts',
        types: 'src/index.ts',
        homepage: 'https://backstage.io',
        publishConfig: {
          access: 'public',
          main: 'dist/index.cjs.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          build: 'backstage-cli backend:build',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'node-library',
      platform: 'node',
    });
  });

  it('detects the role of @backstage/plugin-analytics-module-ga', () => {
    expect(
      detectPackageRole({
        name: '@backstage/plugin-analytics-module-ga',
        main: 'src/index.ts',
        types: 'src/index.ts',
        publishConfig: {
          access: 'public',
          main: 'dist/index.esm.js',
          types: 'dist/index.d.ts',
        },
        scripts: {
          build: 'backstage-cli plugin:build',
          start: 'backstage-cli plugin:serve',
          lint: 'backstage-cli lint',
          test: 'backstage-cli test',
          diff: 'backstage-cli plugin:diff',
          prepack: 'backstage-cli prepack',
          postpack: 'backstage-cli postpack',
          clean: 'backstage-cli clean',
        },
      }),
    ).toEqual({
      role: 'plugin-frontend-module',
      platform: 'web',
    });
  });
});
