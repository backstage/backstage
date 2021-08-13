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
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import {
  ContainerMetaResponse,
  DownloadResponse,
  NotFound,
  ObjectMetaResponse,
  UploadResponse,
} from '@trendyol-js/openstack-swift-sdk';
import { Stream, Readable } from 'stream';

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const checkFileExists = async (Key: string): Promise<boolean> => {
  // Key will always have / as file separator irrespective of OS since cloud providers expects /.
  // Normalize Key to OS specific path before checking if file exists.
  const filePath = path.join(rootDir, Key);

  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const streamToBuffer = (stream: Stream | Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const chunks: any[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    } catch (e) {
      throw new Error(`Unable to parse the response data ${e.message}`);
    }
  });
};

export class SwiftClient {
  async getMetadata(_containerName: string, file: string) {
    const fileExists = await checkFileExists(file);
    if (fileExists) {
      return new ObjectMetaResponse({
        fullPath: file,
      });
    }
    return new NotFound();
  }

  async getContainerMetadata(containerName: string) {
    if (containerName === 'mock') {
      return new ContainerMetaResponse({
        size: 10,
      });
    }
    return new NotFound();
  }

  async upload(_containerName: string, destination: string, stream: Readable) {
    try {
      const filePath = path.join(rootDir, destination);
      const fileBuffer = await streamToBuffer(stream);

      fs.writeFileSync(filePath, fileBuffer);
      const fileExists = await checkFileExists(destination);

      if (fileExists) {
        return new UploadResponse(filePath);
      }
      const errorMessage = `Unable to upload file(s) to OpenStack Swift.`;
      throw new Error(errorMessage);
    } catch (error) {
      const errorMessage = `Unable to upload file(s) to OpenStack Swift. ${error}`;
      throw new Error(errorMessage);
    }
  }

  async download(_containerName: string, file: string) {
    const filePath = path.join(rootDir, file);
    const fileExists = await checkFileExists(file);
    if (!fileExists) {
      return new NotFound();
    }
    return new DownloadResponse([], fs.createReadStream(filePath));
  }
}
