export type LoggedOutState = { type: 'LOGGED_OUT' };
export type LoggingInState = { type: 'LOGGING_IN' };
export type LoggedInState = { type: 'LOGGED_IN'; user: string };
export type LoggingOutState = { type: 'LOGGING_OUT' };
export type LoginFailedState = { type: 'LOGIN_FAILED'; error: Error };
export type LoginState =
  | LoggedOutState
  | LoggingInState
  | LoggedInState
  | LoggingOutState
  | LoginFailedState;
