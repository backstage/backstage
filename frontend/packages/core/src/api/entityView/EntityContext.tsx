import React, { createContext, useContext, FC } from 'react';
import { EntityConfig } from '../entity/EntityKind';

type Value = {
  config: EntityConfig;
  id?: string;
};

const Context = createContext<Value | undefined>(undefined);

type Props = {
  config: EntityConfig;
  id?: string;
};

export const EntityContextProvider: FC<Props> = ({ config, id, children }) => (
  <Context.Provider value={{ config, id }} children={children} />
);

export const useEntity = (): { kind: string; id: string } => {
  const value = useContext(Context);
  if (!value) {
    throw new Error('No entity context available');
  }
  if (!value.id) {
    throw new Error('Entity context does not contain entity id');
  }
  return { kind: value.config.kind, id: value.id };
};

export const useEntityConfig = (): EntityConfig => {
  const value = useContext(Context);
  if (!value) {
    throw new Error('No entity context available');
  }
  return value.config;
};

export const useEntityUri = (): string => {
  const { kind, id } = useEntity();
  return `entity:${kind}:${id}`;
};
