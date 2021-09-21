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

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { InfoCard } from '@backstage/core-components';
import EditIcon from '@material-ui/icons/Edit';
import { Grid, IconButton } from '@material-ui/core';

function LayoutContract({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'red',
        width: '100%',
        height: '100%',
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'stretch',
      }}
    >
      {children}
    </div>
  );
}

type LayoutCardProps = {
  title: string;
  action: ReactNode;
  children: ReactNode;
};

type LayoutCardComponent = (props: LayoutCardProps) => JSX.Element | null;

const CardLayoutContext = createContext<LayoutCardComponent | undefined>(
  undefined,
);

function InfoCardLayout({ children }: { children: ReactNode }) {
  return (
    <CardLayoutContext.Provider
      value={props => (
        <InfoCard
          variant="gridItem"
          title={props.title}
          action={props.action}
          children={props.children}
        />
      )}
    >
      {children}
    </CardLayoutContext.Provider>
  );
}

function createCardExtension<T extends { title?: string }>({
  Component,
  defaultTitle,
}: {
  Component: (props: T) => JSX.Element | null;
  defaultTitle: string;
}): (props: T) => JSX.Element {
  return props => {
    const CardComponent = useContext(CardLayoutContext);
    if (!CardComponent) {
      throw new Error('No CardComponent');
    }
    const title = props.title ?? defaultTitle;
    return (
      <CardComponent title={title}>
        <LayoutContract>
          <Component {...props} />
        </LayoutContract>
      </CardComponent>
    );
  };
}

function LayoutCard(props: LayoutCardProps) {
  const CardComponent = useContext(CardLayoutContext);
  if (!CardComponent) {
    throw new Error('No CardComponent');
  }
  const title = props.title ?? props.title;
  return (
    <CardComponent title={title} action={props.action}>
      <LayoutContract>{props.children}</LayoutContract>
    </CardComponent>
  );
}

function useCardControls({
  title,
  action,
}: Partial<LayoutCardProps>): JSX.Element | null {
  const CardComponent = useContext(CardLayoutContext);
  if (!CardComponent) {
    throw new Error('No CardComponent');
  }
  return (
    <CardComponent title={title}>
      <LayoutContract>{children}</LayoutContract>
    </CardComponent>
  );
}

/*
  ##### Plugin Code #####
*/

/* Bunch of different options for how a card could be built */

// Plain, ownership of the card goes to the plugin, most permissive version
// Would be nice if we could enforce a bit more structure, with this pattern being a fallback

function option1() {
  function MyCard1() {
    return (
      <LayoutCard
        title="My Card"
        action={
          <IconButton title="Edit">
            <EditIcon />
          </IconButton>
        }
      >
        <div style={{ background: 'blue' }}>Hello I am a card</div>;
      </LayoutCard>
    );
  }

  const MyCardExtension1 = createComponentExtension({
    Component: MyCard1,
  });

  return MyCardExtension1;
}

// The card component only supplies content through children, the rest is hoisted
// via a hook call

function option2() {
  function MyCard2() {
    useCardControls({
      title: 'My Card',
      action: (
        <IconButton title="Edit">
          <EditIcon />
        </IconButton>
      ),
    });
    return <div style={{ background: 'blue' }}>Hello I am a card</div>;
  }

  const MyCardExtension2 = createCardExtension({
    Component: MyCard2,
  });

  return MyCardExtension2;
}

// Same as above but with several smaller hooks passed in through props to keep
// global API surface slim

function option3() {
  function MyCard3({ useCardTitle, useCardAction }) {
    useCardTitle('My Card');
    useCardAction(
      <IconButton title="Edit">
        <EditIcon />
      </IconButton>,
    );
    return <div style={{ background: 'blue' }}>Hello I am a card</div>;
  }

  const MyCardExtension3 = createCardExtension({
    Component: MyCard3,
  });

  return MyCardExtension3;
}

// Similar to the control hook versions but the communication happens through
// rendered components instead, slots

function option4() {
  function MyCard4() {
    return (
      <>
        <LayoutCard.Title title="My Card" />
        <LayoutCard.Action>
          <IconButton title="Edit">
            <EditIcon />
          </IconButton>
        </LayoutCard.Action>
        <div style={{ background: 'blue' }}>Hello I am a card</div>;
      </>
    );
  }

  const MyCardExtension4 = createCardExtension({
    Component: MyCard4,
  });

  return MyCardExtension4;
}

