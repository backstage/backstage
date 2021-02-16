import React, { FunctionComponent } from 'react';
import { createReducerContext } from 'react-use';

type State = Record<string, any>;

type Action = {
  type: 'setVariable';
  payload: {
    name: string;
    value: any;
  };
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setVariable': {
      const { name, value } = action.payload;
      return { ...state, [name]: value };
    }

    default:
      throw new Error(`Invalid action`);
  }
};

const initialState: State = {};

const [useVariables, VariablesProvider] = createReducerContext(
  reducer,
  initialState,
);

export { VariablesProvider };

export function VariableInput({
  name,
  style,
}: {
  name: string;
  style?: React.CSSProperties;
}) {
  const [variables, dispatch] = useVariables();

  return (
    <input
      style={style}
      name={name}
      value={variables[name] || ''}
      onChange={event => {
        dispatch({
          type: 'setVariable',
          payload: {
            name,
            value: event.target.value,
          },
        });
      }}
    />
  );
}

export function Variable({
  name,
  fallback = '',
}: {
  name: string;
  fallback?: string;
}) {
  const [variables] = useVariables();

  return <>{variables[name] || fallback}</>;
}
