/*
 * Copyright 2020 Spotify AB
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
import path from 'path';

type storageOptions = {
  keyFilename?: string;
};

/**
 * @param sourceFile contains either / or \ as file separator depending upon OS.
 */
const checkFileExists = async (sourceFile: string): Promise<boolean> => {
  // sourceFile will always have / as file separator irrespective of OS since S3 expects /.
  // Normalize sourceFile to OS specific path before checking if file exists.
  const filePath = sourceFile.split(path.posix.sep).join(path.sep);

  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

class Bucket {
  private readonly bucketName;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  getMetadata() {
    return new Promise(resolve => {
      resolve('');
    });
  }

  upload(source: string, { destination }) {
    return new Promise(async (resolve, reject) => {
      if (await checkFileExists(source)) {
        resolve({ source, destination });
      } else {
        reject(`Source file ${source} does not exist.`);
      }
    });
  }
}

export class Storage {
  private readonly keyFilename;

  constructor(options: storageOptions) {
    this.keyFilename = options.keyFilename;
  }

  bucket(bucketName) {
    return new Bucket(bucketName);
  }
}