// This is what the homepage plugin does. It leaves the control to the plugin API
// but it gets a bit tedious to handle communication with the action

function option5() {
  function MyCard5() {
    return <div style={{ background: 'blue' }}>Hello I am a card</div>;
  }

  function MyCardAction5() {
    return (
      <IconButton title="Edit">
        <EditIcon />
      </IconButton>
    );
  }

  const MyCardExtension5 = createCardExtension({
    Component: MyCard5,
    Action: MyCardAction5,
    title: 'My Card',
  });

  return MyCardExtension5;
}

// Can we have a component that renders to an object?

function option6() {
  function MyCard6() {
    const [state, setState] = useState(1);

    return {
      title: `My Card ${state}`,
      action: (
        <IconButton title="Edit" onClick={() => setState(n => n + 1)}>
          <EditIcon />
        </IconButton>
      ),
      content: <div style={{ background: 'blue' }}>Hello I am a card</div>,
    };
  }

  // Kind of...

  function createCardExtension6({
    component,
  }: {
    component: () => { title?: string; action?: ReactNode; content: ReactNode };
  }) {
    const ExtensionCard = props => {
      const CardComponent = useContext(CardLayoutContext);
      if (!CardComponent) {
        throw new Error('No CardComponent');
      }
      const result = component();
      return (
        <CardComponent
          title={props.title ?? result.title}
          action={result.action}
        >
          <LayoutContract>{result.content}</LayoutContract>
        </CardComponent>
      );
    };
    return ExtensionCard;
  }

  const MyCardExtension6 = createCardExtension6({
    component: MyCard6,
  });

  return MyCardExtension6;
}

// So the issue is that we have multiple pieces of content that we want to render, all
// while sharing state between them in a simple way, preferably also via references.
// Option 6 is pretty nice, but not standard, can we make it less alien?

function option7() {
  // Passing in a render function is certainly less weird than returning an object, and
  // it's pretty much the same amount of shite. There's a bit less magic and more types,
  // but prolly worth it to avoid detracting from standard stuff.

  type LayoutCardRenderFunction = (props: {
    title?: string;
    action?: ReactNode;
    content: ReactNode;
  }) => JSX.Element;

  type CardExtensionProps = {
    // It's somewhat neat that this creates a very easily repeatable pattern for various
    // kinds of layout components that allow us to pass around all kinds of things.
    render: LayoutCardRenderFunction;
  };

  function MyCard7({ render }: CardExtensionProps) {
    const [state, setState] = useState(7);

    // What's the point of this though? It's essentially the same as option 1
    return render({
      title: `My Card ${state}`,
      action: (
        <IconButton title="Edit" onClick={() => setState(n => n + 1)}>
          <EditIcon />
        </IconButton>
      ),
      content: <div style={{ background: 'blue' }}>Hello I am a card</div>,
    });
  }

  function createCardExtension7({
    Component,
  }: {
    Component: (props: { render: LayoutCardComponent }) => JSX.Element | null;
  }) {
    const ExtensionCard = props => {
      const CardComponent = useContext(CardLayoutContext);
      if (!CardComponent) {
        throw new Error('No CardComponent');
      }
      const render: LayoutCardRenderFunction = ({ title, action, content }) => (
        <CardComponent title={props.title ?? title} action={action}>
          <LayoutContract>{content}</LayoutContract>
        </CardComponent>
      );
      return <Component render={render} />;
    };
    return ExtensionCard;
  }

  const MyCardExtension7 = createCardExtension7({
    Component: MyCard7,
  });

  return MyCardExtension7;
}

/*
  ##### App Code #####
*/

const MyCardExtension = option7();

export function Experiment7() {
  return (
    <div>
      <h1>Experiment 7</h1>
      <InfoCardLayout>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MyCardExtension />
          </Grid>
          <Grid item xs={6}>
            <div style={{ background: 'green', height: 200 }} />
          </Grid>
        </Grid>
      </InfoCardLayout>
    </div>
  );
}
