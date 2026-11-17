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

import { type JsonObject, ConfigReader } from '@backstage/config';
import { parseAiServiceConfig } from './config';

const PLUGIN_ID = 'catalog-assistant';

function parse(data: JsonObject, path = 'assistant') {
  return parseAiServiceConfig(
    { root: new ConfigReader(data), path },
    PLUGIN_ID,
  );
}

describe('parseAiServiceConfig', () => {
  it('parses a complete service-mode configuration', () => {
    expect(
      parse({
        assistant: {
          mode: 'service',
          model: { provider: 'acme', modelId: 'acme-large' },
          thinkingLevel: 'high',
        },
      }),
    ).toEqual({
      mode: 'service',
      model: { provider: 'acme', modelId: 'acme-large' },
      thinkingLevel: 'high',
    });
  });

  it('parses an interactive-mode configuration without a model', () => {
    expect(parse({ assistant: { mode: 'interactive' } })).toEqual({
      mode: 'interactive',
    });
  });

  it('reports the plugin, path, and correction for a missing section', () => {
    expect(() => parse({})).toThrow(
      /'catalog-assistant' plugin.*no configuration found at 'assistant'.*mode: service/s,
    );
  });

  it('reports an invalid mode', () => {
    expect(() => parse({ assistant: { mode: 'daemon' } })).toThrow(
      /'catalog-assistant' plugin.*at 'assistant'.*'mode'.*'service' or 'interactive'.*'daemon'/s,
    );
  });

  it('reports a missing mode', () => {
    expect(() => parse({ assistant: {} })).toThrow(
      /'catalog-assistant' plugin.*at 'assistant'.*'mode' is missing/s,
    );
  });

  it('reports a half-specified model', () => {
    expect(() =>
      parse({
        assistant: {
          mode: 'interactive',
          model: { provider: 'acme' },
        },
      }),
    ).toThrow(
      /'catalog-assistant' plugin.*at 'assistant.model'.*'modelId'.*'model.provider' and 'model.modelId' must both be set/s,
    );
  });

  it('reports an empty model section', () => {
    expect(() =>
      parse({ assistant: { mode: 'interactive', model: {} } }),
    ).toThrow(/'assistant.model'.*'model.provider' and 'model.modelId'/s);
  });

  it('reports service mode without a model', () => {
    expect(() => parse({ assistant: { mode: 'service' } })).toThrow(
      /'catalog-assistant' plugin.*'mode: service' requires 'model.provider' and 'model.modelId'/s,
    );
  });

  it('reports an invalid thinking level', () => {
    expect(() =>
      parse({
        assistant: {
          mode: 'interactive',
          thinkingLevel: 'extreme',
        },
      }),
    ).toThrow(
      /'catalog-assistant' plugin.*at 'assistant'.*'thinkingLevel'.*'off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'.*'extreme'/s,
    );
  });

  it('reports unknown fields at the section and model levels', () => {
    expect(() =>
      parse({ assistant: { mode: 'interactive', persona: 'friendly' } }),
    ).toThrow(
      /'assistant'.*'persona' is not part of the AI configuration schema/s,
    );
    expect(() =>
      parse({
        assistant: {
          mode: 'interactive',
          model: { provider: 'a', modelId: 'b', region: 'eu' },
        },
      }),
    ).toThrow(
      /'assistant.model'.*'region' is not part of the AI configuration schema/s,
    );
  });
});
