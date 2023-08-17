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
  readFile,
  writeFile,
} from './utils';
import { CodeOwnersEntry } from 'codeowners-utils';

type CreateFixPackageInfoYamlsOptions = {
  dryRun?: boolean;
};

export default async (opts: CreateFixPackageInfoYamlsOptions) => {
  const { dryRun = false } = opts;
  const packages = await PackageGraph.listTargetPackages();
  const codeowners = await loadCodeowners();
  const limit = pLimit(10);

  const results = await Promise.allSettled<void>(
    packages.map(({ packageJson, dir }) =>
      limit(async () => {
        if (!isBackstagePackage(packageJson)) {
          return;
        }

        // Check if there is already a corresponding catalog-info.yaml
        const infoYamlPath = resolvePath(dir, 'catalog-info.yaml');
        let yamlString = '';

        try {
          yamlString = await readFile(infoYamlPath, { encoding: 'utf-8' });
        } catch (e) {
          if (e.code === 'ENOENT') {
            await createCatalogInfoYaml({
              yamlPath: infoYamlPath,
              packageJson,
              codeowners,
              dryRun,
            });
            return;
          }

          throw e;
        }

        await fixCatalogInfoYaml({
          yamlPath: infoYamlPath,
          packageJson,
          codeowners,
          yamlString,
          dryRun,
        });
      }),
    ),
  );

  const rejects = results.filter(
    r => r.status === 'rejected',
  ) as PromiseRejectedResult[];
  if (rejects.length > 0) {
    // Problems encountered. Print details here.
    console.error(
      chalk.red('Unable to create or fix catalog-info.yaml files\n'),
    );
    rejects.forEach(reject => console.error(`  ${reject.reason}`));
    console.error();
    process.exit(1);
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

function createCatalogInfoYaml(options: CreateOptions) {
  const { codeowners, dryRun, packageJson, yamlPath } = options;
  const owner = getOwnerFromCodeowners(codeowners, yamlPath);
  const entity = createOrMergeEntity(packageJson, owner);

  return dryRun
    ? Promise.resolve(console.error(`Create ${relativePath('.', yamlPath)}`))
    : writeFile(yamlPath, YAML.dump(entity));
}

function fixCatalogInfoYaml(options: FixOptions) {
  const { codeowners, dryRun, packageJson, yamlPath, yamlString } = options;
  const possibleOwners = getPossibleCodeowners(
    codeowners,
    relativePath('.', yamlPath),
  );
  const safeName = packageJson.name
    .replace(/[^a-z0-9_\-\.]+/g, '-')
    .replace(/^[^a-z0-9]|[^a-z0-9]$/g, '');
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
    return dryRun
      ? Promise.resolve(console.error(`Update ${relativePath('.', yamlPath)}`))
      : writeFile(yamlPath, yamlOverwrite(yamlString, newJson));
  }

  return Promise.resolve();
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
  const safeEntityName = packageJson.name
    .replace(/[^a-z0-9_\-\.]+/g, '-')
    .replace(/^[^a-z0-9]|[^a-z0-9]$/g, '');

  return {
    ...existingEntity,
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      ...existingEntity.metadata,
      // Provide default name/title/description values.
      name: safeEntityName,
      title: packageJson.name,
      ...(packageJson.description
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
