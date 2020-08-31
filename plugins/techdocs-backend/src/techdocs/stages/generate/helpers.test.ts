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
import Stream, { PassThrough } from 'stream';
import os from 'os';
import Docker from 'dockerode';
import { runDockerContainer, getGeneratorKey } from './helpers';

const mockEntity = {
  apiVersion: 'version',
  kind: 'TestKind',
  metadata: {
    name: 'testName',
  },
};

const mockDocker = new Docker() as jest.Mocked<Docker>;

describe('helpers', () => {
  describe('getGeneratorKey', () => {
    it('should return techdocs as the only generator key', () => {
      const key = getGeneratorKey(mockEntity);
      expect(key).toBe('techdocs');
    });
  });

  describe('runDockerContainer', () => {
    beforeEach(() => {
      jest.spyOn(mockDocker, 'pull').mockImplementation((async (
        _image: string,
        _something: any,
        handler: (err: Error | undefined, stream: PassThrough) => void,
      ) => {
        const mockStream = new PassThrough();
        handler(undefined, mockStream);
        mockStream.end();
      }) as any);

      jest
        .spyOn(mockDocker, 'run')
        .mockResolvedValue([{ Error: null, StatusCode: 0 }]);
    });

    const imageName = 'spotify/techdocs';
    const args = ['build', '-d', '/result'];
    const docsDir = os.tmpdir();
    const resultDir = os.tmpdir();

    it('should pull the techdocs docker container', async () => {
      await runDockerContainer({
        imageName,
        args,
        docsDir,
        resultDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.pull).toHaveBeenCalledWith(
        imageName,
        {},
        expect.any(Function),
      );
    });

    it('should run the techdocs docker container', async () => {
      await runDockerContainer({
        imageName,
        args,
        docsDir,
        resultDir,
        dockerClient: mockDocker,
      });

      expect(mockDocker.run).toHaveBeenCalledWith(
        imageName,
        args,
        expect.any(Stream),
        {
          Volumes: {
            '/content': {},
            '/result': {},
          },
          WorkingDir: '/content',
          HostConfig: {
            Binds: [`${docsDir}:/content`, `${resultDir}:/result`],
          },
        },
      );
    });
  });
});
