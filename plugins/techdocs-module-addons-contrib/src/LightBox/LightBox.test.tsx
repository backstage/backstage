/*
 * Copyright 2022 The Backstage Authors
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

import { TechDocsAddonTester } from '@backstage/plugin-techdocs-addons-test-utils';
import { screen } from 'shadow-dom-testing-library';

import { LightBox } from '../plugin';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';

describe('LightBox', () => {
  const entityPresentationApiMock = {
    forEntity: jest.fn(),
  };
  entityPresentationApiMock.forEntity.mockReturnValue({
    snapshot: {
      primaryTitle: 'Test Entity',
    },
  });

  it('renders without exploding', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<LightBox />])
      .withDom(<body>TEST_CONTENT</body>)
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    expect(screen.getByShadowText('TEST_CONTENT')).toBeInTheDocument();
  });

  it('Add onclick event to images', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<LightBox />])
      .withDom(
        <img
          data-testid="fixture"
          src="http://example.com/dog.jpg"
          alt="dog"
        />,
      )
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    expect(screen.getByShadowTestId('fixture').onclick).not.toBeUndefined();
    expect(screen.getByShadowTestId('fixture').onclick).toEqual(
      expect.any(Function),
    );
  });

  it('does not add onclick event to linked images', async () => {
    await TechDocsAddonTester.buildAddonsInTechDocs([<LightBox />])
      .withDom(
        <div>
          <a href="https://example.com">
            <img
              data-testid="linked-fixture"
              src="http://example.com/cat.jpg"
              alt="cat"
            />
          </a>
          <a href="https://example.com">
            <span>
              <img
                data-testid="linked-indirect-fixture"
                src="http://example.com/cat2.jpg"
                alt="cat2"
              />
            </span>
          </a>
          <img
            data-testid="plain-fixture"
            src="http://example.com/dog.jpg"
            alt="dog"
          />
        </div>,
      )
      .withApis([[entityPresentationApiRef, entityPresentationApiMock]])
      .renderWithEffects();

    expect(screen.getByShadowTestId('linked-fixture').onclick).toBeNull();
    expect(
      screen.getByShadowTestId('linked-indirect-fixture').onclick,
    ).toBeNull();
    expect(screen.getByShadowTestId('plain-fixture').onclick).toEqual(
      expect.any(Function),
    );
  });
});
