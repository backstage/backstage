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
import { OpenstackProviderOptions } from 'pkgcloud';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const checkFileExists = async (Key: string): Promise<boolean> => {
  // Key will always have / as file separator irrespective of OS since S3 expects /.
  // Normalize Key to OS specific path before checking if file exists.
  const relativeFilePath = Key.split(path.posix.sep).join(path.sep);
  const filePath = path.join(rootDir, Key);

  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

class PkgCloudStorageClient {
  getFile(
    containerName: string,
    file: string,
    callback: (err: string, file: string) => any,
  ) {
    checkFileExists(file).then(res => {
      if (!res) {
        callback('File does not exist', undefined);
        throw new Error('File does not exist');
      } else {
        callback(undefined, 'success');
      }
    });
  }

  getContainer(
    containerName: string,
    callback: (err: string, container: string) => any,
  ) {
    if (containerName !== 'mock') {
      callback("Container doesn't exist", undefined);
      throw new Error('Container does not exist');
    } else {
      callback(undefined, 'success');
    }
  }

  upload({ containerName, remote }: { containerName: string; remote: string }) {
    checkFileExists(remote).then(res => {
      if (!res) {
        return new Error("File doesn't exists");
      }
      return fs.createWriteStream(`${containerName}/${remote}`);
    });
  }

  download({
    containerName,
    remote,
  }: {
    containerName: string;
    remote: string;
  }) {
    checkFileExists(remote).then(res => {
      if (!res) {
        return new Error("File doesn't exists");
      }
      return fs.createReadStream(remote);
    });
  }
}

export class storage {
  static createClient(params: OpenstackProviderOptions) {
    return new PkgCloudStorageClient();
  }
}
