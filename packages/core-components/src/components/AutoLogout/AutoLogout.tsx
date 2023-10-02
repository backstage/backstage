/*
 * Copyright 2023 The Backstage Authors
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
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import React, { useEffect, useMemo, useState } from 'react';
import {
  EventsType,
  IIdleTimer,
  workerTimers,
  useIdleTimer,
} from 'react-idle-timer';

import {
  LAST_SEEN_ONLINE_STORAGE_KEY,
  useLogoutDisconnectedUserEffect,
} from './disconnectedUsers';
import { StillTherePrompt } from './StillTherePrompt';
import { DefaultTimestampStore, TimestampStore } from './timestampStore';

type AutoLogoutTrackableEvent = EventsType;

/** @public */
export type AutoLogoutProps = {
  /**
   * Enable/disable the AutoLogoutMechanism.
   * defauls to true.
   */
  enabled?: boolean;
  /**
   * The amount of time (in minutes) of inactivity
   * after which the user is automatically logged out.
   * defaults to 60 minutes.
   */
  idleTimeoutMinutes?: number;
  /**
   * The number of seconds before the idleTimeout expires,
   * at which the user will be alerted by a Dialog that
   * they are about to be logged out.
   * defaults to 10 seconds
   */
  promptBeforeIdleSeconds?: number;
  /**
   * Enable/disable the usage of Node's worker thread timers instead of main thread timers.
   * This is helpful if you notice that the your browser is killing inactive tab's timers, like the one used by AutoLogout.
   * If you experience some browser incompatibility, you may try to set this to false.
   * defaults to true.
   */
  useWorkerTimers?: boolean;
  /**
   * Enable/disable the autologout for disconnected users.
   * disconnected users are the ones that are logged in but have no Backstage tab open in their browsers.
   * If enabled, disconnected users will be automatically logged out after `idleTimeoutMinutes`
   * defaults to true
   */
  logoutIfDisconnected?: boolean;
};

type AutoLogoutInternalProps = Omit<Required<AutoLogoutProps>, 'enabled'> & {
  events: AutoLogoutTrackableEvent[];
  promptOpen: boolean;
  setPromptOpen: (value: boolean) => void;
  remainingTimeCountdown: number;
  setRemainingTimeCountdown: (amount: number) => void;
  identityApi: IdentityApi;
  lastSeenOnlineStore: TimestampStore;
};

const ConditionalAutoLogout = ({
  idleTimeoutMinutes,
  events,
  useWorkerTimers,
  logoutIfDisconnected,
  promptBeforeIdleSeconds,
  promptOpen,
  setPromptOpen,
  remainingTimeCountdown,
  setRemainingTimeCountdown,
  identityApi,
  lastSeenOnlineStore,
}: AutoLogoutInternalProps): JSX.Element => {
  const promptBeforeIdleMillis = promptBeforeIdleSeconds * 1000;
  const promptBeforeIdle = promptBeforeIdleMillis > 0 ? true : false;

  const onPrompt = async () => {
    // onPrompt will be called `promptBeforeIdle` milliseconds before `timeout`.
    // All events are disabled while the prompt is active.
    // If the user wishes to stay active, call the `activate()` method.
    // You can get the remaining prompt time with the `getRemainingTime()` method,
    setPromptOpen(true);
    setRemainingTimeCountdown(promptBeforeIdleMillis);
  };

  const onIdle = () => {
    // onIdle will be called after the timeout is reached.
    // Events will be rebound as long as `stopOnMount` is not set.
    setPromptOpen(false);
    setRemainingTimeCountdown(0);
    identityApi.signOut();
  };

  const onActive = () => {
    // onActive will only be called if `activate()` is called while `isPrompted()`
    // is true. Here you will also want to close your modal and perform
    // any active actions.
    setPromptOpen(false);
    setRemainingTimeCountdown(0);
  };

  const onAction = (
    _event?: Event | undefined,
    _idleTimer?: IIdleTimer | null,
  ) => {
    // onAction will be called if any user event is detected. The list of events that triggers a user event detection is the list of configured events
    // If any user event is detected we update the Last seen online in storage
    lastSeenOnlineStore.save(new Date());
  };

  const timer = useIdleTimer({
    timeout: idleTimeoutMinutes * 60 * 1000,
    events: events,
    crossTab: true,
    name: 'autologout-timer',
    timers: useWorkerTimers ? workerTimers : undefined,
    onIdle: onIdle,
    onActive: promptBeforeIdle ? onActive : undefined,
    onAction: logoutIfDisconnected ? onAction : undefined,
    onPrompt: promptBeforeIdle ? onPrompt : undefined,
    promptBeforeIdle: promptBeforeIdle ? promptBeforeIdleMillis : undefined,
    syncTimers: 1000,
  });

  return (
    <>
      {promptBeforeIdle && (
        <StillTherePrompt
          idleTimer={timer}
          open={promptOpen}
          setOpen={setPromptOpen}
          remainingTime={remainingTimeCountdown}
          setRemainingTime={setRemainingTimeCountdown}
          promptTimeoutMillis={promptBeforeIdleMillis}
        />
      )}
    </>
  );
};

