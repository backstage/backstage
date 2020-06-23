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
import { CookieCutter } from './cookiecutter';
import fs from 'fs-extra';
import os from 'os';
import Stream, { PassThrough } from 'stream';

const mockDocker = {
  run: jest.fn<any, any>(() => [{ Error: null, StatusCode: 0 }]),
};
jest.mock(
  'dockerode',
  () =>
    class {
      constructor() {
        return mockDocker;
      }
    },
);

describe('CookieCutter Templater', () => {
  const cookie = new CookieCutter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write a cookiecutter.json file with the values from the entitiy', async () => {
    const tempdir = os.tmpdir();

    const values = {
      component_id: 'test',
      description: 'description',
    };

    await cookie.run({ directory: tempdir, values });

    const cookieCutterJson = await fs.readJSON(`${tempdir}/cookiecutter.json`);

    expect(cookieCutterJson).toEqual(expect.objectContaining(values));
  });

  it('should merge any value that is in the cookiecutter.json path already', async () => {
    const tempdir = os.tmpdir();
    const existingJson = {
      _copy_without_render: ['./github/workflows/*'],
    };
    await fs.writeJSON(`${tempdir}/cookiecutter.json`, existingJson);

    const values = {
      component_id: 'hello',
      description: 'im something cool',
    };

    await cookie.run({ directory: tempdir, values });

    const cookieCutterJson = await fs.readJSON(`${tempdir}/cookiecutter.json`);

    expect(cookieCutterJson).toEqual({ ...existingJson, ...values });
  });

  it('should run the correct docker container with the correct bindings for the volumes', async () => {
    const tempdir = os.tmpdir();

    const values = {
      component_id: 'test',
      description: 'description',
    };

    await cookie.run({ directory: tempdir, values });

    const realpath = await fs.realpath(tempdir);

    // TODO(blam): This might change when we publish our own cookiecutter image
    // to @backstage/cookiecutter in docker hub.
    expect(mockDocker.run).toHaveBeenCalledWith(
      'backstage/cookiecutter',
      ['cookiecutter', '--no-input', '-o', '/result', '/template'],
      expect.any(Stream),
      expect.objectContaining({
        HostConfig: {
          Binds: expect.arrayContaining([
            `${realpath}:/template`,
            `${realpath}/result:/result`,
          ]),
        },
        Volumes: {
          '/template': {},
          '/result': {},
        },
      }),
    );
  });

  it('should return the result path to the end templated folder', async () => {
    const tempdir = os.tmpdir();

    const values = {
      component_id: 'test',
      description: 'description',
    };

    const path = await cookie.run({ directory: tempdir, values });

    const realpath = await fs.realpath(tempdir);

    expect(path).toBe(`${realpath}/result`);
  });

  it('throws a correct error if the templating fails in docker', async () => {
    mockDocker.run.mockResolvedValueOnce([
      {
        Error: new Error('Something went wrong with docker'),
        StatusCode: 0,
      },
    ]);

    const tempdir = os.tmpdir();

    const values = {
      component_id: 'test',
      description: 'description',
    };

    await expect(cookie.run({ directory: tempdir, values })).rejects.toThrow(
      /Something went wrong with docker/,
    );
  });

  it('uses the passed stream as a log stream', async () => {
    const logStream = new PassThrough();
    const tempdir = os.tmpdir();

    const values = {
      component_id: 'test',
      description: 'description',
    };

    await cookie.run({ directory: tempdir, values, logStream });

    expect(mockDocker.run).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
      logStream,
      expect.any(Object),
    );
  });

  it('throws a correct error if the container returns a non-zero exit code', async () => {
    mockDocker.run.mockResolvedValueOnce([
      {
        Error: null,
        StatusCode: 1,
      },
    ]);

    const tempdir = os.tmpdir();

    const values = {
      component_id: 'test',
      description: 'description',
    };

    await expect(cookie.run({ directory: tempdir, values })).rejects.toThrow(
      /Docker container returned a non-zero exit code \(1\)/,
    );
  });
});
