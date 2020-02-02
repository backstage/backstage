import React, { FC } from 'react';
import helloWorld, { MyComponent } from '@backstage/plugin-hello-world';

const App: FC<{}> = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>This is Backstage with plugin {helloWorld?.id ?? 'wat'}</p>
        <MyComponent />
      </header>
    </div>
  );
};

export default App;
