/*
 * Copyright 2024 The Backstage Authors
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

import { parseExtensionId } from './parseExtensionId';

describe('parseExtensionId', () => {
  it('should parse simple plugin ID format', () => {
    expect(parseExtensionId('catalog')).toBe('catalog');
    expect(parseExtensionId('techdocs')).toBe('techdocs');
  });

  it('should parse plugin ID with name format', () => {
    expect(parseExtensionId('catalog/my-api')).toBe('catalog');
    expect(parseExtensionId('techdocs/storage')).toBe('techdocs');
  });

  it('should parse kind:pluginId format', () => {
    expect(parseExtensionId('api:catalog')).toBe('catalog');
    expect(parseExtensionId('page:techdocs')).toBe('techdocs');
  });

  it('should parse kind:pluginId/name format', () => {
    expect(parseExtensionId('api:catalog/my-api')).toBe('catalog');
    expect(parseExtensionId('page:techdocs/docs')).toBe('techdocs');
  });

  it('should handle edge cases', () => {
    expect(parseExtensionId('')).toBeUndefined();
    expect(parseExtensionId('/')).toBeUndefined();
    expect(parseExtensionId(':')).toBeUndefined();
    expect(parseExtensionId('api:')).toBeUndefined();
  });

  it('should handle complex plugin IDs', () => {
    expect(parseExtensionId('my-plugin-id')).toBe('my-plugin-id');
    expect(parseExtensionId('my-plugin-id/extension-name')).toBe('my-plugin-id');
    expect(parseExtensionId('api:my-plugin-id')).toBe('my-plugin-id');
    expect(parseExtensionId('api:my-plugin-id/extension-name')).toBe(
      'my-plugin-id',
    );
  });
});

