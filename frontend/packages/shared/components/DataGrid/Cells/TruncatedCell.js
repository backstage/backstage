import React, { useContext } from 'react';
import DataGridContext from 'shared/components/DataGrid/Plugins/DataGridContext';

/**
 * Truncate contents of cell if overflowing. Expands on click to show full
 * contents
 */
export default function TruncatedCell({ value }) {
  const { setPopoverAnchorEl, setPopoverValue } = useContext(DataGridContext);

  const handleClick = (elem, value) => {
    setPopoverAnchorEl(elem);
    setPopoverValue(value);
  };

  return (
    <span
      title={value}
      role="button"
      tabIndex={0}
      data-testid="truncated-cell"
      onClick={event => handleClick(event.target, value)}
      onKeyPress={event => handleClick(event.target, value)}
    >
      {value}
    </span>
  );
}
