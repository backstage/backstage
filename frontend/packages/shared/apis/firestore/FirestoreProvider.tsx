import React, { FC, createContext, useContext } from 'react';
import FirestoreStorage from './FirestoreStorage';
import { FirestoreApi } from './types';
import getFirestoreApi from './getFirestoreApi';

const Context = createContext<FirestoreApi | undefined>(undefined);

type ProviderProps = {
  api: FirestoreStorage;
};

export const FirestoreProvider: FC<ProviderProps> = ({ api, children }) => {
  return <Context.Provider value={api} children={children} />;
};

export function useFirestore(): FirestoreApi {
  let firestoreApi = useContext(Context);
  if (!firestoreApi) {
    firestoreApi = getFirestoreApi();
  }
  return firestoreApi;
}