const defaultConfig: Required<AutoLogoutProps> = {
  enabled: true,
  idleTimeoutMinutes: 0.5,
  promptBeforeIdleSeconds: 10,
  useWorkerTimers: true,
  logoutIfDisconnected: true,
};

/**
 * A list of DOM events that the activity tracker will use to determine if the user is active or not.
 */
const defaultTrackedEvents: AutoLogoutTrackableEvent[] = [
  'mousemove',
  'keydown',
  'wheel',
  'DOMMouseScroll',
  'mousewheel',
  'mousedown',
  'touchstart',
  'touchmove',
  'MSPointerDown',
  'MSPointerMove',
  'visibilitychange',
];

/**
 * Parses configuration for the AutoLogout. Properties configured in `app-config` take precedence over the props passed to the React component.
 * If neither props nor config properties are found, a default value will be set accordingly.
 */
const parseConfig = (
  configApi: ConfigApi,
  props: AutoLogoutProps,
): Required<AutoLogoutProps> => {
  return {
    enabled:
      configApi.getOptionalBoolean('auth.autologout.enabled') ??
      props.enabled ??
      defaultConfig.enabled,
    idleTimeoutMinutes:
      configApi.getOptionalNumber('auth.autologout.idleTimeoutMinutes') ??
      props.idleTimeoutMinutes ??
      defaultConfig.idleTimeoutMinutes,
    promptBeforeIdleSeconds:
      configApi.getOptionalNumber('auth.autologout.promptBeforeIdleSeconds') ??
      props.promptBeforeIdleSeconds ??
      defaultConfig.promptBeforeIdleSeconds,
    useWorkerTimers:
      configApi.getOptionalBoolean('auth.autologout.useWorkerTimers') ??
      props.useWorkerTimers ??
      defaultConfig.useWorkerTimers,
    logoutIfDisconnected:
      configApi.getOptionalBoolean('auth.autologout.logoutIfDisconnected') ??
      props.logoutIfDisconnected ??
      defaultConfig.logoutIfDisconnected,
  };
};

/**
 * The Autologout feature enables platform engineers to add a mechanism to log out users after a configurable amount of time of inactivity.
 * When enabled, the mechanism will track user actions (mouse movement, mouse click, key pressing, taps, etc.) in order to determine if they are active or not.
 * After a certain amount of inactivity/idle time, the user session is invalidated and they are required to sign in again.
 *
 * @public
 */
export const AutoLogout = (props: AutoLogoutProps): JSX.Element | null => {
  const identityApi = useApi(identityApiRef);
  const configApi = useApi(configApiRef);
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    // if the user is not logged in, the autologout feature won't affect the app even if enabled
    async function isLoggedIn(identity: IdentityApi) {
      if ((await identity.getCredentials()).token) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }
    isLoggedIn(identityApi);
  }, [identityApi]);

  const {
    enabled,
    idleTimeoutMinutes,
    promptBeforeIdleSeconds,
    logoutIfDisconnected,
    useWorkerTimers,
  }: AutoLogoutProps = useMemo(() => {
    return parseConfig(configApi, props);
  }, [configApi, props]);

  useEffect(() => {
    if (idleTimeoutMinutes < 0.5) {
      throw new Error(
        '❌ idleTimeoutMinutes property should be >= 0.5 minutes (30 seconds).',
      );
    }

    if (promptBeforeIdleSeconds < 0) {
      throw new Error(
        '❌ promptBeforeIdleSeconds property should be >= 0 seconds. Set to 0 to disable the prompt.',
      );
    }

    if (idleTimeoutMinutes * 60 <= promptBeforeIdleSeconds) {
      throw new Error(
        `❌ promptBeforeIdleSeconds should be smaller than idleTimeoutMinutes`,
      );
    }
  }, [idleTimeoutMinutes, promptBeforeIdleSeconds]);

  const lastSeenOnlineStore: TimestampStore = useMemo(
    () => new DefaultTimestampStore(LAST_SEEN_ONLINE_STORAGE_KEY),
    [],
  );
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  const [remainingTimeCountdown, setRemainingTimeCountdown] =
    useState<number>(0);

  useLogoutDisconnectedUserEffect({
    enableEffect: logoutIfDisconnected,
    autologoutIsEnabled: enabled && isLogged,
    idleTimeoutSeconds: idleTimeoutMinutes * 60,
    lastSeenOnlineStore,
    identityApi,
  });

  if (!enabled || !isLogged) {
    return null;
  }

  return (
    <ConditionalAutoLogout
      idleTimeoutMinutes={idleTimeoutMinutes}
      promptBeforeIdleSeconds={promptBeforeIdleSeconds}
      useWorkerTimers={useWorkerTimers}
      events={defaultTrackedEvents}
      logoutIfDisconnected={logoutIfDisconnected}
      promptOpen={promptOpen}
      setPromptOpen={setPromptOpen}
      remainingTimeCountdown={remainingTimeCountdown}
      setRemainingTimeCountdown={setRemainingTimeCountdown}
      identityApi={identityApi}
      lastSeenOnlineStore={lastSeenOnlineStore}
    />
  );
};
