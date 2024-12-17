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
import { VirtualizedListbox } from './VirtualizedListbox';
import { renderInTestApp } from '@backstage/test-utils';

describe('<VirtualizedListbox />', () => {
  it('Should forward additional props to the outer div', async () => {
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
            style="position: relative; height: 18px; width: 100%; overflow: auto; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 0px; width: 100%;"
            />
          </div>
        </div>
      </div>
    `);
  });
  it('Should render with no items', async () => {
    const { baseElement } = await renderInTestApp(<VirtualizedListbox />);

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            style="position: relative; height: 18px; width: 100%; overflow: auto; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 0px; width: 100%;"
            />
          </div>
        </div>
      </div>
    `);
  });
  it('Should render with one item', async () => {
    const { baseElement } = await renderInTestApp(
      <VirtualizedListbox>
        <span>Item 1</span>
      </VirtualizedListbox>,
    );

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            style="position: relative; height: 54px; width: 100%; overflow: auto; will-change: transform; direction: ltr;"
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
  it('Should render with 10 items', async () => {
    const { baseElement } = await renderInTestApp(
      <VirtualizedListbox>
        {[...new Array(10)].map((_, i) => (
          <span key={i}>Item {i}</span>
        ))}
      </VirtualizedListbox>,
    );

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            style="position: relative; height: 378px; width: 100%; overflow: auto; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 360px; width: 100%;"
            >
              <span
                style="position: absolute; left: 0px; top: 0px; height: 36px; width: 100%;"
              >
                Item 
                0
              </span>
              <span
                style="position: absolute; left: 0px; top: 36px; height: 36px; width: 100%;"
              >
                Item 
                1
              </span>
              <span
                style="position: absolute; left: 0px; top: 72px; height: 36px; width: 100%;"
              >
                Item 
                2
              </span>
              <span
                style="position: absolute; left: 0px; top: 108px; height: 36px; width: 100%;"
              >
                Item 
                3
              </span>
              <span
                style="position: absolute; left: 0px; top: 144px; height: 36px; width: 100%;"
              >
                Item 
                4
              </span>
              <span
                style="position: absolute; left: 0px; top: 180px; height: 36px; width: 100%;"
              >
                Item 
                5
              </span>
              <span
                style="position: absolute; left: 0px; top: 216px; height: 36px; width: 100%;"
              >
                Item 
                6
              </span>
              <span
                style="position: absolute; left: 0px; top: 252px; height: 36px; width: 100%;"
              >
                Item 
                7
              </span>
              <span
                style="position: absolute; left: 0px; top: 288px; height: 36px; width: 100%;"
              >
                Item 
                8
              </span>
              <span
                style="position: absolute; left: 0px; top: 324px; height: 36px; width: 100%;"
              >
                Item 
                9
              </span>
            </div>
          </div>
        </div>
      </div>
    `);
  });
  it('Should render up to 10.5 items (+ 2 buffer) even when there are many more', async () => {
    const { baseElement } = await renderInTestApp(
      <VirtualizedListbox>
        {[...new Array(100)].map((_, i) => (
          <span key={i}>Item {i}</span>
        ))}
      </VirtualizedListbox>,
    );

    expect(baseElement.children[0]).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            style="position: relative; height: 378px; width: 100%; overflow: auto; will-change: transform; direction: ltr;"
          >
            <div
              style="height: 3600px; width: 100%;"
            >
              <span
                style="position: absolute; left: 0px; top: 0px; height: 36px; width: 100%;"
              >
                Item 
                0
              </span>
              <span
                style="position: absolute; left: 0px; top: 36px; height: 36px; width: 100%;"
              >
                Item 
                1
              </span>
              <span
                style="position: absolute; left: 0px; top: 72px; height: 36px; width: 100%;"
              >
                Item 
                2
              </span>
              <span
                style="position: absolute; left: 0px; top: 108px; height: 36px; width: 100%;"
              >
                Item 
                3
              </span>
              <span
                style="position: absolute; left: 0px; top: 144px; height: 36px; width: 100%;"
              >
                Item 
                4
              </span>
              <span
                style="position: absolute; left: 0px; top: 180px; height: 36px; width: 100%;"
              >
                Item 
                5
              </span>
              <span
                style="position: absolute; left: 0px; top: 216px; height: 36px; width: 100%;"
              >
                Item 
                6
              </span>
              <span
                style="position: absolute; left: 0px; top: 252px; height: 36px; width: 100%;"
              >
                Item 
                7
              </span>
              <span
                style="position: absolute; left: 0px; top: 288px; height: 36px; width: 100%;"
              >
                Item 
                8
              </span>
              <span
                style="position: absolute; left: 0px; top: 324px; height: 36px; width: 100%;"
              >
                Item 
                9
              </span>
              <span
                style="position: absolute; left: 0px; top: 360px; height: 36px; width: 100%;"
              >
                Item 
                10
              </span>
              <span
                style="position: absolute; left: 0px; top: 396px; height: 36px; width: 100%;"
              >
                Item 
                11
              </span>
              <span
                style="position: absolute; left: 0px; top: 432px; height: 36px; width: 100%;"
              >
                Item 
                12
              </span>
            </div>
          </div>
        </div>
      </div>
    `);
  });
});
