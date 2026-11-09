/*
 * Copyright 2026 The Backstage Authors
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

import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'node:path';
import { MKDOCS_SCHEMA } from '@backstage/plugin-techdocs-node/alpha';
import type { GeneratorRunOptions } from '@backstage/plugin-techdocs-node';
import { TechdocsZensicalGenerator } from './TechdocsZensicalGenerator';

const mockRunCommand = jest.fn();
jest.mock('@backstage/plugin-techdocs-node/alpha', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-node/alpha'),
  runCommand: (...args: unknown[]) => mockRunCommand(...args),
}));

describe('TechdocsZensicalGenerator', () => {
  const mockDir = createMockDirectory();
  const logger = mockServices.logger.mock();

  afterEach(mockDir.clear);

  // Stands in for the Zensical container: reads the patched config at the
  // path it was given (with /input mounted from the input dir) and writes a
  // minimal site into site_dir, resolved against the config's directory.
  const containerRunner = {
    runContainer: jest.fn(async ({ args }: { args: string[] }) => {
      const configFile = mockDir.resolve(
        'input',
        path.posix.relative('/input', args[args.indexOf('-f') + 1]),
      );
      const config = yaml.load(await fs.readFile(configFile, 'utf8'), {
        schema: MKDOCS_SCHEMA,
      }) as { site_dir: string };
      const siteDir = path.join(path.dirname(configFile), config.site_dir);
      await fs.outputFile(path.join(siteDir, 'index.html'), '<html></html>');
      await fs.outputJson(path.join(siteDir, 'search.json'), { items: [] });
    }),
  };

  async function generate(
    generatorConfig: object,
    input: Record<string, unknown> = {
      'mkdocs.yml': 'site_name: Test\n',
      docs: { 'index.md': '# Hello\n' },
    },
    siteOptions?: { mkdocsConfigFileName?: string },
  ) {
    mockDir.setContent({ input } as any);
    const generator = TechdocsZensicalGenerator.fromConfig(
      new ConfigReader({ techdocs: { generator: generatorConfig } }),
      { logger, containerRunner },
    );
    await generator.run({
      inputDir: mockDir.resolve('input'),
      outputDir: mockDir.resolve('output'),
      // GeneratorRunOptions.siteOptions only declares `name` today, but
      // getMkdocsYml also honors mkdocsConfigFileName.
      siteOptions: siteOptions as GeneratorRunOptions['siteOptions'],
      // GeneratorRunOptions takes a winston Logger; the mock covers what's used.
      logger: logger as any,
    });
    return containerRunner.runContainer.mock.calls[0][0] as Record<
      string,
      unknown
    >;
  }

  beforeEach(() => containerRunner.runContainer.mockClear());

  it('runs the zensical entrypoint in the default image', async () => {
    const options = await generate({});
    expect(options.imageName).toBe(
      TechdocsZensicalGenerator.defaultDockerImage,
    );
    expect(options.command).toEqual(['zensical']);
    expect(options.args).toEqual(expect.arrayContaining(['build', '-f']));
  });

  it('does not fall back to the MkDocs docker image', async () => {
    const options = await generate({ dockerImage: 'acme/custom-mkdocs:1.0' });
    expect(options.imageName).toBe(
      TechdocsZensicalGenerator.defaultDockerImage,
    );
  });

  it('uses the Zensical docker image when configured', async () => {
    const options = await generate({
      dockerImage: 'acme/custom-mkdocs:1.0',
      zensical: { dockerImage: 'acme/custom-zensical:1.0' },
    });
    expect(options.imageName).toBe('acme/custom-zensical:1.0');
    expect(options.command).toEqual(['zensical']);
  });

  it('builds a config in a subdirectory of the input dir', async () => {
    const options = await generate(
      {},
      {
        sub: {
          'mkdocs.yml': 'site_name: Test\n',
          docs: { 'index.md': '# Hello\n' },
        },
      },
      { mkdocsConfigFileName: 'sub/mkdocs.yml' },
    );
    expect(options.args).toEqual([
      'build',
      '-f',
      expect.stringMatching(/^\/input\/sub\/\.mkdocs\.zensical-.*\.yml$/),
    ]);
    await expect(
      fs.pathExists(mockDir.resolve('output', 'index.html')),
    ).resolves.toBe(true);
    await expect(fs.readdir(mockDir.resolve('input', 'sub'))).resolves.toEqual(
      expect.not.arrayContaining([expect.stringMatching(/^\.techdocs-/)]),
    );
  });

  it('writes the site and tags it with the zensical engine', async () => {
    await generate({});
    await expect(
      fs.pathExists(mockDir.resolve('output', 'index.html')),
    ).resolves.toBe(true);
    await expect(
      fs.readJson(mockDir.resolve('output', 'techdocs_metadata.json')),
    ).resolves.toEqual(expect.objectContaining({ engine: 'zensical' }));
    await expect(
      fs.readFile(mockDir.resolve('input', 'mkdocs.yml'), 'utf8'),
    ).resolves.toBe('site_name: Test\n');
  });
});

describe('TechdocsZensicalGenerator (local)', () => {
  const mockDir = createMockDirectory();
  const logger = mockServices.logger.mock();

  afterEach(() => {
    mockDir.clear();
    mockRunCommand.mockReset();
  });

  // Stands in for the local zensical binary, like the container runner above.
  async function fakeZensicalBuild({
    args,
    options,
  }: {
    args: string[];
    options: { cwd: string };
  }) {
    const configFile = args[args.indexOf('-f') + 1];
    const config = yaml.load(await fs.readFile(configFile, 'utf8'), {
      schema: MKDOCS_SCHEMA,
    }) as { site_dir: string };
    await fs.outputFile(
      path.join(options.cwd, config.site_dir, 'index.html'),
      '<html></html>',
    );
  }

  function createGenerator() {
    mockDir.setContent({
      input: {
        'mkdocs.yml': 'site_name: Test\n',
        docs: { 'index.md': '# Hello\n' },
      },
    });
    return TechdocsZensicalGenerator.fromConfig(
      new ConfigReader({ techdocs: { generator: { runIn: 'local' } } }),
      { logger },
    );
  }

  const runOptions = () => ({
    inputDir: mockDir.resolve('input'),
    outputDir: mockDir.resolve('output'),
    // GeneratorRunOptions takes a winston Logger; the mock covers what's used.
    logger: logger as any,
  });

  it('runs the local zensical binary in the input directory', async () => {
    mockRunCommand.mockImplementation(fakeZensicalBuild);

    await createGenerator().run(runOptions());

    expect(mockRunCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'zensical',
        args: ['build', '-f', expect.stringContaining('.mkdocs.zensical-')],
        options: {
          cwd: mockDir.resolve('input'),
          env: {
            NODE_ENV: process.env.NODE_ENV,
            PATH: process.env.PATH,
            HOME: process.env.HOME,
          },
        },
      }),
    );
    await expect(
      fs.pathExists(mockDir.resolve('output', 'index.html')),
    ).resolves.toBe(true);
  });

  it('does not pass the backend environment to zensical', async () => {
    mockRunCommand.mockImplementation(fakeZensicalBuild);
    process.env.TECHDOCS_TEST_SECRET = 'hunter2';

    try {
      await createGenerator().run(runOptions());
    } finally {
      delete process.env.TECHDOCS_TEST_SECRET;
    }

    const { env } = mockRunCommand.mock.calls[0][0].options;
    expect(env).not.toHaveProperty('TECHDOCS_TEST_SECRET');
  });

  it('cleans up the temporary config and site on failure', async () => {
    mockRunCommand.mockRejectedValue(new Error('zensical exploded'));

    await expect(createGenerator().run(runOptions())).rejects.toThrow(
      /Failed to generate docs .*zensical exploded/,
    );

    const leftovers = await fs.readdir(mockDir.resolve('input'));
    expect(leftovers.sort()).toEqual(['docs', 'mkdocs.yml']);
  });
});
