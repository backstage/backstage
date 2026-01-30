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

import fs from 'fs-extra';
import yaml from 'yaml';
import { paths } from './paths';
import { ReleaseManifest } from '@backstage/release-manifests';

const PNPM_WORKSPACE_YAML = 'pnpm-workspace.yaml';
const PNPM_LOCK_YAML = 'pnpm-lock.yaml';

/**
 * The structure of a pnpm-workspace.yaml file.
 */
interface PnpmWorkspaceConfig {
  packages?: string[];
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
  [key: string]: unknown;
}

/**
 * Detects whether the project uses pnpm by checking for pnpm-specific files.
 *
 * @returns true if pnpm is detected, false otherwise
 */
export function getHasPnpm(): boolean {
  const workspaceYamlPath = paths.resolveTargetRoot(PNPM_WORKSPACE_YAML);
  const lockfilePath = paths.resolveTargetRoot(PNPM_LOCK_YAML);

  return (
    fs.pathExistsSync(workspaceYamlPath) || fs.pathExistsSync(lockfilePath)
  );
}

/**
 * Reads the current pnpm-workspace.yaml file if it exists.
 *
 * @returns The parsed workspace config, or an empty object if the file doesn't exist
 */
async function readPnpmWorkspaceConfig(): Promise<{
  config: PnpmWorkspaceConfig;
  document: yaml.Document | null;
}> {
  const workspaceYamlPath = paths.resolveTargetRoot(PNPM_WORKSPACE_YAML);

  try {
    const content = await fs.readFile(workspaceYamlPath, 'utf-8');
    const document = yaml.parseDocument(content);
    return {
      config: document.toJSON() as PnpmWorkspaceConfig,
      document,
    };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return { config: {}, document: null };
    }
    throw e;
  }
}

/**
 * Updates the pnpm-workspace.yaml catalog with Backstage package versions
 * from the release manifest.
 *
 * This function only updates packages that are already in the catalog or
 * are being used in the workspace. It uses the 'catalog' field (not 'catalogs')
 * for simplicity.
 *
 * @param releaseManifest - The Backstage release manifest containing package versions
 * @param usedPackages - Set of package names that are used in the workspace
 * @returns Promise<boolean> - true if the catalog was updated, false if no changes were needed
 */
export async function updatePnpmCatalog(
  releaseManifest: ReleaseManifest,
  usedPackages: Set<string>,
): Promise<boolean> {
  const workspaceYamlPath = paths.resolveTargetRoot(PNPM_WORKSPACE_YAML);
  const { config, document } = await readPnpmWorkspaceConfig();

  // Build a map of package name -> version from the manifest
  const manifestVersions = new Map(
    releaseManifest.packages.map(p => [p.name, p.version]),
  );

  // Get the current catalog entries
  const currentCatalog = config.catalog ?? {};

  // Build the new catalog: update existing entries and add new ones for used packages
  const newCatalog: Record<string, string> = {};
  let hasChanges = false;

  // First, update any existing catalog entries that are in the manifest
  for (const [name, currentVersion] of Object.entries(currentCatalog)) {
    const manifestVersion = manifestVersions.get(name);
    if (manifestVersion) {
      const newVersion = `^${manifestVersion}`;
      if (currentVersion !== newVersion) {
        hasChanges = true;
      }
      newCatalog[name] = newVersion;
    } else {
      // Keep non-Backstage packages as-is
      newCatalog[name] = currentVersion;
    }
  }

  // Then, add any used Backstage packages that aren't already in the catalog
  for (const packageName of usedPackages) {
    if (!newCatalog[packageName]) {
      const manifestVersion = manifestVersions.get(packageName);
      if (manifestVersion) {
        newCatalog[packageName] = `^${manifestVersion}`;
        hasChanges = true;
      }
    }
  }

  if (!hasChanges) {
    return false;
  }

  // Sort the catalog entries for consistent output
  const sortedCatalog = Object.fromEntries(
    Object.entries(newCatalog).sort(([a], [b]) => a.localeCompare(b)),
  );

  // Update the config
  config.catalog = sortedCatalog;

  // If we have an existing document, try to preserve formatting
  if (document) {
    // Update the catalog in the document
    if (!document.has('catalog')) {
      document.set('catalog', sortedCatalog);
    } else {
      const catalogNode = document.get('catalog');
      if (yaml.isMap(catalogNode)) {
        // Clear existing items and add new ones
        catalogNode.items = [];
        for (const [key, value] of Object.entries(sortedCatalog)) {
          catalogNode.add(document.createPair(key, value));
        }
      } else {
        document.set('catalog', sortedCatalog);
      }
    }

    await fs.writeFile(workspaceYamlPath, document.toString(), 'utf-8');
  } else {
    // Create a new file with proper YAML formatting
    const newDocument = new yaml.Document(config);
    await fs.writeFile(workspaceYamlPath, newDocument.toString(), 'utf-8');
  }

  return true;
}

/**
 * Gets the set of Backstage packages that are currently using the catalog: protocol
 * in the workspace.
 *
 * @returns Set of package names using catalog: protocol
 */
export async function getPnpmCatalogPackages(): Promise<Set<string>> {
  const { config } = await readPnpmWorkspaceConfig();
  return new Set(Object.keys(config.catalog ?? {}));
}
