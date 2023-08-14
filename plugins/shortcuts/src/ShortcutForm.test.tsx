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
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ShortcutForm } from './ShortcutForm';
import { DefaultShortcutsApi, shortcutsApiRef } from './api';
import {
  renderInTestApp,
  TestApiProvider,
  MockStorageApi,
} from '@backstage/test-utils';

describe('ShortcutForm', () => {
  const props = {
    onSave: jest.fn(),
    onClose: jest.fn(),
  };

  it('displays validation messages', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [shortcutsApiRef, new DefaultShortcutsApi(MockStorageApi.create())],
        ]}
      >
        <ShortcutForm {...props} />
      </TestApiProvider>,
    );

    const urlInput = screen.getByPlaceholderText('Enter a URL');
    const titleInput = screen.getByPlaceholderText('Enter a display name');
    fireEvent.change(urlInput, { target: { value: 'url' } });
    fireEvent.change(titleInput, { target: { value: 't' } });

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(
        screen.getByText('Must be a relative URL (starts with a /)'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Must be at least 2 characters'),
      ).toBeInTheDocument();
    });
  });

  it('displays duplicate validation messages for title and URL', async () => {
    const mockShortcutApi = new DefaultShortcutsApi(MockStorageApi.create());
    mockShortcutApi.add({ title: 'Existing Title', url: '/existing-url' });

    await renderInTestApp(
      <TestApiProvider apis={[[shortcutsApiRef, mockShortcutApi]]}>
        <ShortcutForm {...props} />
      </TestApiProvider>,
    );

    const urlInput = screen.getByPlaceholderText('Enter a URL');
    const titleInput = screen.getByPlaceholderText('Enter a display name');

    fireEvent.change(urlInput, { target: { value: '/existing-url' } });
    fireEvent.change(titleInput, { target: { value: 'Existing Title' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(
        screen.getByText('A shortcut with this title already exists'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('A shortcut with this url already exists'),
      ).toBeInTheDocument();
    });

    expect(props.onSave).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('allows external links', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [shortcutsApiRef, new DefaultShortcutsApi(MockStorageApi.create())],
        ]}
      >
        <ShortcutForm allowExternalLinks {...props} />
      </TestApiProvider>,
    );

    const urlInput = screen.getByPlaceholderText('Enter a URL');
    const titleInput = screen.getByPlaceholderText('Enter a display name');
    fireEvent.change(urlInput, {
      target: { value: 'https://www.backstage.io' },
    });
    fireEvent.change(titleInput, { target: { value: 'Backstage' } });

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(props.onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Backstage',
          url: 'https://www.backstage.io',
        }),
        expect.anything(),
      );
    });
  });

  it('allows relative links when external links are enabled', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [shortcutsApiRef, new DefaultShortcutsApi(MockStorageApi.create())],
        ]}
      >
        <ShortcutForm allowExternalLinks {...props} />
      </TestApiProvider>,
    );

    const urlInput = screen.getByPlaceholderText('Enter a URL');
    const titleInput = screen.getByPlaceholderText('Enter a display name');
    fireEvent.change(urlInput, {
      target: { value: '/catalog' },
    });
    fireEvent.change(titleInput, { target: { value: 'Catalog' } });

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(props.onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Catalog',
          url: '/catalog',
        }),
        expect.anything(),
      );
    });
  });

  it('calls the save handler', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [shortcutsApiRef, new DefaultShortcutsApi(MockStorageApi.create())],
        ]}
      >
        <ShortcutForm
          {...props}
          formValues={{ url: '/some-url', title: 'some title' }}
        />
        ,
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(props.onSave).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'some title', url: '/some-url' }),
        expect.anything(),
      );
    });
  });

  it('calls the close handler', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [shortcutsApiRef, new DefaultShortcutsApi(MockStorageApi.create())],
        ]}
      >
        <ShortcutForm {...props} />
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(props.onClose).toHaveBeenCalled();
    });
  });
});
