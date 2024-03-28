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

import YAML from 'js-yaml';
import pLimit from 'p-limit';
import { relative as relativePath, resolve as resolvePath } from 'path';
import { yamlOverwrite } from 'yaml-diff-patch';
import chalk from 'chalk';
import { PackageGraph, PackageRole } from '@backstage/cli-node';
import { Entity } from '@backstage/catalog-model';
import {
  getOwnerFromCodeowners,
  getPossibleCodeowners,
  loadCodeowners,
} from './codeowners';
import {
  BackstagePackageJson,
  isBackstagePackage,
  isRejected,
  isFulfilled,
  readFile,
  writeFile,
  safeEntityName,
} from './utils';
import { CodeOwnersEntry } from 'codeowners-utils';

type CreateFixPackageInfoYamlsOptions = {
  ci?: boolean;
  dryRun?: boolean;
};

export default async (opts: CreateFixPackageInfoYamlsOptions) => {
  const { dryRun = false, ci = false } = opts;
  const packages = await PackageGraph.listTargetPackages();
  const codeowners = await loadCodeowners();
  const limit = pLimit(10);

  // If --ci is passed, don't make any changes to the file system; we're only
  // interested in knowing if changes would have been made.
  const isDryRun = ci ? true : dryRun;
  const checkForChanges = ci;

  const results = await Promise.allSettled<string>(
    packages.map(({ packageJson, dir }) =>
      limit(async () => {
        if (!isBackstagePackage(packageJson)) {
          return '';
        }

        // Check if there is already a corresponding catalog-info.yaml
        const infoYamlPath = resolvePath(dir, 'catalog-info.yaml');
        let yamlString = '';

        try {
          yamlString = await readFile(infoYamlPath, { encoding: 'utf-8' });
        } catch (e) {
          if (e.code === 'ENOENT') {
            return await createCatalogInfoYaml({
              yamlPath: infoYamlPath,
              packageJson,
              codeowners,
              dryRun: isDryRun,
            });
          }

          throw e;
        }

        return await fixCatalogInfoYaml({
          yamlPath: infoYamlPath,
          packageJson,
          codeowners,
          yamlString,
          dryRun: isDryRun,
          ci,
        });
      }),
    ),
  );

  const rejects = results.filter(isRejected);
  if (rejects.length > 0) {
    // Problems encountered. Print details here.
    console.error(
      chalk.red('Unable to create or fix catalog-info.yaml files\n'),
    );
    rejects.forEach(reject => console.error(`  ${reject.reason}`));
    console.error();
    process.exit(1);
  }

  if (checkForChanges) {
    const instructions = results
      .filter(isFulfilled)
      .map(r => r.value)
      .filter(r => r !== '');

    // Non-empty instructions indicate changes would have been made.
    if (instructions.length > 0) {
      console.error(
        '\ncatalog-info.yaml file(s) out of sync with CODEOWNERS and/or package.json (see instructions above)\n',
      );
      process.exit(1);
    } else {
      console.error(
        'catalog-info.yaml file(s) in sync with CODEOWNERS and package.json',
      );
    }
  }
};

type CreateOptions = {
  yamlPath: string;
  packageJson: BackstagePackageJson;
  codeowners: CodeOwnersEntry[];
  dryRun: boolean;
};

type FixOptions = CreateOptions & {
  yamlString: string;
  ci: boolean;
};

type BackstagePackageEntity = Entity & {
  spec: {
    type: 'backstage-package';
    backstageRole: PackageRole;
    lifecycle: string;
    owner: string;
    [key: string]: any;
  };
};

async function createCatalogInfoYaml(options: CreateOptions) {
  const { codeowners, dryRun, packageJson, yamlPath } = options;
  const instruction = `Create ${relativePath('.', yamlPath)}`;
  const owner = getOwnerFromCodeowners(codeowners, yamlPath);
  const entity = createOrMergeEntity(packageJson, owner);

  if (dryRun) {
    console.error(instruction);
  } else {
    await writeFile(yamlPath, YAML.dump(entity));
  }

  return instruction;
}

async function fixCatalogInfoYaml(options: FixOptions) {
  const { ci, codeowners, dryRun, packageJson, yamlPath, yamlString } = options;
  const possibleOwners = getPossibleCodeowners(
    codeowners,
    relativePath('.', yamlPath),
  );
  const safeName = safeEntityName(packageJson.name);
  let yamlJson: BackstagePackageEntity;

  try {
    yamlJson = YAML.load(yamlString) as BackstagePackageEntity;
  } catch (e) {
    throw new Error(`Unable to parse ${relativePath('.', yamlPath)}: ${e}`);
  }

  const badOwner = !possibleOwners.includes(yamlJson.spec?.owner);
  const badTitle = yamlJson.metadata.title !== packageJson.name;
  const badName = yamlJson.metadata.name !== safeName;
  const badType =
    yamlJson.spec?.type !== `backstage-${packageJson.backstage.role}`;

  if (badOwner || badTitle || badName || badType) {
    const owner = badOwner
      ? getOwnerFromCodeowners(codeowners, yamlPath)
      : yamlJson.spec?.owner;
    const newJson = createOrMergeEntity(packageJson, owner, yamlJson);
    const instructions = [`Update ${relativePath('.', yamlPath)}`];

    // Show more detailed instructions when --ci flag is set.
    if (ci) {
      if (badOwner) {
        instructions.push(
          `  spec.owner cannot be "${
            yamlJson.spec.owner
          }" because it must be one of (${possibleOwners.join(
            ', ',
          )}) as listed in CODEOWNERS`,
        );
      }

      if (badTitle) {
        instructions.push(
          `  metadata.title cannot be "${yamlJson.metadata.title}" because it must be exactly "${packageJson.name}", the package.json name`,
        );
      }

      if (badName) {
        instructions.push(
          `  metadata.name cannot be "${yamlJson.metadata.name}" because it must be exactly "${safeName}", as derived from package.json name`,
        );
      }

      if (badType) {
        instructions.push(
          `  spec.type cannot be "${yamlJson.spec.type}" because it must be exactly "backstage-${packageJson.backstage.role}", as derived from package.json backstage.role`,
        );
      }
    }

    if (dryRun) {
      console.error(instructions.join('\n'));
    } else {
      await writeFile(yamlPath, yamlOverwrite(yamlString, newJson));
    }

    return instructions.join('\n');
  }

  return '';
}

/**
 * Canonical representation on how to create (or update) a backstage-package
 * component.
 */
function createOrMergeEntity(
  packageJson: BackstagePackageJson,
  owner: string,
  existingEntity: BackstagePackageEntity | Record<string, any> = {},
): BackstagePackageEntity {
  const entityName = safeEntityName(packageJson.name);

  return {
    ...existingEntity,
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      ...existingEntity.metadata,
      // Provide default name/title/description values.
      name: entityName,
      title: packageJson.name,
      ...(packageJson.description && !existingEntity.metadata?.description
        ? { description: packageJson.description }
        : undefined),
    },
    spec: {
      lifecycle: 'experimental',
      ...existingEntity.spec,
      type: `backstage-${packageJson.backstage.role}`,
      owner,
    },
  };
}
