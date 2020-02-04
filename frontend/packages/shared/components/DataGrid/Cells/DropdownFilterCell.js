import { MenuItem, TableCell, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class DropdownFilterCell extends Component {
  static propTypes = {
    filter: PropTypes.object,
    onFilter: PropTypes.func,
    options: PropTypes.array,
  };

  render() {
    const { filter, onFilter, options } = this.props;
    return (
      <TableCell>
        <Select
          value={filter ? filter.value : ''}
          onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options
            .filter(e => e)
            .map(e => (
              <MenuItem key={e} value={e}>
                {e}
              </MenuItem>
            ))}
        </Select>
      </TableCell>
    );
  }
}
