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
import { TechdocsZensicalGenerator } from '@backstage/plugin-techdocs-backend-module-zensical';
import { getEngineConfig } from './registry';

describe('getEngineConfig', () => {
  it('should return mkdocs config by default', () => {
    const config = getEngineConfig('mkdocs');
    expect(config.binary).toBe('mkdocs');
    expect(config.defaultImage).toBe('spotify/techdocs');
    expect(config.serveCommand).toBe('serve');
    expect(config.startupLogPattern).toBe('Serving on');
  });

  it('should return mkdocs build args with -d flag', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.buildArgs('/output', '/input/mkdocs.yml');
    expect(args).toEqual([
      'build',
      '-f',
      '/input/mkdocs.yml',
      '-d',
      '/output',
      '-v',
    ]);
  });

  it('should return mkdocs serve args for local mode', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.serveArgs('8000', {});
    expect(args).toContain('serve');
    expect(args).toContain('--dev-addr');
    expect(args).toContain('127.0.0.1:8000');
    expect(args).toContain('--livereload');
  });

  it('should return mkdocs serve args for docker mode', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.serveArgs('8000', { useDocker: true });
    expect(args).toContain('0.0.0.0:8000');
  });

  it('should include --clean in serve args when requested', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.serveArgs('8000', { clean: true });
    expect(args).toContain('--clean');
  });

  it('should include --dirtyreload in serve args when requested', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.serveArgs('8000', { dirtyReload: true });
    expect(args).toContain('--dirtyreload');
  });

  it('should include --strict in serve args when requested', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.serveArgs('8000', { strict: true });
    expect(args).toContain('--strict');
  });

  it('should include --config-file in serve args when provided', () => {
    const config = getEngineConfig('mkdocs');
    const args = config.serveArgs('8000', { configFile: 'mkdocs.yml' });
    expect(args).toContain('--config-file');
    expect(args).toContain('mkdocs.yml');
  });

  it('should throw for unknown engine', () => {
    expect(() => getEngineConfig('unknown')).toThrow(
      'Unknown engine: "unknown". Supported engines: mkdocs, zensical',
    );
  });

  describe('zensical', () => {
    const config = getEngineConfig('zensical');

    it('uses the zensical binary and image', () => {
      expect(config.binary).toBe('zensical');
      expect(config.defaultImage).toBe('ghcr.io/backstage/techdocs-zensical');
    });

    it('omits -d from build args since output comes from site_dir', () => {
      expect(config.buildArgs('/output', 'mkdocs.yml')).toEqual([
        'build',
        '-f',
        'mkdocs.yml',
      ]);
    });

    it('builds serve args without mkdocs-only flags', () => {
      expect(
        config.serveArgs('8000', { useDocker: true, configFile: 'c.yml' }),
      ).toEqual(['serve', '--dev-addr', '0.0.0.0:8000', '-f', 'c.yml']);
    });

    it('replaces the native websocket script with the live-reload element', () => {
      const html =
        '<html><body dir="ltr"><p>hi</p>' +
        '<script type="module">const socket = new WebSocket(url.href);</script>' +
        '</body></html>';
      const result = config.transformHtml(html);
      expect(result).not.toContain('new WebSocket');
      expect(result).toContain(
        '<body dir="ltr"><live-reload live-reload-epoch="1" live-reload-request-id="1"></live-reload><p>hi</p>',
      );
    });

    it('leaves other module scripts untouched', () => {
      const html = '<body><script type="module">console.log(1)</script></body>';
      expect(config.transformHtml(html)).toContain('console.log(1)');
    });
  });

  describe('createGenerator', () => {
    const logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn(),
    } as any;

    it('leaves mkdocs to the built-in generator', () => {
      expect(getEngineConfig('mkdocs').createGenerator).toBeUndefined();
    });

    it('creates the Zensical generator for zensical', () => {
      const generator = getEngineConfig('zensical').createGenerator!(
        new ConfigReader({}),
        { logger },
      );
      expect(generator).toBeInstanceOf(TechdocsZensicalGenerator);
    });
  });
});
