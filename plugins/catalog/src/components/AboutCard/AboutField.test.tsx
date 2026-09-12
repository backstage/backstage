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

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { AboutField } from './AboutField';

// jsdom does not apply the plugin's style sheet over MUI's own in
// getComputedStyle, so the assertion reads the margin declared by the
// component's own class instead of the computed value.
function marginBottomDeclaredByOwnClass(element: Element): string | undefined {
  const ownClasses = Array.from(element.classList)
    .filter(cls => !cls.startsWith('Mui'))
    .map(cls => `.${cls}`);
  return Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
    .filter(rule => ownClasses.includes(rule.selectorText))
    .map(rule => rule.style.marginBottom)
    .find(Boolean);
}

describe('<AboutField />', () => {
  it('keeps a gap between the label and its value', async () => {
    await renderInTestApp(<AboutField label="Owner" value="team-a" />);

    expect(marginBottomDeclaredByOwnClass(screen.getByText('Owner'))).toBe(
      '8px',
    );
  });
});
