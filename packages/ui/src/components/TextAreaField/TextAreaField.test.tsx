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

import { type PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { TextAreaField } from './TextAreaField';
import { BUIProvider } from '../../provider';

function Wrapper({ children }: PropsWithChildren) {
  return <BUIProvider>{children}</BUIProvider>;
}

describe('TextAreaField', () => {
  it('renders the label, secondary label, and description and wires up accessibility', () => {
    render(
      <TextAreaField
        label="Message"
        secondaryLabel="Optional"
        description="Share as much detail as you like."
        rows={5}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('(Optional)')).toBeInTheDocument();

    const textArea = screen.getByRole('textbox');
    expect(textArea.tagName).toBe('TEXTAREA');
    expect(textArea).toHaveAttribute('rows', '5');
    expect(textArea).toHaveAccessibleName('Message');
    expect(textArea).toHaveAccessibleDescription(
      'Share as much detail as you like.',
    );
  });

  it('falls back to the Required secondary label when required without an explicit one', () => {
    render(<TextAreaField label="Message" isRequired />, { wrapper: Wrapper });

    expect(screen.getByText('(Required)')).toBeInTheDocument();
  });
});
