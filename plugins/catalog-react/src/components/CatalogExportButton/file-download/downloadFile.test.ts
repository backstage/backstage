/*
 * Copyright 2025 The Backstage Authors
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
import { streamDownload, createStreamFromAsyncGenerator } from './downloadFile';

describe('downloadBlob', () => {
  describe('createStreamFromAsyncGenerator', () => {
    it('creates a ReadableStream from an async generator', async () => {
      async function* testGenerator(): AsyncGenerator<string, void, unknown> {
        yield 'Hello, ';
        yield 'World!';
      }

      const stream = createStreamFromAsyncGenerator(testGenerator());
      const reader = stream.getReader();

      const chunks: Uint8Array[] = [];
      let result = await reader.read();
      while (!result.done) {
        chunks.push(result.value);
        result = await reader.read();
      }

      const decoder = new TextDecoder();
      const text = chunks.map(chunk => decoder.decode(chunk)).join('');
      expect(text).toBe('Hello, World!');
    });

    it('handles empty generator', async () => {
      async function* emptyGenerator(): AsyncGenerator<string, void, unknown> {
        // yields nothing
      }

      const stream = createStreamFromAsyncGenerator(emptyGenerator());
      const reader = stream.getReader();

      const result = await reader.read();
      expect(result.done).toBe(true);
    });

    it('handles single chunk', async () => {
      async function* singleChunkGenerator(): AsyncGenerator<
        string,
        void,
        unknown
      > {
        yield 'Single chunk';
      }

      const stream = createStreamFromAsyncGenerator(singleChunkGenerator());
      const reader = stream.getReader();

      const chunks: Uint8Array[] = [];
      let result = await reader.read();
      while (!result.done) {
        chunks.push(result.value);
        result = await reader.read();
      }

      const decoder = new TextDecoder();
      const text = chunks.map(chunk => decoder.decode(chunk)).join('');
      expect(text).toBe('Single chunk');
    });

    it('encodes unicode characters correctly', async () => {
      async function* unicodeGenerator(): AsyncGenerator<
        string,
        void,
        unknown
      > {
        yield '日本語';
        yield ' 🎉 ';
        yield 'émojis';
      }

      const stream = createStreamFromAsyncGenerator(unicodeGenerator());
      const reader = stream.getReader();

      const chunks: Uint8Array[] = [];
      let result = await reader.read();
      while (!result.done) {
        chunks.push(result.value);
        result = await reader.read();
      }

      const decoder = new TextDecoder();
      const text = chunks.map(chunk => decoder.decode(chunk)).join('');
      expect(text).toBe('日本語 🎉 émojis');
    });
  });

  describe('streamDownload', () => {
    let mockCreateObjectURL: jest.SpyInstance;
    let mockRevokeObjectURL: jest.SpyInstance;
    let mockRemove: jest.Mock;
    let mockClick: jest.Mock;
    let createdAnchor: HTMLAnchorElement | null = null;

    beforeEach(() => {
      mockCreateObjectURL = jest
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:mock-url');
      mockRevokeObjectURL = jest
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});

      mockRemove = jest.fn();
      mockClick = jest.fn();

      jest
        .spyOn(document, 'createElement')
        .mockImplementation((tag: string) => {
          if (tag === 'a') {
            createdAnchor = {
              href: '',
              download: '',
              click: mockClick,
              remove: mockRemove,
            } as unknown as HTMLAnchorElement;
            return createdAnchor;
          }
          return document.createElement(tag);
        });

      jest.spyOn(document.body, 'appendChild').mockImplementation(node => node);

      // Ensure showSaveFilePicker is not available for fallback tests
      delete (window as any).showSaveFilePicker;
    });

    afterEach(() => {
      jest.restoreAllMocks();
      createdAnchor = null;
    });

    it('downloads stream using blob fallback when File System Access API is unavailable', async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('test content'));
          controller.close();
        },
      });

      await streamDownload(stream, 'test.txt', 'text/plain');

      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      expect(createdAnchor?.download).toBe('test.txt');
      expect(mockClick).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('sets correct filename on anchor element', async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('csv data'));
          controller.close();
        },
      });

      await streamDownload(stream, 'export.csv', 'text/csv; charset=utf-8');

      expect(createdAnchor?.download).toBe('export.csv');
    });

    it('cleans up blob URL after download', async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data'));
          controller.close();
        },
      });

      await streamDownload(stream, 'file.json', 'application/json');

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    describe('with File System Access API', () => {
      let mockWritable: { close: jest.Mock };
      let mockHandle: { createWritable: jest.Mock };
      let mockShowSaveFilePicker: jest.Mock;

      beforeEach(() => {
        mockWritable = {
          close: jest.fn(),
        };
        mockHandle = {
          createWritable: jest.fn().mockResolvedValue(mockWritable),
        };
        mockShowSaveFilePicker = jest.fn().mockResolvedValue(mockHandle);
        (window as any).showSaveFilePicker = mockShowSaveFilePicker;
      });

      it('uses File System Access API when available', async () => {
        const encoder = new TextEncoder();
        const chunks = [encoder.encode('chunk1'), encoder.encode('chunk2')];
        let chunkIndex = 0;

        const stream = new ReadableStream<Uint8Array>({
          pull(controller) {
            if (chunkIndex < chunks.length) {
              controller.enqueue(chunks[chunkIndex++]);
            } else {
              controller.close();
            }
          },
        });

        // Mock pipeTo to simulate streaming
        stream.pipeTo = jest.fn().mockResolvedValue(undefined);

        await streamDownload(stream, 'export.csv', 'text/csv');

        expect(mockShowSaveFilePicker).toHaveBeenCalledWith({
          suggestedName: 'export.csv',
          types: [
            {
              description: 'Export file',
              accept: { 'text/csv': ['.csv'] },
            },
          ],
        });
        expect(mockHandle.createWritable).toHaveBeenCalled();
        expect(stream.pipeTo).toHaveBeenCalledWith(mockWritable);

        // Should not fall back to blob download
        expect(mockCreateObjectURL).not.toHaveBeenCalled();
      });

      it('handles user cancellation gracefully', async () => {
        const abortError = new Error('User cancelled');
        abortError.name = 'AbortError';
        mockShowSaveFilePicker.mockRejectedValue(abortError);

        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode('data'));
            controller.close();
          },
        });

        // Should not throw and should not fall back
        await expect(
          streamDownload(stream, 'file.txt', 'text/plain'),
        ).resolves.toBeUndefined();

        expect(mockCreateObjectURL).not.toHaveBeenCalled();
      });

      it('falls back to blob download on other errors', async () => {
        const otherError = new Error('Some other error');
        otherError.name = 'NotAllowedError';
        mockShowSaveFilePicker.mockRejectedValue(otherError);

        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode('data'));
            controller.close();
          },
        });

        await streamDownload(stream, 'file.txt', 'text/plain');

        // Should fall back to blob download
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
    });
  });
});
