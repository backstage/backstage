/*
 * Copyright 2020 Spotify AB
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
import { render, fireEvent } from '@testing-library/react';
import ErrorButton from './ErrorButton';
import { ApiRegistry, errorApiRef, ApiProvider } from '@spotify-backstage/core';

describe('ErrorButton', () => {
  it('should trigger an error', () => {
    const errorApi = { post: jest.fn() };

    const rendered = render(
      <ApiProvider apis={ApiRegistry.from([[errorApiRef, errorApi]])}>
        <ErrorButton />
      </ApiProvider>,
    );

    const button = rendered.getByText('Trigger an error!');
    expect(button).toBeInTheDocument();

    expect(errorApi.post).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(errorApi.post).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Oh no!' }),
    );
  });
});
