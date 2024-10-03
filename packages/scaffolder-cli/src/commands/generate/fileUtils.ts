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

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { JsonValue, JsonObject } from '@backstage/types';

// Function to recursively read a directory and return a list of filenames
export const validateDirectoryAccess = (directory: string): void => {
  // Check if the directory can be read
  fs.access(directory, fs.constants.R_OK, err => {
    if (err) {
      console.error(`Cannot read directory: ${directory}`);
      return;
    }
  });
};

export async function readYamlFile(filePath: string): Promise<JsonValue> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent) as JsonValue;
  } catch (e) {
    console.error(`Error reading or parsing file: ${filePath}`, e);
    throw e;
  }
}

export async function readJsonFile(filePath: string): Promise<JsonObject> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent) as JsonObject;
    return jsonData;
  } catch (e) {
    console.error(`Error reading or parsing file: ${filePath}`, e);
    throw e;
  }
}

// Function to recursively read a directory and return a list of filenames
const readDirectory = (directory: string): string[] => {
  let files: string[] = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(readDirectory(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};
