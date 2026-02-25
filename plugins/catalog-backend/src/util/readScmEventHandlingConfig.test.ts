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

import { ConfigReader } from '@backstage/config';
import { readScmEventHandlingConfig } from './readScmEventHandlingConfig';

describe('readScmEventHandlingConfig', () => {
  it('returns defaults when catalog.scmEvents is not set', () => {
    const config = new ConfigReader({});

    expect(readScmEventHandlingConfig(config)).toEqual({
      refresh: false,
      unregister: false,
      move: false,
    });
  });

  it('returns defaults when catalog.scmEvents is true', () => {
    const config = new ConfigReader({
      catalog: {
        scmEvents: true,
      },
    });

    expect(readScmEventHandlingConfig(config)).toEqual({
      refresh: true,
      unregister: true,
      move: true,
    });
  });

  it('returns all disabled when catalog.scmEvents is false', () => {
    const config = new ConfigReader({
      catalog: {
        scmEvents: false,
      },
    });

    expect(readScmEventHandlingConfig(config)).toEqual({
      refresh: false,
      unregister: false,
      move: false,
    });
  });

  it('merges partial config with defaults', () => {
    const config = new ConfigReader({
      catalog: {
        scmEvents: {
          refresh: false,
        },
      },
    });

    expect(readScmEventHandlingConfig(config)).toEqual({
      refresh: false,
      unregister: true,
      move: true,
    });
  });

  it('allows disabling individual options', () => {
    const config = new ConfigReader({
      catalog: {
        scmEvents: {
          refresh: true,
          unregister: false,
          move: false,
        },
      },
    });

    expect(readScmEventHandlingConfig(config)).toEqual({
      refresh: true,
      unregister: false,
      move: false,
    });
  });

  it('allows enabling all options explicitly', () => {
    const config = new ConfigReader({
      catalog: {
        scmEvents: {
          refresh: true,
          unregister: true,
          move: true,
        },
      },
    });

    expect(readScmEventHandlingConfig(config)).toEqual({
      refresh: true,
      unregister: true,
      move: true,
    });
  });
});
