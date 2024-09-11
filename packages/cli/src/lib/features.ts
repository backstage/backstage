/*
 * Copyright 2020 The Backstage Authors
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

import {
  isValidPackageFeatureType,
  PackageRole,
  type BackstagePackageFeature,
  type BackstagePackageFeatureType,
} from '@backstage/cli-node';
import { Project, SyntaxKind, ts, Type } from 'ts-morph';
import { resolve as resolvePath } from 'node:path';
import { EntryPoint } from './entryPoints';

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

// Returns all valid Backstage package features from a project
// for all entry points.
export function getFeaturesMetadata(
  project: Project,
  role: PackageRole,
  dir: string,
  entryPoints: EntryPoint[],
): BackstagePackageFeature[] {
  if (!targetPackageRoles.includes(role)) {
    return [];
  }

  return entryPoints
    .flatMap(entryPoint => getEntryPointExports(entryPoint, project, dir))
    .filter(isDefaultExport)
    .filter(isTargetFeatureType)
    .map(toBackstagePackageFeature);
}

type EntryPointExport = {
  name: string;
  location: string;
  type: BackstagePackageFeatureType;
};

// Returns all exports (default and named) from an entry point
// that are valid Backstage package features
export function getEntryPointExports(
  { mount: location, path, ext }: EntryPoint,
  project: Project,
  dir: string,
): EntryPointExport[] {
  const fullFilePath = resolvePath(dir, path);
  const sourceFile = project.getSourceFile(fullFilePath);

  if (!sourceFile || (ext !== '.ts' && ext !== '.tsx')) {
    return [];
  }

  const exports = [];

  for (const exportSymbol of sourceFile.getExportSymbols()) {
    const declaration = exportSymbol.getDeclarations()[0];
    const exportName = declaration.getSymbol()?.getName();
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
        exports.push({
          name: exportName,
          location,
          type: $$type,
        });
      }
    }
  }

  return exports;
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

// Returns whether an export is the default export
function isDefaultExport({ name }: EntryPointExport): boolean {
  return name === 'default';
}

// Returns whether an export is a valid Backstage package feature type
function isTargetFeatureType({ type }: EntryPointExport): boolean {
  return targetFeatureTypes.includes(type);
}

// Converts an entry point export to a Backstage package feature
function toBackstagePackageFeature({
  type,
  location,
}: EntryPointExport): BackstagePackageFeature {
  const feature: BackstagePackageFeature = { type };

  if (location !== '.') {
    feature.path = location;
  }

  return feature;
}
