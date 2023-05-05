/*
 * Copyright 2023 The Backstage Authors
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
  ANNOTATION_SOURCE_LOCATION,
  ComponentEntity,
} from '@backstage/catalog-model';
import z from 'zod';
import { AnalysisOutputs, Analyzer } from './types';
import { Repository, RepositoryFile } from '../providers/types';

export class PackageJsonAnalyzer implements Analyzer {
  name(): string {
    return PackageJsonAnalyzer.name;
  }

  async analyzeRepository(options: {
    repository: Repository;
    output: AnalysisOutputs;
  }): Promise<void> {
    const packageJson = await options.repository.file('package.json');
    if (!packageJson) {
      return;
    }

    const content = await readPackageJson(packageJson);
    if (!content) {
      return;
    }

    const name = sanitizeName(content?.name) ?? options.repository.name;

    const entity: ComponentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name,
        ...(options.repository.description
          ? { description: options.repository.description }
          : {}),
        tags: ['javascript'],
        annotations: {
          [ANNOTATION_SOURCE_LOCATION]: `url:${options.repository.url}`,
        },
      },
      spec: {
        type: 'website',
        lifecycle: 'production',
        owner: 'user:guest',
      },
    };

    const decorate = options.output
      .list()
      .find(entry => entry.entity.metadata.name === name);

    if (decorate) {
      decorate.entity.spec = {
        ...decorate.entity.spec,
        type: 'website',
      };

      decorate.entity.metadata.tags = [
        ...(decorate.entity.metadata.tags ?? []),
        'javascript',
      ];

      decorate.entity.metadata.annotations = {
        ...decorate.entity.metadata.annotations,
        [ANNOTATION_SOURCE_LOCATION]: `url:${options.repository.url}`,
      };

      return;
    }

    options.output.produce({
      type: 'entity',
      path: '/',
      entity,
    });
  }
}

const packageSchema = z.object({
  name: z.string().optional(),
});

/**
 * Makes sure that a name retrieved from a package.json file
 * is reasonable and conforms to the catalog naming format.
 *
 * Read more about the naming format here:
 *  ADR002: Default Software Catalog File Format
 *  https://backstage.io/docs/architecture-decisions/adrs-adr002/
 */
function sanitizeName(name?: string) {
  return name && name !== 'root'
    ? name.replace(/[^a-z0-9A-Z]/g, '_').substring(0, 62)
    : undefined;
}

async function readPackageJson(
  file: RepositoryFile,
): Promise<z.infer<typeof packageSchema> | undefined> {
  try {
    const text = await file.text();
    const result = packageSchema.safeParse(JSON.parse(text));
    if (!result.success) {
      return undefined;
    }
    return { name: result.data.name };
  } catch (e) {
    return undefined;
  }
}
