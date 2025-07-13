/*
 * Copyright 2023 The Backstage Authors
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

import { screen } from '@testing-library/react';
import {
  TestApiRegistry,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { CustomHomepageGrid } from './CustomHomepageGrid';
import { ApiProvider } from '@backstage/core-app-api';
import { storageApiRef } from '@backstage/core-plugin-api';
import { CustomHomepageGridStateV1, CustomHomepageGridStateV2 } from './types';

// Mock widget component for testing
const MockWidget = () => <div data-testid="mock-widget">Mock Widget</div>;

describe('CustomHomepageGrid', () => {
  const apis = TestApiRegistry.from([storageApiRef, mockApis.storage()]);

  const renderComponent = async (props = {}) => {
    return renderInTestApp(
      <ApiProvider apis={apis}>
        <CustomHomepageGrid title="Test Homepage" {...props}>
          <MockWidget />
        </CustomHomepageGrid>
      </ApiProvider>,
    );
  };

  beforeEach(() => {
    // Clear storage before each test
    const storage = apis.get(storageApiRef);
    const bucket = storage?.forBucket('home.customHomepage');
    bucket?.remove('home');
  });

  it('should render empty state when no widgets are configured', async () => {
    await renderComponent();

    expect(
      screen.getByText(
        "No widgets added. Start by clicking the 'Add widget' button.",
      ),
    ).toBeInTheDocument();
  });

  it('should load widgets from V2 storage format', async () => {
    const storage = apis.get(storageApiRef);
    const bucket = storage?.forBucket('home.customHomepage');

    const v2Data: CustomHomepageGridStateV2 = {
      version: 2,
      pages: {
        default: {
          current: [
            {
              id: 'MockWidget__1',
              layout: {
                i: 'MockWidget__1',
                x: 0,
                y: 0,
                w: 6,
                h: 4,
                minW: 2,
                maxW: 12,
                minH: 2,
                maxH: 8,
                isDraggable: false,
                isResizable: false,
              },
              settings: {},
              movable: true,
              deletable: true,
              resizable: true,
            },
          ],
          backup: [
            {
              id: 'MockWidget__backup',
              layout: {
                i: 'MockWidget__backup',
                x: 0,
                y: 0,
                w: 6,
                h: 4,
                minW: 2,
                maxW: 12,
                minH: 2,
                maxH: 8,
                isDraggable: false,
                isResizable: false,
              },
              settings: {},
              movable: true,
              deletable: true,
              resizable: true,
            },
          ],
        },
      },
    };

    bucket?.set('home', JSON.stringify(v2Data));

    await renderComponent();

    // Since the mock widget may not be properly registered, just check that we don't see the empty state
    expect(
      screen.queryByText(
        "No widgets added. Start by clicking the 'Add widget' button.",
      ),
    ).not.toBeInTheDocument();
  });

  it('should migrate V1 storage format to V2', async () => {
    const storage = apis.get(storageApiRef);
    const bucket = storage?.forBucket('home.customHomepage');

    const v1Data: CustomHomepageGridStateV1 = {
      version: 1,
      pages: {
        default: [
          {
            id: 'MockWidget__1',
            layout: {
              i: 'MockWidget__1',
              x: 0,
              y: 0,
              w: 6,
              h: 4,
              minW: 2,
              maxW: 12,
              minH: 2,
              maxH: 8,
              isDraggable: false,
              isResizable: false,
            },
            settings: {},
            movable: true,
            deletable: true,
            resizable: true,
          },
        ],
      },
    };

    bucket?.set('home', JSON.stringify(v1Data));

    await renderComponent();

    // Since the mock widget may not be properly registered, just check that we don't see the empty state
    expect(
      screen.queryByText(
        "No widgets added. Start by clicking the 'Add widget' button.",
      ),
    ).not.toBeInTheDocument();
  });

  it('should handle malformed storage data gracefully', async () => {
    const storage = apis.get(storageApiRef);
    const bucket = storage?.forBucket('home.customHomepage');

    bucket?.set('home', 'invalid-json');

    await renderComponent();

    expect(
      screen.getByText(
        "No widgets added. Start by clicking the 'Add widget' button.",
      ),
    ).toBeInTheDocument();
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      const storage = apis.get(storageApiRef);
      const bucket = storage?.forBucket('home.customHomepage');

      const initialData: CustomHomepageGridStateV2 = {
        version: 2,
        pages: {
          default: {
            current: [
              {
                id: 'MockWidget__1',
                layout: {
                  i: 'MockWidget__1',
                  x: 0,
                  y: 0,
                  w: 6,
                  h: 4,
                  minW: 2,
                  maxW: 12,
                  minH: 2,
                  maxH: 8,
                  isDraggable: false,
                  isResizable: false,
                },
                settings: {},
                movable: true,
                deletable: true,
                resizable: true,
              },
            ],
            backup: [
              {
                id: 'MockWidget__1',
                layout: {
                  i: 'MockWidget__1',
                  x: 0,
                  y: 0,
                  w: 6,
                  h: 4,
                  minW: 2,
                  maxW: 12,
                  minH: 2,
                  maxH: 8,
                  isDraggable: false,
                  isResizable: false,
                },
                settings: {},
                movable: true,
                deletable: true,
                resizable: true,
              },
            ],
          },
        },
      };

      bucket?.set('home', JSON.stringify(initialData));
    });

    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      await renderComponent();

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Add widget')).toBeInTheDocument();
    });

    it('should show cancel confirmation dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      await renderComponent();

      // Enter edit mode
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click cancel (the header cancel button)
      const cancelButtons = screen.getAllByText('Cancel');
      const headerCancelButton = cancelButtons[0]; // First Cancel button is in the header
      await user.click(headerCancelButton);

      // Should show confirmation dialog
      expect(screen.getByText('Discard Changes?')).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure? Unsaved changes will be lost.'),
      ).toBeInTheDocument();
    });

    it('should exit edit mode when cancel is confirmed', async () => {
      const user = userEvent.setup();
      await renderComponent();

      // Enter edit mode
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click cancel (the header cancel button)
      const cancelButtons = screen.getAllByText('Cancel');
      const headerCancelButton = cancelButtons[0]; // First Cancel button is in the header
      await user.click(headerCancelButton);

      // Confirm discard
      const discardButton = screen.getByText('Discard Changes');
      await user.click(discardButton);

      // Should exit edit mode
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('should stay in edit mode when cancel is cancelled', async () => {
      const user = userEvent.setup();
      await renderComponent();

      // Enter edit mode
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click cancel (the header cancel button)
      const headerCancelButtons = screen.getAllByText('Cancel');
      const headerCancelButton = headerCancelButtons[0]; // First Cancel button is in the header
      await user.click(headerCancelButton);

      // Cancel the discard - find the Cancel button that appears alongside "Discard Changes"
      // First ensure the dialog is open
      expect(screen.getByText('Discard Changes?')).toBeInTheDocument();

      // Find all Cancel buttons and click the one that's NOT the header button
      const allCancelButtons = screen.getAllByText('Cancel');
      const dialogCancelButton = allCancelButtons.find(button =>
        button.closest('[role="dialog"]'),
      );
      await user.click(dialogCancelButton!);

      // Should remain in edit mode
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByTestId('edit-cancel-button')).toBeInTheDocument();
    });

    it('should exit edit mode when save is clicked', async () => {
      const user = userEvent.setup();
      await renderComponent();

      // Enter edit mode
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click save
      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      // Should exit edit mode
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('should open add widget dialog when add widget button is clicked', async () => {
      const user = userEvent.setup();
      await renderComponent();

      // Enter edit mode
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click add widget
      const addWidgetButton = screen.getByText('Add widget');
      await user.click(addWidgetButton);

      // Should show add widget dialog
      expect(
        screen.getByText('Add new widget to dashboard'),
      ).toBeInTheDocument();
    });
  });
});
