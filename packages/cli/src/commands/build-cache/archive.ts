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
import tar from 'tar';
import { dirname } from 'path';

export async function readFileFromArchive(
  archivePath: string,
  filePath: string,
): Promise<Buffer> {
  const reader = fs.createReadStream(archivePath);
  const parser = new ((tar.Parse as unknown) as { new (): tar.ParseStream })();

  const fileEntry = await new Promise<tar.ReadEntry>((resolve, reject) => {
    parser.on('entry', entry => {
      if (entry.path === `./${filePath}`) {
        resolve(entry);
        reader.close();
      } else {
        entry.resume();
      }
    });
    parser.on('end', () => {
      reject(new Error('cache archive did not contain build info'));
    });
    parser.on('error', error => reject(error));
    reader.on('error', error => reject(error));

    reader.pipe(parser);
  });

  const data = await new Promise<Buffer>((resolve, reject) => {
    const chunks = new Array<Buffer>();
    fileEntry.on('data', chunk => chunks.push(chunk));
    fileEntry.on('end', () => resolve(Buffer.concat(chunks)));
    fileEntry.on('error', error => reject(error));
  });

  return data;
}

// packages all files in inputDir into an archive at archivePath, deleting any existing archive
export async function createArchive(
  archivePath: string,
  inputDir: string,
): Promise<void> {
  await fs.remove(archivePath);
  await fs.ensureDir(dirname(archivePath));
  await tar.create({ gzip: true, file: archivePath, cwd: inputDir }, ['.']);
}

// extracts archive at archive path into outputDir, deleting any existing files at outputDir
export async function extractArchive(
  archivePath: string,
  outputDir: string,
): Promise<void> {
  await fs.remove(outputDir);
  await fs.ensureDir(outputDir);
  await tar.extract({ file: archivePath, cwd: outputDir });
}
