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
import path from 'node:path';
import { readGeneratorConfig, TechdocsGenerator } from './techdocs';
import { getMkdocsYml, runCommand } from './helpers';
import { sanitizeMkdocsYml } from './mkdocsPatchers';
import { KubernetesJobRunner } from './KubernetesJobRunner';

jest.mock('fs-extra');
jest.mock('./helpers');
jest.mock('./mkdocsPatchers');
jest.mock('./KubernetesJobRunner');

const mockLogger = {
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
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

  it('should read pull options config', () => {
    const pullOptions = {
      authconfig: {
        username: 'user',
        password: 'pass',
      },
    };

    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          pullOptions,
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      pullOptions,
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

  it('should read the additional plugins config', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          mkdocs: {
            dangerouslyAllowAdditionalPlugins: ['mkdocs-custom-plugin'],
          },
        },
      },
    });

    expect(readGeneratorConfig(config, logger)).toEqual({
      runIn: 'docker',
      dockerImage: undefined,
      pullImage: undefined,
      omitTechdocsCoreMkdocsPlugin: undefined,
      legacyCopyReadmeMdToIndexMd: undefined,
      defaultPlugins: undefined,
      dangerouslyAllowAdditionalKeys: undefined,
      dangerouslyAllowAdditionalPlugins: ['mkdocs-custom-plugin'],
      disableExternalFonts: undefined,
    });
  });
});

describe('TechdocsGenerator.run', () => {
  const inputDir = '/var/folders/inputDir';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(getMkdocsYml).mockResolvedValue({
      path: `${inputDir}/mkdocs.yaml`,
      content: 'site_name: Test',
      configIsTemporary: false,
    });
  });

  it('passes -f with the config path relative to the working directory in local mode', async () => {
    jest.mocked(getMkdocsYml).mockResolvedValueOnce({
      path: `${inputDir}/config/mkdocs.yaml`,
      content: 'site_name: Test',
      configIsTemporary: false,
    });

    const generator = TechdocsGenerator.fromConfig(
      new ConfigReader({ techdocs: { generator: { runIn: 'local' } } }),
      { logger: mockLogger as any },
    );

    await generator.run({
      inputDir,
      outputDir: '/tmp/outputDir',
      logger: mockLogger as any,
    });

    expect(jest.mocked(runCommand)).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'mkdocs',
        args: expect.arrayContaining([
          '-f',
          path.join('config', 'mkdocs.yaml'),
        ]),
        options: { cwd: inputDir },
      }),
    );
  });

  it('permits plugins configured as defaults during sanitization', async () => {
    const generator = TechdocsGenerator.fromConfig(
      new ConfigReader({
        techdocs: {
          generator: {
            runIn: 'local',
            mkdocs: {
              defaultPlugins: ['default-plugin'],
              dangerouslyAllowAdditionalPlugins: ['additional-plugin'],
            },
          },
        },
      }),
      { logger: mockLogger as any },
    );

    await generator.run({
      inputDir,
      outputDir: '/tmp/outputDir',
      logger: mockLogger as any,
    });

    expect(jest.mocked(sanitizeMkdocsYml)).toHaveBeenCalledWith(
      `${inputDir}/mkdocs.yaml`,
      mockLogger,
      undefined,
      ['additional-plugin', 'default-plugin'],
    );
  });

  it('passes -f with the container-relative config path in docker mode', async () => {
    const containerRunner = { runContainer: jest.fn() };
    const generator = new TechdocsGenerator({
      logger: mockLogger as any,
      containerRunner,
      config: new ConfigReader({
        techdocs: { generator: { runIn: 'docker' } },
      }),
      scmIntegrations: { list: () => [] } as any,
    });

    await generator.run({
      inputDir,
      outputDir: '/tmp/outputDir',
      logger: mockLogger as any,
    });

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        args: expect.arrayContaining(['-f', '/input/mkdocs.yaml']),
      }),
    );
  });

  it('runs the build through a Kubernetes Job runner in kubernetes mode', async () => {
    const kubernetes = {
      namespace: 'backstage',
      volumeClaimName: 'techdocs-work',
      workRoot: '/var/backstage/work',
      nodeName: 'node-1',
      nodeAffinity: 'required',
    };
    const config = new ConfigReader({
      techdocs: { generator: { runIn: 'kubernetes', kubernetes } },
    });
    expect(readGeneratorConfig(config, mockLogger as any).kubernetes).toEqual(
      kubernetes,
    );

    const generator = TechdocsGenerator.fromConfig(config, {
      logger: mockLogger as any,
    });
    expect(KubernetesJobRunner).toHaveBeenCalledWith(kubernetes, mockLogger);

    await generator.run({
      inputDir,
      outputDir: '/tmp/outputDir',
      logger: mockLogger as any,
    });
    const runner = jest.mocked(KubernetesJobRunner).mock.instances[0];
    expect(runner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName: TechdocsGenerator.defaultDockerImage,
        args: expect.arrayContaining(['-f', '/input/mkdocs.yaml']),
        mountDirs: { [inputDir]: '/input', '/tmp/outputDir': '/output' },
      }),
    );

    expect(() =>
      TechdocsGenerator.fromConfig(
        new ConfigReader({ techdocs: { generator: { runIn: 'kubernetes' } } }),
        { logger: mockLogger as any },
      ),
    ).toThrow(
      `'techdocs.generator.kubernetes' must be configured when 'techdocs.generator.runIn' is 'kubernetes'`,
    );
  });

  it('validates the kubernetes config when the generator is created', () => {
    const generatorWith = (generator: object) =>
      TechdocsGenerator.fromConfig(
        new ConfigReader({ techdocs: { generator } }),
        { logger: mockLogger as any },
      );
    const valid = { volumeClaimName: 'techdocs-work', workRoot: '/work' };

    expect(() =>
      generatorWith({
        runIn: 'kubernetes',
        kubernetes: { volumeClaimName: 'techdocs-work' },
      }),
    ).toThrow(
      "Missing required config value at 'techdocs.generator.kubernetes.workRoot'",
    );
    expect(() =>
      generatorWith({
        runIn: 'kubernetes',
        kubernetes: { ...valid, nodeAffinity: 'Required' },
      }),
    ).toThrow(
      `Invalid config value "Required" provided in 'techdocs.generator.kubernetes.nodeAffinity', expected one of preferred, required, none`,
    );
    expect(() =>
      generatorWith({
        runIn: 'kubernetes',
        kubernetes: { ...valid, activeDeadlineSeconds: 'soon' },
      }),
    ).toThrow(/activeDeadlineSeconds/);

    expect(
      readGeneratorConfig(
        new ConfigReader({
          techdocs: {
            generator: {
              runIn: 'kubernetes',
              kubernetes: {
                ...valid,
                activeDeadlineSeconds: '1200',
                resources: { requests: { cpu: '250m' } },
              },
            },
          },
        }),
        mockLogger as any,
      ).kubernetes,
    ).toEqual({
      ...valid,
      activeDeadlineSeconds: 1200,
      resources: { requests: { cpu: '250m' } },
    });

    expect(() =>
      generatorWith({ runIn: 'docker', kubernetes: { nodeAffinity: 'bad' } }),
    ).not.toThrow();
  });
});
