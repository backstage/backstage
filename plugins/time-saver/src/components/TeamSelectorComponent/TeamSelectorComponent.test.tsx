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
import { render, screen, fireEvent } from '@testing-library/react';
import TeamSelector from './TeamSelectorComponent';
import React from 'react';

describe('TeamSelector', () => {
  const mockOnTeamChange = jest.fn();
  const mockOnClearButtonClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the TeamSelector component', () => {
    render(
      <TeamSelector
        onTeamChange={mockOnTeamChange}
        onClearButtonClick={mockOnClearButtonClick}
      />,
    );

    expect(screen.getByLabelText('Team')).toBeInTheDocument();
  });

  it('should call onTeamChange when a team is selected', () => {
    render(
      <TeamSelector
        onTeamChange={mockOnTeamChange}
        onClearButtonClick={mockOnClearButtonClick}
      />,
    );

    const teamSelect = screen.getByLabelText('Team');
    fireEvent.change(teamSelect, { target: { value: 'Engineering' } });

    expect(mockOnTeamChange).toHaveBeenCalledWith('Engineering');
  });

  it('should call onClearButtonClick when the Clear button is clicked', () => {
    render(
      <TeamSelector
        onTeamChange={mockOnTeamChange}
        onClearButtonClick={mockOnClearButtonClick}
      />,
    );

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(mockOnClearButtonClick).toHaveBeenCalled();
  });
});
