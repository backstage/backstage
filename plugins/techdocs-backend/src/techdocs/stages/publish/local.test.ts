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
import { LocalPublish } from './local';
import fs from 'fs-extra';
import path from 'path';

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
};

describe('local publisher', () => {
  it('should publish generated documentation dir', async () => {
    const publisher = new LocalPublish();

    const mockEntity = createMockEntity();

    const tempDir = fs.mkdtempSync(`${__dirname}/test-component-folder-`);

    expect(tempDir).toBeTruthy();

    fs.closeSync(fs.openSync(path.join(tempDir, '/mock-file'), 'w'));

    await publisher.publish({ entity: mockEntity, directory: tempDir });
    const publishDir = path.resolve(
      __dirname,
      `../../../../static/docs/${mockEntity.metadata.name}`,
    );

    expect(fs.existsSync(publishDir)).toBeTruthy();
    expect(fs.existsSync(path.join(publishDir, '/mock-file'))).toBeTruthy();

    fs.removeSync(publishDir);
    fs.removeSync(tempDir);
  });
});
