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

import mockFs from 'mock-fs';
import { Command } from 'commander';
import {
  getRoleInfo,
  getRoleFromPackage,
  findRoleFromCommand,
  detectRoleFromPackage,
} from './packageRoles';

describe('getRoleInfo', () => {
  it('provides role info by role', () => {
    expect(getRoleInfo('web-library')).toEqual({
      role: 'web-library',
      platform: 'web',
      output: ['types', 'esm'],
    });

    expect(getRoleInfo('frontend')).toEqual({
      role: 'frontend',
      platform: 'web',
      output: ['bundle'],
    });

    expect(() => getRoleInfo('invalid')).toThrow(
      `Unknown package role 'invalid'`,
    );
  });
});

describe('getRoleFromPackage', () => {
  it('reads explicit package roles', () => {
    expect(
      getRoleFromPackage({
        backstage: {
          role: 'web-library',
        },
      }),
    ).toEqual('web-library');

    expect(
      getRoleFromPackage({
        backstage: {
          role: 'frontend',
        },
      }),
    ).toEqual('frontend');

    expect(() =>
      getRoleFromPackage({
        name: 'test',
        backstage: {},
      }),
    ).toThrow('Package test must specify a role in the "backstage" field');

    expect(() =>
      getRoleFromPackage({
        name: 'test',
        backstage: { role: 'invalid' },
      }),
    ).toThrow(`Unknown package role 'invalid'`);
  });
});

describe('findRoleFromCommand', () => {
  function mkCommand(args: string) {
    const parsed = new Command()
      .option('--role <role>', 'test role')
      .parse(['node', 'entry.js', ...args.split(' ')]) as Command;
    return parsed.opts();
  }

  beforeEach(() => {
    mockFs({
      'package.json': JSON.stringify({
        name: 'test',
        backstage: {
          role: 'web-library',
        },
      }),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('provides role info by role', async () => {
    await expect(findRoleFromCommand(mkCommand(''))).resolves.toEqual(
      'web-library',
    );

    await expect(
      findRoleFromCommand(mkCommand('--role node-library')),
    ).resolves.toEqual('node-library');

    await expect(
      findRoleFromCommand(mkCommand('--role invalid')),
    ).rejects.toThrow(`Unknown package role 'invalid'`);
  });
});

describe('detectRoleFromPackage', () => {
  it('detects the role of example-app', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('frontend');
  });

  it('detects the role of example-backend', () => {
    expect(
      detectRoleFromPackage({
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
        },
      }),
    ).toEqual('backend');
  });

  it('detects the role of @backstage/plugin-catalog', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('frontend-plugin');
  });

  it('detects the role of @backstage/plugin-catalog-backend', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('backend-plugin');
  });

  it('detects the role of @backstage/plugin-catalog-react', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('web-library');
  });

  it('detects the role of @backstage/plugin-catalog-common', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('common-library');
  });

  it('detects the role of @backstage/plugin-catalog-backend-module-ldap', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('backend-plugin-module');
  });

  it('detects the role of @backstage/plugin-permission-node', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('node-library');
  });

  it('detects the role of @backstage/plugin-analytics-module-ga', () => {
    expect(
      detectRoleFromPackage({
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
    ).toEqual('frontend-plugin-module');
  });
});
