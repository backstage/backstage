import { useContext, useEffect, useReducer } from 'react';
import { SettingValue, SettingSetFunc, SettingsStoreContext } from './types';
import Setting from './Setting';

type State<T> = {
  loading: boolean;
  value: T | undefined;
};

type Action<T> = { type: 'CLEAR' } | { type: 'SET'; value: T | undefined };

const initialState = { loading: true, value: undefined };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'CLEAR':
      if (state.value === undefined) {
        return state;
      }
      return { ...state, value: undefined };
    case 'SET':
      return { loading: false, value: action.value };
    default:
      return state;
  }
}

const useSetting = <T extends SettingValue>(
  setting: Setting<T>,
): [T, SettingSetFunc<T>, boolean] | [T, undefined, boolean] => {
  const settingStore = useContext(SettingsStoreContext);
  const [state, dispatch] = useReducer<(state: State<T>, action: Action<T>) => State<T>>(reducer, initialState);

  useEffect(() => {
    if (!settingStore) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    return settingStore.subscribe(setting.id, (value: T | undefined) => {
      dispatch({ type: 'SET', value });
    });
  }, [setting, settingStore]);

  const returnedValue = state.value === undefined ? setting.defaultValue : state.value;

  if (settingStore) {
    const setValue: SettingSetFunc<T> = async newValue => {
      await settingStore.set(setting.id, newValue);
    };

    return [returnedValue, setValue, state.loading];
  }

  return [returnedValue, undefined, state.loading];
};

export default useSetting;
