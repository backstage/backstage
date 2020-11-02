<div>
  --- --- # SessionStateApi The SessionStateApi type is defined at
  [packages/core-api/src/apis/definitions/auth.ts:201](https://github.com/spotify/backstage/blob/82d329555c16af46db9b4e5cd2f44a3cc006a52e/packages/core-api/src/apis/definitions/auth.ts#L201).
  The following Utility APIs implement this type: -
  [auth0AuthApiRef](./README.md#auth0auth) -
  [githubAuthApiRef](./README.md#githubauth) -
  [gitlabAuthApiRef](./README.md#gitlabauth) -
  [googleAuthApiRef](./README.md#googleauth) -
  [microsoftAuthApiRef](./README.md#microsoftauth) -
  [oauth2ApiRef](./README.md#oauth2) - [oktaAuthApiRef](./README.md#oktaauth) ##
  Members ### sessionState\$()
  <pre>
    sessionState$(): <a href="#observable">Observable</a>&lt;
    <a href="#sessionstate">SessionState</a>&gt;{"\n"}
  </pre>
  ## Supporting types These types are part of the API declaration, but may not
  be unique to this API. ### Observable Observable sequence of values and
  errors, see TC39. https://github.com/tc39/proposal-observable This is used as
  a common return type for observable values and can be created using many
  different observable implementations, such as zen-observable or RxJS 5.
  <pre>
    export type Observable&lt;T&gt; = {"{"}
    {"\n"}
    {"  "}/**{"\n"}
    {"   "}* Subscribes to this observable to start receiving new values.{"\n"}
    {"   "}*/{"\n"}
    {"  "}subscribe(observer: <a href="#observer">Observer</a>&lt;T&gt;):{" "}
    <a href="#subscription">Subscription</a>;{"\n"}
    {"  "}subscribe({"\n"}
    {"    "}onNext: (value: T) =&gt; void,{"\n"}
    {"    "}onError?: (error: Error) =&gt; void,{"\n"}
    {"    "}onComplete?: () =&gt; void,{"\n"}
    {"  "}): <a href="#subscription">Subscription</a>;{"\n"}
    {"}"}
    {"\n"}
  </pre>
  Defined at
  [packages/core-api/src/types.ts:53](https://github.com/spotify/backstage/blob/82d329555c16af46db9b4e5cd2f44a3cc006a52e/packages/core-api/src/types.ts#L53).
  Referenced by: [sessionState\$](#sessionstate). ### Observer This file
  contains non-react related core types used through Backstage. Observer
  interface for consuming an Observer, see TC39.
  <pre>
    export type Observer&lt;T&gt; = {"{"}
    {"\n"}
    {"  "}next?(value: T): void;{"\n"}
    {"  "}error?(error: Error): void;{"\n"}
    {"  "}complete?(): void;{"\n"}
    {"}"}
    {"\n"}
  </pre>
  Defined at
  [packages/core-api/src/types.ts:24](https://github.com/spotify/backstage/blob/82d329555c16af46db9b4e5cd2f44a3cc006a52e/packages/core-api/src/types.ts#L24).
  Referenced by: [Observable](#observable). ### SessionState Session state
  values passed to subscribers of the SessionStateApi.
  <pre>
    export enum SessionState {"{"}
    {"\n"}
    {"  "}SignedIn = 'SignedIn',{"\n"}
    {"  "}SignedOut = 'SignedOut',{"\n"}
    {"}"}
    {"\n"}
  </pre>
  Defined at
  [packages/core-api/src/apis/definitions/auth.ts:192](https://github.com/spotify/backstage/blob/82d329555c16af46db9b4e5cd2f44a3cc006a52e/packages/core-api/src/apis/definitions/auth.ts#L192).
  Referenced by: [sessionState\$](#sessionstate). ### Subscription Subscription
  returned when subscribing to an Observable, see TC39.
  <pre>
    export type Subscription = {"{"}
    {"\n"}
    {"  "}/**{"\n"}
    {"   "}* Cancels the subscription{"\n"}
    {"   "}*/{"\n"}
    {"  "}unsubscribe(): void;{"\n"}
    {"\n"}
    {"  "}/**{"\n"}
    {"   "}* Value indicating whether the subscription is closed.{"\n"}
    {"   "}*/{"\n"}
    {"  "}readonly closed: Boolean;{"\n"}
    {"}"}
    {"\n"}
  </pre>
  Defined at
  [packages/core-api/src/types.ts:33](https://github.com/spotify/backstage/blob/82d329555c16af46db9b4e5cd2f44a3cc006a52e/packages/core-api/src/types.ts#L33).
  Referenced by: [Observable](#observable).
</div>;
