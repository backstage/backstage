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

/**
 * Initiates a streaming download using the Streams API.
 * Uses streamSaver-style approach with a service worker when available,
 * falls back to blob download for browsers without full streaming support.
 */
export const streamDownload = async (
  stream: ReadableStream<Uint8Array>,
  filename: string,
  contentType: string,
): Promise<void> => {
  // Try to use the modern streaming approach with polyfill for broader support
  // This creates a WritableStream that pipes to a download
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'Export file',
            accept: {
              [contentType.split(';')[0]]: [`.${filename.split('.').pop()}`],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await stream.pipeTo(writable);
      return;
    } catch (e: any) {
      // User cancelled or API not fully supported, fall back
      if (e.name === 'AbortError') {
        return;
      }
    }
  }

  // Fallback: collect stream into blob (less memory efficient but widely supported)
  const response = new Response(stream, {
    headers: { 'Content-Type': contentType },
  });

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(blobUrl);
};

/**
 * Creates a ReadableStream from an async generator that yields string chunks.
 * This allows streaming serialization directly to the download.
 */
export const createStreamFromAsyncGenerator = (
  generator: AsyncGenerator<string, void, unknown>,
): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const result = await generator.next();
      if (result.done) {
        controller.close();
      } else {
        controller.enqueue(encoder.encode(result.value as string));
      }
    },
  });
};
