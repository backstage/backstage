/*
 * Copyright 2026 The Backstage Authors
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

// Building blocks for implementing additional TechDocs generators. These are
// alpha while the set of engines settles and may change in minor releases.
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import type { TechDocsContainerRunner } from '@backstage/plugin-techdocs-node';
import { DockerContainerRunner } from './stages/generate/DockerContainerRunner';
import { createKubernetesJobRunner as createKubernetesJobRunnerFromConfig } from './stages/generate/techdocs';

export { sanitizeMkdocsYml } from './stages/generate/mkdocsPatchers';
export {
  createOrUpdateMetadata,
  storeEtagMetadata,
  runCommand,
  validateInputDirectory,
  patchIndexPreBuild,
  validateMkdocsYaml,
  MKDOCS_SCHEMA,
} from './stages/generate/helpers';
export type { RunCommandOptions } from './stages/generate/helpers';

/**
 * Creates a container runner that uses the local Docker daemon, the same one
 * the built-in MkDocs generator uses.
 *
 * @alpha
 */
export function createDockerContainerRunner(): TechDocsContainerRunner {
  return new DockerContainerRunner();
}

/**
 * Creates a container runner that runs builds as Kubernetes Jobs, configured
 * by `techdocs.generator.kubernetes`, the same one the built-in MkDocs
 * generator uses when `techdocs.generator.runIn` is `'kubernetes'`.
 *
 * @alpha
 */
export function createKubernetesJobRunner(options: {
  config: Config;
  logger?: LoggerService;
}): TechDocsContainerRunner {
  return createKubernetesJobRunnerFromConfig(options.config, options.logger);
}
