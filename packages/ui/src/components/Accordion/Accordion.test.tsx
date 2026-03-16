/*
 * Copyright 2025 The Backstage Authors
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
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionTrigger, AccordionPanel } from './Accordion';

describe('AccordionTrigger icon props', () => {
  it('renders iconStart and iconEnd in the DOM when both props are provided', async () => {
    const IconStart = () => <svg data-testid="icon-start" />;
    const IconEnd = () => <svg data-testid="icon-end" />;

    render(
      <Accordion>
        <AccordionTrigger
          title="Settings"
          iconStart={<IconStart />}
          iconEnd={<IconEnd />}
        />
        <AccordionPanel>Content</AccordionPanel>
      </Accordion>,
    );

    expect(await screen.findByTestId('icon-start')).toBeInTheDocument();
    expect(await screen.findByTestId('icon-end')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders only iconStart when iconEnd is not provided', async () => {
    const IconStart = () => <svg data-testid="icon-start" />;

    render(
      <Accordion>
        <AccordionTrigger title="Notifications" iconStart={<IconStart />} />
        <AccordionPanel>Content</AccordionPanel>
      </Accordion>,
    );

    expect(await screen.findByTestId('icon-start')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-end')).not.toBeInTheDocument();
  });

  it('renders only iconEnd when iconStart is not provided', async () => {
    const IconEnd = () => <svg data-testid="icon-end" />;

    render(
      <Accordion>
        <AccordionTrigger title="Appearance" iconEnd={<IconEnd />} />
        <AccordionPanel>Content</AccordionPanel>
      </Accordion>,
    );

    expect(await screen.findByTestId('icon-end')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-start')).not.toBeInTheDocument();
  });

  it('renders no icons when neither iconStart nor iconEnd are provided', () => {
    render(
      <Accordion>
        <AccordionTrigger title="Default" />
        <AccordionPanel>Content</AccordionPanel>
      </Accordion>,
    );

    expect(screen.queryByTestId('icon-start')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-end')).not.toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});
