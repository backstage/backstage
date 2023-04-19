import { Box, Chip, styled } from '@mui/material';
import { ChipCategory } from '@site/src/util/types';
import React from 'react';


type Props = {
  categories: ChipCategory[];
  handleChipClick: (name: string) => void;
};

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const PluginsChipsFilter = ({ categories, handleChipClick }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        background: 'transparent',
        p: 0.5,
      }}
      component="ul"
    >
      {categories.map((chip) => {
        return (
          <ListItem key={chip.name}>
            <Chip
              sx={{
                background: chip.isSelected ? '#FFFFFF' : '#36BAA2',
              }}
              label={chip.name}
              onClick={() => handleChipClick(chip.name)}
            />
          </ListItem>
        );
      })}
    </Box>
  );
};

export default PluginsChipsFilter;