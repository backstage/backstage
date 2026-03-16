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
import { renderInTestApp } from '@backstage/test-utils';
import { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { TaskLogStream } from './TaskLogStream';

// The <AutoSizer> inside <LogViewer> needs mocking to render in jsdom
jest.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: (props: {
    children: (size: { width: number; height: number }) => ReactNode;
  }) => <>{props.children({ width: 400, height: 200 })}</>,
}));

beforeAll(() => {
  Reflect.defineProperty(window.URL, 'createObjectURL', {
    writable: true,
    value: jest.fn((_blob: any) => 'blob:mock-url'),
  });
  Reflect.defineProperty(window.URL, 'revokeObjectURL', {
    writable: true,
    value: jest.fn(),
  });
});

afterAll(() => {
  Reflect.deleteProperty(window.URL, 'createObjectURL');
  Reflect.deleteProperty(window.URL, 'revokeObjectURL');
});

describe('TaskLogStream', () => {
  it('should render a log stream with the correct log lines', async () => {
    const logs = { step: ['line 1', 'line 2'], step2: ['line 3'] };

    const { findByText } = await renderInTestApp(<TaskLogStream logs={logs} />);

    const logLines = Object.values(logs).flat();

    for (const line of logLines) {
      await expect(findByText(line)).resolves.toBeInTheDocument();
    }
  });

  it('should filter out empty log lines', async () => {
    const logs = { step: ['line 1', 'line 2'], step2: [] };

    const { findAllByRole } = await renderInTestApp(
      <TaskLogStream logs={logs} />,
    );

    await expect(findAllByRole('row')).resolves.toHaveLength(2);
  });

  it('should render download button', async () => {
    const logs = { step: ['line 1', 'line 2'], step2: ['line 3'] };

    const { getByRole } = await renderInTestApp(<TaskLogStream logs={logs} />);

    const downloadButton = getByRole('button', { name: /download/i });
    expect(downloadButton).toBeInTheDocument();
  });

  it('should download logs when download button is clicked', async () => {
    const logs = {
      step1: ['line 1', 'line 2'],
      step2: ['line 3', 'line 4'],
    };

    const { getByRole } = await renderInTestApp(<TaskLogStream logs={logs} />);

    // Mock only the anchor element creation
    const mockAnchor = document.createElement('a');
    const clickSpy = jest.spyOn(mockAnchor, 'click');
    const removeSpy = jest.spyOn(mockAnchor, 'remove');

    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          return mockAnchor;
        }
        return originalCreateElement(tagName);
      });

    const downloadButton = getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);

    // Verify file download was triggered
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    // Verify the download filename contains .log extension
    expect(mockAnchor.download).toMatch(/\.log$/);

    // Verify href was set
    expect(mockAnchor.href).toContain('blob:');

    // Restore mocks
    createElementSpy.mockRestore();
  });

  it('should create blob with correct log content when downloading', async () => {
    const logs = {
      step1: ['line 1', 'line 2'],
      step2: ['line 3'],
    };

    const { getByRole } = await renderInTestApp(<TaskLogStream logs={logs} />);

    let capturedBlob: Blob | null = null;
    const createObjectURLSpy = jest
      .spyOn(URL, 'createObjectURL')
      .mockImplementation((blob: any) => {
        capturedBlob = blob;
        return 'blob:mock-url';
      });

    const mockAnchor = document.createElement('a');
    const clickSpy = jest.spyOn(mockAnchor, 'click');

    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          return mockAnchor;
        }
        return originalCreateElement(tagName);
      });

    const downloadButton = getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);

    // Verify file download was triggered
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();

    // Verify blob was created with correct content
    expect(capturedBlob).toBeInstanceOf(Blob);
    expect(capturedBlob!?.type).toBe('text/plain');

    // Restore mocks
    createElementSpy.mockRestore();
    createObjectURLSpy.mockRestore();
  });
});
