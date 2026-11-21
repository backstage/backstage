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

const HEADER_SIZE = 512;
const REGULAR_FILE_TYPEFLAGS = new Set(['0', '\0']);

function isZeroBlock(block: Uint8Array): boolean {
  return block.every(byte => byte === 0);
}

function readString(block: Uint8Array, offset: number, length: number): string {
  const bytes = block.subarray(offset, offset + length);
  const nulIndex = bytes.indexOf(0);
  const trimmed = nulIndex === -1 ? bytes : bytes.subarray(0, nulIndex);
  return new TextDecoder().decode(trimmed);
}

function readOctal(block: Uint8Array, offset: number, length: number): number {
  const raw = readString(block, offset, length).trim();
  return raw.length === 0 ? 0 : parseInt(raw, 8);
}

// Reads only what `npm pack` produces (USTAR-compatible regular-file entries,
// no long-name/long-link extensions or base-256 size fields) - not a
// general-purpose tar implementation. Malformed/truncated input can't throw
// here (Uint8Array#subarray clamps rather than erroring); a truncated entry
// simply yields truncated content, which callers detect via a downstream
// parse failure (e.g. JSON.parse) rather than this function throwing.
export function parseTar(buffer: Uint8Array): Map<string, Uint8Array> {
  const entries = new Map<string, Uint8Array>();
  let offset = 0;

  while (offset + HEADER_SIZE <= buffer.length) {
    const header = buffer.subarray(offset, offset + HEADER_SIZE);
    if (isZeroBlock(header)) {
      break;
    }

    const name = readString(header, 0, 100);
    const size = readOctal(header, 124, 12);
    const typeflag = String.fromCharCode(header[156]);
    offset += HEADER_SIZE;

    if (name.length > 0 && REGULAR_FILE_TYPEFLAGS.has(typeflag)) {
      entries.set(name, buffer.subarray(offset, offset + size));
    }

    offset += Math.ceil(size / HEADER_SIZE) * HEADER_SIZE;
  }

  return entries;
}
