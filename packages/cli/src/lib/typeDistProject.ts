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
import { findPaths } from '@backstage/cli-common';
import {
  BackstagePackageFeatureType,
  isValidPackageFeatureType,
  PackageGraph,
  PackageRole,
} from '@backstage/cli-node';
import { builtinModules } from 'module';
import { resolve as resolvePath } from 'path';
import { Project, SourceFile, SyntaxKind, ts, Type } from 'ts-morph';
import { EntryPoint, readEntryPoints } from './entryPoints';

export const getDistTypeRoot = (dir: string) => {
  const workspaceRoot = findPaths(process.cwd()).targetRoot;
  const relativeDirectory = dir.replace(workspaceRoot, '');
  const distTypeRoot = resolvePath(
    workspaceRoot,
    `./dist-types${relativeDirectory}`,
  );

  return distTypeRoot;
};

const getPackagesDistTypeMap = async () => {
  const packages = await PackageGraph.listTargetPackages();
  const distTypeMap: Record<string, string> = {};

  for (const { dir, packageJson } of packages) {
    const distTypeRoot = getDistTypeRoot(dir);

    for (const { name, path, ext } of readEntryPoints(packageJson)) {
      const dtsPath = resolvePath(distTypeRoot, path.replace(ext, '.d.ts'));

      if (name === 'index') {
        distTypeMap[packageJson.name] = dtsPath;
      } else {
        distTypeMap[`${packageJson.name}/${name}`] = dtsPath;
      }
    }
  }

  return distTypeMap;
};

export const createTypeDistProject = async () => {
  const distTypeMap = await getPackagesDistTypeMap();
  const workspaceRoot = findPaths(process.cwd()).targetRoot;

  return new Project({
    tsConfigFilePath: resolvePath(workspaceRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    resolutionHost: (moduleResolutionHost, getCompilerOptions) => {
      return {
        resolveModuleNames: (moduleNames, containingFile) => {
          const compilerOptions = getCompilerOptions();
          const resolvedModules: ts.ResolvedModule[] = [];

          for (let moduleName of moduleNames) {
            // Handle resolve internal plugins and package entry points to dist-types folder
            if (distTypeMap[moduleName]) {
              resolvedModules.push({
                resolvedFileName: distTypeMap[moduleName],
                isExternalLibraryImport: false,
                resolvedUsingTsExtension: false,
              });
              continue;
            }

            // Handle resolving builtin node modules to @types/node
            if (moduleName.startsWith('node:')) {
              moduleName = moduleName.slice(5);
            }
            if (builtinModules.includes(moduleName)) {
              const result = ts.resolveModuleName(
                `@types/node/${moduleName}`,
                containingFile,
                compilerOptions,
                moduleResolutionHost,
              );

              if (result.resolvedModule) {
                resolvedModules.push(result.resolvedModule);
                continue;
              }
            }

            // Handle resolve relative paths and external node_modules.
            const result = ts.resolveModuleName(
              moduleName,
              containingFile,
              compilerOptions,
              moduleResolutionHost,
            );

            if (result.resolvedModule) {
              resolvedModules.push(result.resolvedModule);
              continue;
            }

            throw new Error(`Failed to resolve module: ${moduleName}`);
          }

          return resolvedModules;
        },
      };
    },
  });
};

// A list of the package roles we want to extract features for
const targetPackageRoles: PackageRole[] = [
  'backend-plugin',
  'backend-plugin-module',
  'frontend-plugin',
  'frontend-plugin-module',
  'web-library',
  'node-library',
];

// A list of the feature types we want to extract from the project
// and include in the metadata
const targetFeatureTypes: BackstagePackageFeatureType[] = [
  '@backstage/BackendFeature',
  '@backstage/BackstagePlugin',
  '@backstage/FrontendPlugin',
  '@backstage/FrontendModule',
];

export const getEntryPointDefaultFeatureType = (
  role: PackageRole,
  packageDir: string,
  project: Project,
  entryPoint: EntryPoint,
): BackstagePackageFeatureType | null => {
  if (isTargetPackageRole(role)) {
    const dtsPath = resolvePath(
      getDistTypeRoot(packageDir),
      entryPoint.path.replace(entryPoint.ext, '.d.ts'),
    );

    const defaultFeatureType = getSourceFileDefaultFeatureType(
      project.addSourceFileAtPath(dtsPath),
    );

    if (isTargetFeatureType(defaultFeatureType)) {
      return defaultFeatureType;
    }
  }

  return null;
};

// Condition for a package role matches a target package role
function isTargetPackageRole(role: PackageRole): boolean {
  return !!role && targetPackageRoles.includes(role);
}

// Returns whether an export is a valid Backstage package feature type
function isTargetFeatureType(
  type: BackstagePackageFeatureType | null,
): boolean {
  return !!type && targetFeatureTypes.includes(type);
}

// Returns all exports (default and named) from an entry point
// that are valid Backstage package features
function getSourceFileDefaultFeatureType(
  sourceFile: SourceFile,
): BackstagePackageFeatureType | null {
  for (const exportSymbol of sourceFile.getExportSymbols()) {
    const declaration = exportSymbol.getDeclarations()[0];
    const exportName = declaration.getSymbol()?.getName();

    if (exportName !== 'default') {
      continue;
    }

    let exportType: Type<ts.Type> | undefined;

    if (declaration) {
      if (declaration.isKind(SyntaxKind.ExportAssignment)) {
        exportType = declaration.getExpression().getType();
      } else if (declaration.isKind(SyntaxKind.ExportSpecifier)) {
        if (!declaration.isTypeOnly()) {
          exportType = declaration.getType();
        }
      } else if (declaration.isKind(SyntaxKind.VariableDeclaration)) {
        exportType = declaration.getType();
      }
    }

    if (exportName && exportType) {
      const $$type = getBackstagePackageFeature$$TypeFromType(exportType);

      if ($$type) {
        return $$type;
      }
    }
  }

  return null;
}

// Given a TS type, returns the Backstage package feature $$type value
function getBackstagePackageFeature$$TypeFromType(
  type: Type,
): BackstagePackageFeatureType | null {
  // Returns the concrete type of a generic type
  const exportType = type.getTargetType() ?? type;

  for (const property of exportType.getProperties()) {
    if (property.getName() === '$$type') {
      const $$type = property
        .getValueDeclaration()
        ?.getText()
        .match(/(?<type>@backstage\/\w+)/)?.groups?.type;

      if ($$type && isValidPackageFeatureType($$type)) {
        return $$type;
      }
    }
  }

  return null;
}
