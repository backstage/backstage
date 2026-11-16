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

import {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
  createContext,
} from 'react';
import { randomFallbackJoke } from './fallbackJokes';

export type JokeType = 'any' | 'programming';

export type Joke = {
  setup: string;
  punchline: string;
};

type RandomJokeContextValue = {
  loading: boolean;
  joke: Joke;
  /** True when the joke shown is a built-in fallback because the API request failed. */
  failed: boolean;
  type: JokeType;
  rerollJoke: Function;
  handleChangeType: Function;
};

export const DEFAULT_BASE_URL = 'https://api.app-jokes.workers.dev';

const REQUEST_TIMEOUT_MS = 10_000;

const Context = createContext<RandomJokeContextValue | undefined>(undefined);

const isJoke = (value: unknown): value is Joke =>
  typeof (value as Joke)?.setup === 'string' &&
  typeof (value as Joke)?.punchline === 'string';

const getNewJoke = async (baseUrl: string, type: string): Promise<Joke> => {
  const res = await fetch(
    `${baseUrl.replace(/\/+$/, '')}/jokes${
      type !== 'any' ? `/${type}` : ''
    }/random`,
    { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
  );
  if (!res.ok) {
    throw new Error(`Joke API responded with ${res.status}`);
  }
  const data = await res.json();
  const joke = Array.isArray(data) ? data[0] : data;
  if (!isJoke(joke)) {
    throw new Error('Joke API returned no joke');
  }
  return joke;
};

export const ContextProvider = (props: {
  children: JSX.Element;
  defaultCategory?: JokeType;
  baseUrl?: string;
}) => {
  const { children, defaultCategory, baseUrl = DEFAULT_BASE_URL } = props;

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [joke, setJoke] = useState<Joke>({
    setup: '',
    punchline: '',
  });
  const [type, setType] = useState<JokeType>(
    defaultCategory || ('programming' as JokeType),
  );
  const latestRequest = useRef(0);

  const rerollJoke = useCallback(() => {
    // Rerolls and category changes can overlap; only the newest request may update the card.
    const request = ++latestRequest.current;
    setLoading(true);
    getNewJoke(baseUrl, type).then(
      newJoke => {
        if (request !== latestRequest.current) return;
        setJoke(newJoke);
        setFailed(false);
        setLoading(false);
      },
      () => {
        if (request !== latestRequest.current) return;
        setJoke(randomFallbackJoke());
        setFailed(true);
        setLoading(false);
      },
    );
  }, [baseUrl, type]);

  const handleChangeType = (newType: JokeType) => {
    setType(newType);
  };

  useEffect(() => {
    rerollJoke();
  }, [rerollJoke]);

  const value: RandomJokeContextValue = {
    loading,
    joke,
    failed,
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
