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
import {
  TechdocsZensicalGenerator,
  readZensicalGeneratorConfig,
} from './techdocsZensicalGenerator';

const mockLogger = {
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  child: jest.fn().mockReturnThis(),
};

describe('readZensicalGeneratorConfig', () => {
  it('defaults to runIn docker and type techdocs-zensical', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {},
      },
    });

    expect(readZensicalGeneratorConfig(config)).toEqual({
      type: 'techdocs-zensical',
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

    expect(readZensicalGeneratorConfig(config)).toEqual({
      type: 'techdocs-zensical',
      runIn: 'local',
    });
  });

  it('should read docker config with custom image', () => {
    const config = new ConfigReader({
      techdocs: {
        generator: {
          runIn: 'docker',
          dockerImage: 'my-org/techdocs-zensical:v2',
          pullImage: false,
        },
      },
    });

    expect(readZensicalGeneratorConfig(config)).toEqual({
      type: 'techdocs-zensical',
      runIn: 'docker',
      dockerImage: 'my-org/techdocs-zensical:v2',
      pullImage: false,
    });
  });
});

describe('TechdocsZensicalGenerator', () => {
  describe('fromConfig', () => {
    it('should create a generator instance', () => {
      const config = new ConfigReader({
        techdocs: {
          generator: {
            runIn: 'docker',
          },
        },
      });

      const generator = TechdocsZensicalGenerator.fromConfig(config, {
        logger: mockLogger as any,
      });

      expect(generator).toBeInstanceOf(TechdocsZensicalGenerator);
    });
  });

  describe('defaultDockerImage', () => {
    it('should have the correct default docker image', () => {
      expect(TechdocsZensicalGenerator.defaultDockerImage).toBe(
        'spotify/techdocs-zensical:latest',
      );
    });
  });
});
