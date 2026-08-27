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

import { ConfigReader } from '@backstage/config';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { readGeneratorConfig, createSourceExcludeFilter } from './techdocs';

const mockLogger = {
  warn: jest.fn(),
};

describe('readGeneratorConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const logger = mockLogger as any;

  it('defaults to runIn docker', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {},
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      dockerImage: undefined,
      pullImage: undefined,
    });
  });

  it('should read local config', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'local',
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'local',
    });
  });

  it('should read docker config', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
    });
  });

  it('should read custom docker image', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          dockerImage: 'my-org/techdocs',
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      dockerImage: 'my-org/techdocs',
    });
  });

  it('should read config disabling docker pull', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          dockerImage: 'my-org/techdocs',
          pullImage: false,
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      dockerImage: 'my-org/techdocs',
      pullImage: false,
    });
  });

  describe('with legacy techdocs.generators.techdocs config', () => {
    it('should read legacy docker option', () => {
      const config = new ConfigReader({
        techdocs: {
          generators: {
            techdocs: 'docker',
          },
        },
      });

      expect(readGeneratorConfig(config, logger)).toEqual({
        runIn: 'docker',
      });
    });

    it('legacy option should log warning', () => {
      const config = new ConfigReader({
        techdocs: {
          generators: {
            techdocs: 'local',
          },
        },
      });

      expect(readGeneratorConfig(config, logger)).toEqual({
        runIn: 'local',
      });
      expect(logger.warn).toHaveBeenCalledWith(
        `The 'techdocs.generators.techdocs' configuration key is deprecated and will be removed in the future. Please use 'techdocs.generator' instead. ` +
          `See here https://backstage.io/docs/features/techdocs/configuration`,
      );
    });
  });

  it('should read legacyCopyReadmeMdToIndexMd config', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          dockerImage: 'my-org/techdocs',
          pullImage: false,
          mkdocs: { legacyCopyReadmeMdToIndexMd: true },
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      dockerImage: 'my-org/techdocs',
      pullImage: false,
      legacyCopyReadmeMdToIndexMd: true,
    });
  });

  it('should read the default plugins config', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          dockerImage: 'my-org/techdocs',
          pullImage: false,
          mkdocs: { defaultPlugins: ['mkdocs-custom-plugin'] },
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      dockerImage: 'my-org/techdocs',
      pullImage: false,
      defaultPlugins: ['mkdocs-custom-plugin'],
    });
  });
});

describe('createSourceExcludeFilter', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'techdocs-filter-'));
    await fs.ensureDir(path.join(tmpDir, '.git'));
    await fs.ensureDir(path.join(tmpDir, 'node_modules'));
    await fs.ensureDir(path.join(tmpDir, '__pycache__'));
    await fs.ensureDir(path.join(tmpDir, '.venv'));
    await fs.writeFile(path.join(tmpDir, 'module.pyc'), '');
    await fs.writeFile(path.join(tmpDir, 'index.md'), '');
    await fs.writeFile(path.join(tmpDir, 'guide.md'), '');
    await fs.writeFile(path.join(tmpDir, 'mkdocs.yml'), '');
    await fs.writeFile(path.join(tmpDir, 'diagram.png'), '');
    await fs.writeFile(path.join(tmpDir, 'photo.jpg'), '');
    await fs.writeFile(path.join(tmpDir, 'icon.svg'), '');
    await fs.ensureDir(path.join(tmpDir, 'build'));
    await fs.ensureDir(path.join(tmpDir, 'docs'));
    await fs.writeFile(path.join(tmpDir, 'real-target.md'), '');
    await fs.symlink(
      path.join(tmpDir, 'real-target.md'),
      path.join(tmpDir, 'symlinked.md'),
    );
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('should exclude built-in patterns by default', () => {
    const filter = createSourceExcludeFilter();

    expect(filter(path.join(tmpDir, '.git'))).toBe(false);
    expect(filter(path.join(tmpDir, 'node_modules'))).toBe(false);
    expect(filter(path.join(tmpDir, '__pycache__'))).toBe(false);
    expect(filter(path.join(tmpDir, '.venv'))).toBe(false);
    expect(filter(path.join(tmpDir, 'module.pyc'))).toBe(false);
  });

  it('should allow non-excluded files', () => {
    const filter = createSourceExcludeFilter();

    expect(filter(path.join(tmpDir, 'index.md'))).toBe(true);
    expect(filter(path.join(tmpDir, 'guide.md'))).toBe(true);
    expect(filter(path.join(tmpDir, 'mkdocs.yml'))).toBe(true);
    expect(filter(path.join(tmpDir, 'diagram.png'))).toBe(true);
  });

  it('should apply custom extension excludes', () => {
    const filter = createSourceExcludeFilter(['*.png', '*.jpg']);

    expect(filter(path.join(tmpDir, 'diagram.png'))).toBe(false);
    expect(filter(path.join(tmpDir, 'photo.jpg'))).toBe(false);
    expect(filter(path.join(tmpDir, 'index.md'))).toBe(true);
  });

  it('should apply custom directory excludes', () => {
    const filter = createSourceExcludeFilter(['build']);

    expect(filter(path.join(tmpDir, 'build'))).toBe(false);
    expect(filter(path.join(tmpDir, 'docs'))).toBe(true);
  });

  it('should combine built-in and custom excludes', () => {
    const filter = createSourceExcludeFilter(['*.svg']);

    expect(filter(path.join(tmpDir, '.git'))).toBe(false);
    expect(filter(path.join(tmpDir, 'icon.svg'))).toBe(false);
    expect(filter(path.join(tmpDir, 'index.md'))).toBe(true);
  });

  it('should exclude symbolic links', () => {
    const filter = createSourceExcludeFilter();

    expect(filter(path.join(tmpDir, 'symlinked.md'))).toBe(false);
    expect(filter(path.join(tmpDir, 'real-target.md'))).toBe(true);
  });

  it('should return false for paths that do not exist', () => {
    const filter = createSourceExcludeFilter();

    expect(filter('/nonexistent/path/file.md')).toBe(false);
  });
});
