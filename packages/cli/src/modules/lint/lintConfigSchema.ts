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
import { resolve as resolvePath } from 'path';

export async function lintConfigSchema(pkgDir: string): Promise<string[]> {
    const errors: string[] = [];
    const pkgJsonPath = resolvePath(pkgDir, 'package.json');
    if (!(await fs.pathExists(pkgJsonPath))) {
        return errors;
    }

    const pkgJson = await fs.readJson(pkgJsonPath);
    const hasConfigDts = await fs.pathExists(resolvePath(pkgDir, 'config.d.ts'));

    const configSchemaVal = pkgJson.configSchema;
    const configSchemaPath =
        typeof configSchemaVal === 'string' && configSchemaVal.trim().length > 0
            ? configSchemaVal
            : undefined;

    const filesArray = Array.isArray(pkgJson.files) ? pkgJson.files : [];

    if (hasConfigDts) {
        if (!configSchemaPath) {
            errors.push(
                'Error: config.d.ts exists but package.json "configSchema" is not a non-empty string path to config.d.ts.',
            );
        } else {
            const resolvedConfigSchemaPath = resolvePath(pkgDir, configSchemaPath);
            const resolvedConfigDtsPath = resolvePath(pkgDir, 'config.d.ts');
            if (resolvedConfigSchemaPath !== resolvedConfigDtsPath) {
                errors.push(
                    'Error: config.d.ts exists but package.json "configSchema" does not point to "config.d.ts".',
                );
            }
        }

        if (!filesArray.includes('config.d.ts')) {
            errors.push(
                'Error: config.d.ts exists but is not included in package.json "files" array.',
            );
        }
    }

    if (configSchemaPath) {
        const schemaFileExists = await fs.pathExists(
            resolvePath(pkgDir, configSchemaPath),
        );
        if (!schemaFileExists) {
            errors.push(
                `Error: "configSchema" references "${configSchemaPath}" but the file does not exist.`,
            );
        } else if (!filesArray.includes(configSchemaPath)) {
            errors.push(
                `Error: "configSchema" file "${configSchemaPath}" is not included in package.json "files" array.`,
            );
        }
    }

    return errors;
}
