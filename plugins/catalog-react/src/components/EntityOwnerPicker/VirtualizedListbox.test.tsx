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
import { VirtualizedListbox } from './VirtualizedListbox';
import { renderInTestApp } from '@backstage/test-utils';

describe('<VirtualizedListbox />', () => {
  it('forwards additional props to the outer scroll container', async () => {
    const { baseElement } = await renderInTestApp(
      <VirtualizedListbox
        className="MuiAutocomplete-root MuiAutocomplete-hasClearIcon MuiAutocomplete-hasPopupIcon"
        aria-expanded="true"
        role="combobox"
      />,
    );

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            aria-expanded="true"
            class="MuiAutocomplete-root MuiAutocomplete-hasClearIcon MuiAutocomplete-hasPopupIcon"
            role="combobox"
            style="position: relative; height: 18px; width: 100%; overflow: auto; -webkit-overflow-scrolling: touch; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 0px; width: 100%;"
            />
          </div>
        </div>
      </div>
    `);
  });

  it('renders with no items', async () => {
    const { baseElement } = await renderInTestApp(<VirtualizedListbox />);

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            style="position: relative; height: 18px; width: 100%; overflow: auto; -webkit-overflow-scrolling: touch; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 0px; width: 100%;"
            />
          </div>
        </div>
      </div>
    `);
  });

  it('renders a single item at 36px height', async () => {
    const { baseElement } = await renderInTestApp(
      <VirtualizedListbox>
        <span>Item 1</span>
      </VirtualizedListbox>,
    );

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            style="position: relative; height: 54px; width: 100%; overflow: auto; -webkit-overflow-scrolling: touch; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 36px; width: 100%;"
            >
              <span
                style="position: absolute; left: 0px; top: 0px; height: 36px; width: 100%;"
              >
                Item 1
              </span>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  it('caps the visible window at 10.5 rows and only mounts visible rows for large lists', async () => {
    const { baseElement } = await renderInTestApp(
      <VirtualizedListbox>
        {[...new Array(100)].map((_, i) => (
          <span key={i}>Item {i}</span>
        ))}
      </VirtualizedListbox>,
    );

    const scrollContainer = baseElement.querySelector(
      'div[style*="overflow: auto"]',
    )!;

    // Visible window is capped at 10.5 × 36px = 378px regardless of item count
    expect(scrollContainer).toHaveStyle('height: 378px');

    // Inner container reflects the full virtual height: 100 × 36px = 3600px
    const innerContainer = scrollContainer.firstElementChild!;
    expect(innerContainer).toHaveStyle('height: 3600px');

    // Only the visible rows + react-window's overscan buffer are in the DOM —
    // not all 100. This is the core virtualization guarantee.
    const renderedRows = scrollContainer.querySelectorAll('span');
    expect(renderedRows.length).toBeLessThan(20);
    expect(renderedRows.length).toBeGreaterThan(0);
  });
});
