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

import { ConfigReader } from '@backstage/config';
import { readGeneratorConfig } from './techdocs';

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
});
