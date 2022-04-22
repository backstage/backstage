import React, { ReactNode } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Tooltip, Box } from '@material-ui/core';
import { PRCardFormating } from '../../utils/types';

type Option = {
  icon: ReactNode;
  value: string;
  ariaLabel: string;
}

type Props = {
  value: string[];
  onClickOption: (selectedOptions: PRCardFormating[]) => void;
  options: Option[];
}

const PullRequestBoardOptions = (props: Props) => {
  const { value, onClickOption, options } = props;
  return (
    <ToggleButtonGroup
      size="small"
      value={value}
      onChange={(_event, selectedOptions) => onClickOption(selectedOptions)}
      aria-label="Pull Request board settings"
    >
      {
        options.map(({ icon, value: toggleValue, ariaLabel }, index) => (
          <ToggleButton value={toggleValue} aria-label={ariaLabel} key={`${ariaLabel}-${index}`}>
            <Tooltip title={ariaLabel}>
              <Box display='flex' justifyContent='center' alignItems='center'>
                {icon}
              </Box>
            </Tooltip>
          </ToggleButton>
        ))
      }
    </ToggleButtonGroup>

  );
};

export default PullRequestBoardOptions;
