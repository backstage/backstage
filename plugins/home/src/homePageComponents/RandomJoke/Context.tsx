/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useContext, createContext } from 'react';
import jokes from './jokes.json';

export type JokeType = 'any' | 'programming';

type Joke = {
  setup: string;
  punchline: string;
};

type RandomJokeContextValue = {
  joke: Joke;
  type: JokeType;
  rerollJoke: Function;
  handleChangeType: Function;
};

const Context = createContext<RandomJokeContextValue | undefined>(undefined);

const pickJoke = (type: string, current?: Joke): Joke => {
  const ofType = jokes.filter(joke => joke.type === type);
  // No joke has the type 'any', so it draws from every joke. So does a
  // category with no jokes, such as 'dad' from settings saved before that
  // category was removed.
  const pool = ofType.length > 0 ? ofType : jokes;
  const candidates = pool.filter(joke => joke.setup !== current?.setup);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

export const ContextProvider = (props: {
  children: JSX.Element;
  defaultCategory?: JokeType;
}) => {
  const { children, defaultCategory } = props;

  const [type, setType] = useState<JokeType>(
    defaultCategory || ('programming' as JokeType),
  );
  const [joke, setJoke] = useState<Joke>(() => pickJoke(type));

  const rerollJoke = () => {
    setJoke(current => pickJoke(type, current));
  };

  const handleChangeType = (newType: JokeType) => {
    setType(newType);
    setJoke(current => pickJoke(newType, current));
  };

  const value: RandomJokeContextValue = {
    joke,
    type,
    rerollJoke,
    handleChangeType,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRandomJoke = () => {
  const value = useContext(Context);

  if (value === undefined) {
    throw new Error('useRandomJoke must be used within a RandomJokeProvider');
  }

  return value;
};

export default Context;
