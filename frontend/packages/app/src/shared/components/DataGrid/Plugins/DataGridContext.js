import React, { useState } from 'react';

function useDataGridState() {
  // DataGridPopover states
  const [popoverAnchorEl, setPopoverAnchorEl] = useState();
  const [popoverValue, setPopoverValue] = useState();

  return { setPopoverAnchorEl, popoverAnchorEl, setPopoverValue, popoverValue };
}

/**
 * This react context enables children of DataGrid (e.g. Cells) to make use of
 * an internal shared state.
 *
 * @example
 * // SomeDataGridChild.js
 * import React, { useContext } from 'react';
 * import { DataGridContext } from 'lib/DataGrid/Plugins/DataGridContext';
 *
 * const { setSomeValue } = useContext(DataGridContext);
 * const handleClick = (value) => {
 *   setSomeVaule('hello');
 * };
 */
const DataGridContext = React.createContext();

export function DataGridContextProvider(props) {
  return <DataGridContext.Provider value={useDataGridState()}>{props.children}</DataGridContext.Provider>;
}

export default DataGridContext;
