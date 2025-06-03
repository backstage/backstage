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

import { OptionValues } from 'commander';
import { startPackage } from './startPackage';
import { resolveLinkedWorkspace } from './resolveLinkedWorkspace';
import { findRoleFromCommand } from '../../../../../lib/role';
import { paths } from '../../../../../lib/paths';

export async function command(opts: OptionValues): Promise<void> {
  await startPackage({
    role: await findRoleFromCommand(opts),
    targetDir: paths.targetDir,
    configPaths: opts.config as string[],
    checksEnabled: Boolean(opts.check),
    linkedWorkspace: await resolveLinkedWorkspace(opts.link),
    inspectEnabled: opts.inspect,
    inspectBrkEnabled: opts.inspectBrk,
    require: opts.require,
  });
}
