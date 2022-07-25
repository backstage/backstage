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

import path from 'path';
import fse from 'fs-extra';
import yaml from 'yaml';
import {
  validateMkdocsYaml,
  parseMkdocsYaml,
  getMkdocsYml,
} from '@backstage/plugin-techdocs-node';

import { Config } from './types';
import { CONFIG_FILE_NAME } from './constants';

/**
 * Used as a fallback to TechDocs config file
 * @param inputDir - path to configuration file
 * @returns YAML object representing the mkdocs configuration
 */
const getMkdocsConfig = async (inputDir: string) => {
  const { content } = await getMkdocsYml(inputDir);
  const docs_dir = await validateMkdocsYaml(inputDir, content);
  return { ...(parseMkdocsYaml(content) as Config), docs_dir };
};

/**
 * Parse the TechDocs configuration file
 * @param inputDir - path to configuration file
 * @returns JSON object representing TechDocs configuration
 */
export const getConfig = async (inputDir: string) => {
  const configPath = path.join(inputDir, CONFIG_FILE_NAME);
  if (await fse.pathExists(configPath)) {
    const content = await fse.readFile(configPath, 'utf8');
    return yaml.parse(content) as Config;
  }
  return await getMkdocsConfig(inputDir);
};

/**
 * Copy markdown files from input to output directory
 * @param inputDir - path to config file input directory
 * @param outputDir - path to config file output directory
 * @throws Error - When there is no index file
 */
export const copyMarkdownFiles = async (
  inputDir: string,
  outputDir: string,
) => {
  await fse.copy(inputDir, outputDir);

  if (await fse.pathExists(path.join(outputDir, 'index.md'))) return;

  if (await fse.pathExists(path.join(inputDir, 'README.md'))) {
    await fse.copy(
      path.join(inputDir, 'README.md'),
      path.join(outputDir, 'index.md'),
    );
    return;
  }

  if (await fse.pathExists(path.join(inputDir, 'readme.md'))) {
    await fse.copy(
      path.join(inputDir, 'readme.md'),
      path.join(outputDir, 'index.md'),
    );
    return;
  }

  throw new Error('Index file not found');
};
