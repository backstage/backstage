import React, { FC, RefObject, createRef, createContext, useCallback, useState, useContext, useEffect } from 'react';
import { Theme, makeStyles } from '@material-ui/core';

// The number of milliseconds spent transitioning between columns
const transitionMillis = 250;

// Global unique ID for columns
const getUid = (() => {
  let uid = 0;
  return () => {
    return uid++;
  };
})();

const useStyles = makeStyles<Theme>({
  outer: {
    width: 0,
    maxWidth: '80vw',
    overflow: 'hidden',
    transition: `width ${transitionMillis}ms ease-in-out`,
    height: '100%',
  },
  inner: {
    display: 'flex',
    flexWrap: 'nowrap',
    transition: `margin-left ${transitionMillis}ms ease-in-out`,
    width: 0,
    marginLeft: 0,
    height: '100%',
  },
  column: {
    flexGrow: 0,
    flexShrink: 0,
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
});

type Column = {
  id: number;
  element: JSX.Element;
  columnRef: RefObject<HTMLDivElement>;
};

type InternalState = {
  columns: Column[];
  columnIndex: number;
};

type State = {
  columns: Column[];
  columnIndex: number;
  push: (element: JSX.Element) => void;
  pop: () => void;
};

const columnStackContext = createContext<State>({} as State);

const ProvideColumnStackContext: FC<{}> = ({ children }) => {
  const state = useProvideState();
  return <columnStackContext.Provider value={state}>{children}</columnStackContext.Provider>;
};

const useProvideState: () => State = () => {
  const [state, setState] = useState<InternalState>({ columns: [], columnIndex: -1 });

  const push = useCallback(
    (element: JSX.Element) => {
      setState(oldState => {
        const nextUid = getUid();
        const nextColumnIndex = oldState.columnIndex + 1;
        const nextColumn: Column = { id: nextUid, element, columnRef: createRef<HTMLDivElement>() };
        const nextColumns = [...oldState.columns.slice(0, nextColumnIndex), nextColumn];
        return {
          columns: nextColumns,
          columnIndex: nextColumnIndex,
        };
      });
    },
    [setState],
  );

  const pop = useCallback(() => {
    setState(oldState => {
      if (oldState.columnIndex < 0) {
        return oldState;
      }

      // We postpone the deletion of the columns to the right, since they will still be partially
      // visible to the right during the transition period
      const idsToDelete = oldState.columns.slice(oldState.columnIndex, oldState.columns.length).map(c => c.id);
      setTimeout(() => {
        setState(x => ({
          columns: x.columns.filter(c => !idsToDelete.includes(c.id)),
          columnIndex: x.columnIndex,
        }));
      }, transitionMillis);

      return {
        columns: oldState.columns,
        columnIndex: oldState.columnIndex - 1,
      };
    });
  }, [setState]);

  return {
    columns: state.columns,
    columnIndex: state.columnIndex,
    push,
    pop,
  };
};

const useColumnSizes = (state: State) => {
  const [outerWidth, setOuterWidth] = useState(0);
  const [innerWidth, setInnerWidth] = useState(0);
  const [innerMargin, setInnerMargin] = useState(0);
  const [epoch, setEpoch] = useState(0);

  const columnWidth = (column: Column) => (column.columnRef.current ? column.columnRef.current.offsetWidth : 0);

  useEffect(() => {
    // Refs may not be fulfilled immediately; we can't update these measurements until they are.
    // So give up and retry again soon.
    if (state.columnIndex < 0 || state.columns.some(c => !c.columnRef.current)) {
      setEpoch(epoch + 1);
      return;
    }

    setOuterWidth(columnWidth(state.columns[state.columnIndex]));
    setInnerWidth(state.columns.reduce((x, column) => x + columnWidth(column), 0));
    setInnerMargin(-state.columns.slice(0, state.columnIndex).reduce((x, column) => x + columnWidth(column), 0));
  }, [state, epoch]);

  return { outerWidth, innerWidth, innerMargin };
};

const ColumnStackContents: FC<ColumnStackProps> = ({ initialElement }) => {
  const state = useContext(columnStackContext);
  const { outerWidth, innerWidth, innerMargin } = useColumnSizes(state);
  const classes = useStyles();

  useEffect(() => {
    if (!state.columns.length) {
      state.push(initialElement);
    }
  }, [state, initialElement]);

  const { columns, columnIndex } = state;
  if (columnIndex < 0 || columnIndex >= columns.length) {
    return null;
  }

  return (
    <div className={classes.outer} style={{ width: outerWidth }}>
      <div className={classes.inner} style={{ width: innerWidth, marginLeft: innerMargin }}>
        {columns.map(column => (
          <div key={column.id} className={classes.column} ref={column.columnRef}>
            {column.element}
          </div>
        ))}
      </div>
    </div>
  );
};

/*
 * Public API
 */

export type ColumnStackProps = {
  initialElement: JSX.Element;
};

export type ColumnStackControls = {
  push: (element: JSX.Element) => void;
  pop: () => void;
};

export const ColumnStack: FC<ColumnStackProps> = props => {
  return (
    <ProvideColumnStackContext>
      <ColumnStackContents {...props} />
    </ProvideColumnStackContext>
  );
};

export const useColumnStackControls: () => ColumnStackControls = () => {
  const state = useContext(columnStackContext);
  return {
    push: state.push,
    pop: state.pop,
  };
};
