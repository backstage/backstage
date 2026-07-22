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
import { entityNoRegions, entityWithRegions } from '../mocks';
import { getNumberOfTemplatesText, getRegionsText } from './functions';

describe('getRegionsText', () => {
  it("should return null if entity provided has no 'availability' value", () => {
    const result = getRegionsText(entityNoRegions);
    expect(result).toBe(null);
  });

  it("should return null if entity provided has 'availability' value equal to empty array", () => {
    const result = getRegionsText({
      ...entityNoRegions,
      metadata: { ...entityNoRegions.metadata, availability: [] },
    });
    expect(result).toBe(null);
  });

  it("should return string with one region if entity provided has 'availability' value equal to single element array", () => {
    const result = getRegionsText({
      ...entityNoRegions,
      metadata: { ...entityNoRegions.metadata, availability: ['Mordor'] },
    });
    expect(result).toBe('Mordor');
  });

  it("should return comma-separated regions if entity provided has 'availability' array", () => {
    const result = getRegionsText(entityWithRegions);
    expect(result).toBe('Poland, Netherlands, Germany');
  });
});

describe('getNumberOfTemplatesText', () => {
  it("should return '1 template' if entity provided has one template", () => {
    const result = getNumberOfTemplatesText(entityNoRegions);
    expect(result).toBe('1 template');
  });

  it("should return '2 templates' if entity provided has two templates", () => {
    const result = getNumberOfTemplatesText(entityWithRegions);
    expect(result).toBe('2 templates');
  });
});
