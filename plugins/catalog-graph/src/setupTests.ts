/*
 * Copyright 2021 The Backstage Authors
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
import '@testing-library/jest-dom';

// Common mocks needed for SVG and D3 rendering
Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
  value: () => ({ width: 100, height: 100 }),
  configurable: true,
});
Object.defineProperty(window.SVGElement.prototype, 'viewBox', {
  value: { baseVal: { x: 0, y: 0, width: 100, height: 100 } },
  configurable: true,
});
Object.defineProperty(window.MouseEvent.prototype, 'view', {
  value: window,
  configurable: true,
});
