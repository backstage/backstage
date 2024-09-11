/*
 * Copyright 2024 The Backstage Authors
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

import { BackstagePackageFeatureType, PackageRole } from '@backstage/cli-node';
import createFeatureEnvironment from '../tests/createFeatureEnvironment';
import { getEntryPointExports, getFeaturesMetadata } from './features';

describe('features', () => {
  describe('for package role', () => {
    // This Record makes sure we're checking all package roles
    const packageRoles: Record<PackageRole, boolean> = {
      // Allowed
      'backend-plugin': true,
      'backend-plugin-module': true,
      'frontend-plugin': true,
      'frontend-plugin-module': true,
      'web-library': true,
      'node-library': true,
      // Disallowed
      frontend: false,
      backend: false,
      cli: false,
      'common-library': false,
    };

    const allowedPackageRoles = Object.keys(packageRoles).filter(
      role => packageRoles[role as PackageRole],
    );

    const disallowedPackageRoles = Object.keys(packageRoles).filter(
      role => !packageRoles[role as PackageRole],
    );

    it.each(allowedPackageRoles)(`returns features for %s`, r => {
      const { project, role, dir, entryPoints } = createFeatureEnvironment({
        role: r as PackageRole,
      });

      expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual([
        {
          type: '@backstage/BackendFeature',
        },
      ]);
    });

    it.each(disallowedPackageRoles)(`does not return features for %s`, r => {
      const { project, role, dir, entryPoints } = createFeatureEnvironment({
        role: r as PackageRole,
      });

      expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual([]);
    });
  });

  describe('for feature $$type', () => {
    // This Record makes sure we're checking all feature types
    const featureTypes: Record<BackstagePackageFeatureType, boolean> = {
      // Allowed
      '@backstage/BackendFeature': true,
      '@backstage/BackstagePlugin': true,
      '@backstage/FrontendPlugin': true,
      '@backstage/FrontendModule': true,
      // Disallowed
      '@backstage/BackendFeatureFactory': false,
      '@backstage/BackstageCredentials': false,
      '@backstage/Extension': false,
      '@backstage/ExtensionDataRef': false,
      '@backstage/ExtensionDataValue': false,
      '@backstage/ExtensionDefinition': false,
      '@backstage/ExtensionInput': false,
      '@backstage/ExtensionOverrides': false,
      '@backstage/ExtensionPoint': false,
      '@backstage/ExternalRouteRef': false,
      '@backstage/RouteRef': false,
      '@backstage/ServiceRef': false,
      '@backstage/SubRouteRef': false,
      '@backstage/TranslationMessages': false,
      '@backstage/TranslationRef': false,
      '@backstage/TranslationResource': false,
    };

    const allowedFeatureTypes = Object.keys(featureTypes).filter(
      $$type => featureTypes[$$type as BackstagePackageFeatureType],
    );

    const disallowedFeatureTypes = Object.keys(featureTypes).filter(
      $$type => !featureTypes[$$type as BackstagePackageFeatureType],
    );

    it.each(allowedFeatureTypes)(`returns features for "%s" $$type`, $$type => {
      const { project, role, dir, entryPoints } = createFeatureEnvironment({
        $$type: $$type as BackstagePackageFeatureType,
      });

      expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual([
        {
          type: $$type,
        },
      ]);
    });

    it.each(disallowedFeatureTypes)(
      `does not return features for "%s" $$type`,
      $$type => {
        const { project, role, dir, entryPoints } = createFeatureEnvironment({
          $$type: $$type as BackstagePackageFeatureType,
        });

        expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual(
          [],
        );
      },
    );
  });

  describe('export declaration formats', () => {
    it('supports format of "export default ..."', () => {
      const {
        project,
        dir,
        entryPoints: [entryPoint],
      } = createFeatureEnvironment({
        format: 'DefaultExport',
      });

      expect(getEntryPointExports(entryPoint, project, dir)).toEqual([
        {
          location: '.',
          name: 'default',
          type: '@backstage/BackendFeature',
        },
      ]);
    });

    it('supports format of "export { default } from ..."', () => {
      const {
        project,
        dir,
        entryPoints: [entryPoint],
      } = createFeatureEnvironment({
        format: 'DefaultExportLinked',
      });

      expect(getEntryPointExports(entryPoint, project, dir)).toEqual([
        {
          location: '.',
          name: 'default',
          type: '@backstage/BackendFeature',
        },
      ]);
    });

    it('supports format of "export { default, ... } from ..."', () => {
      const {
        project,
        dir,
        entryPoints: [entryPoint],
      } = createFeatureEnvironment({
        format: 'DefaultExportLinkedWithSibling',
      });

      expect(getEntryPointExports(entryPoint, project, dir)).toEqual([
        {
          location: '.',
          name: 'default',
          type: '@backstage/BackendFeature',
        },
        {
          location: '.',
          name: 'test',
          type: '@backstage/BackendFeature',
        },
      ]);
    });

    it('supports format of "export const foo = ..."', () => {
      const {
        project,
        dir,
        entryPoints: [entryPoint],
      } = createFeatureEnvironment({
        format: 'NamedExport',
      });

      expect(getEntryPointExports(entryPoint, project, dir)).toEqual([
        {
          location: '.',
          name: 'test',
          type: '@backstage/BackendFeature',
        },
      ]);
    });

    it('supports format of "export * from ..."', () => {
      const {
        project,
        dir,
        entryPoints: [entryPoint],
      } = createFeatureEnvironment({
        format: 'WildCardExport',
      });

      expect(getEntryPointExports(entryPoint, project, dir)).toEqual([
        {
          location: '.',
          name: 'test',
          type: '@backstage/BackendFeature',
        },
      ]);
    });
  });

  describe('entry points', () => {
    it('returns features for multiple entry points', () => {
      const { project, role, dir, entryPoints } = createFeatureEnvironment({
        exports: {
          '.': 'src/index.ts',
          './alpha': 'src/alpha.ts',
          './beta': 'src/beta.ts',
        },
      });

      expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual([
        {
          type: '@backstage/BackendFeature',
        },
        {
          path: './alpha',
          type: '@backstage/BackendFeature',
        },
        {
          path: './beta',
          type: '@backstage/BackendFeature',
        },
      ]);
    });

    it('ignores entry points that are not .ts or .tsx files', () => {
      const { project, role, dir, entryPoints } = createFeatureEnvironment({
        exports: {
          '.': 'src/index.js',
        },
      });

      expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual([]);
    });
  });

  it('only returns default exports', () => {
    const { project, role, dir, entryPoints } = createFeatureEnvironment({
      format: 'DefaultExportLinkedWithSibling',
    });

    expect(getFeaturesMetadata(project, role, dir, entryPoints)).toEqual([
      {
        type: '@backstage/BackendFeature',
      },
    ]);
  });
});
