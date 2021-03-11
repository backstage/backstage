---
id: testing
title: Testing with Jest
description: Documentation on How to do unit testing with Jest
---

Backstage uses [Jest](https://facebook.github.io/jest/) for all our unit testing
needs.

Jest is a Facebook-built unit testing framework specifically built for React. It
follows in the footsteps of other classic Node.js unit testing-related
frameworks and libraries like [Mocha](https://mochajs.org/),
[Jasmine](https://jasmine.github.io/), and [Chai](http://www.chaijs.com/).

## Running Tests

Running all tests:

    yarn test

Running an individual test (e.g. `MyComponent.test.js`):

    yarn test MyComponent

To run both `MyComponent.test.js` and `MyControl.test.js` suite of tests:

    yarn test MyCo

Note: if `console.logs` are not appearing, run only the individual test you are
working on.
[This is a bug in Jest](https://github.com/facebook/jest/issues/2441).

## Naming Test Files

Tests should be named `[filename].test.js`.

For example, the tests for **`Link.js`** exist in the file **`Link.test.js`**.

## Third-Party Dependencies

Jest has its own built-in assertion library with `expect`, so there is no need
to `import` a third-party library like some of the older frameworks required.
However since assertion libraries simply throw errors, it would be feasible to
import a third-party library if you needed (like Chai or
[Sinon](http://sinonjs.org/)).

We use the light-weight
[react-testing-library](https://github.com/kentcdodds/react-testing-library) to
render React components.

## Testing Utilities

TODO.

## Writing Unit Tests

The following principles are good guides for determining if you are writing high
quality frontend unit tests.

### Bad Unit Test Principle

> No unit test is better than a bad one.

Writing a poor unit test:

- Gives the illusion your code is more secure or reliable than it actually is.
- Functions equivalent to a bad comment, in that it leads the next developer
  into erroneous assumptions.
- Adds to future work by requiring updates to the unit test for irrelevant code
  changes.

### Input/Output Principle

> A unit test verifies an output matches an expected input.

For backend, this would be that when you provide configuration X, then the
object responds with Y. For frontend, this would be that when you provide
properties X to a component, then the visual functionality responds with Y.

### Blackbox Principle

> A good unit test does not tell the object how it should do its job but should
> only compare inputs to outputs.

Consider a unit test for a form. A good unit test would not test the order of
the form fields. Instead, it would verify that the inputs to the form fields
lead to a certain backend call when submit is clicked.

### Scalability Principle

> Unit test quality is directly proportionate to how much code can change
> without having to touch the unit test.

This is often overlooked! A unit test is not a test to verify the code never
changes. Poor unit tests are written so that every time you make a tiny change
to the code, you have to update the unit test. A good unit test suite allows a
lot of flexibility in _how_ the code is written so that future refactoring can
occur without having to touch the original unit tests.

### Increasing Complexity Principle

> The ordering of unit tests in a suite should proceed from least specific to
> most specific.

Jest runs all tests in the order in which they are provided, regardless of the
depth of `describe()` blocks you provide. We can use this to help us write tests
that will help the next developer debug what they broke.

The idea here is that if they were to break a unit test, the next developer
should be able to tell from the order in which the tests broke what they should
do to fix things.

For example, good unit tests will verify the arguments to a function in a test
prior to a test that validates the output. If you do not test this, then simply
throwing an error saying that output was incorrect will lead the next developer
into thinking they may have broken the entire functionality of the object rather
than simply letting them know they had an invalid input.

### Broken Functionality Principle

> Generally, a unit test should not test exactly how the output appears, it
> should test that the functionality has an expected _general_ response to an
> input change.

This piggybacks the Scalability Principle and applies primarily to frontend
development. As a general rule of thumb, frontends should be flexible enough so
that the UX or design can change while touching the least amount of code
possible. So for example, a poor unit test would verify the color of a button
when it is hovered. This would be a poor unit test, because if you decide to
test a slightly different color on the button the unit test will break. A better
unit test would verify that the button's CSS classname is assigned properly on
hover or test for something completely different.

### Example: Loading Indicator

A classic unit test on frontends is verifying a loading indicator displays when
a backend request is being made.

**Here are some things we could test for _when data is loading_:**

> Did the internal `loading` state of the component change? (poor)

This is not a great test because it does not actually test that the
functionality (displaying a message to the user) actually happens. It also
breaks the Blackbox Principle by expecting the internals of the component must
work a certain way. This could be a good test on its own right, but it does not
actually achieve the goal of verifying that if our input (loading data) occurs,
then the output (displaying a message to the user) has happened.

> Did the text `"Loading!"` appear in the DOM? (better)

This is a better test because it validates functionality, but it breaks the
Scalability principle. By testing for `'Loading...'` we are linking our test
code to the component's message. If we want to add internationalization or
simply change the message to something more specific we will break our test and
have to update code in two places.

> Did `<Loading />` get mounted? (best)

This is the best test of these examples (there could be more depending on your
implementation).

Verifying that `<Loading />` is mounted when data is loading is the best test
because it fulfills all the principles above:

✓ **Fulfills Input/Output Principle**: Verifies the output changes when the
input changes

✓ **Fulfills Blackbox Principle**: Does not verify _how_ the `<Loading />`
component is mounted, just that it is mounted in response to the input.

✓ **Fulfills Scalability Principle**: If we decide to refactor the entire way
the loading indicator has displayed the test still works without touching it.

✓ **Fulfills Broken Functionality Principle**: this test verifies the
functionality (displaying an indicator) is working, rather than how it is
working.

The increasing complexity principle does not really apply to this example, so it
was excluded. However if you were to place this test in a suite of other tests,
it would be best to test first that when the component is instructed to load
data then it actually does it. this way both tests fail if the data loading part
breaks and the next developer immediately know the problem is that the data
loading is broken, not that the loading indicator is broken.

# Examples

## Utility Functions

A utility function is a function with no side effects. It takes in arguments and
returns a result or displays an error or console message, like so:

**`StringUtil ellipsis`**

```js
export function ellipsis(text, maxLength, midCharIx = 0, ellipsis = '...') {
  // Do something blackbox. We should not care about the internals,
  // only inputs and outputs.
  ...
  return someFinalValue;
}
```

There are four things to test for in a utility function:

1. Handle Invalid Input
2. Verify default input arguments
3. Verify output for expected input arguments
4. Handle thrown errors

> Handle Invalid Input (handle thrown errors):

```js
it('Throws an error on improper arguments', () => {
  expect(() => {
    ellipsis();
  }).toThrowError("Expected 'text' to be defined");
});
```

> Verify default input arguments:

```js
it('Works with defaults', () => {
  expect(ellipsis('Hello world', 3)).toBe('Hel...');
  expect(ellipsis('', 3)).toBe('');
  expect(ellipsis('H', 3)).toBe('H');
  expect(ellipsis('Hello', 5)).toBe('Hello');
});
```

> Verify output for expected input arguments:

This is especially true for edge cases!

```js
it('Works with midCharIx', () => {
  expect(ellipsis('Hello world', 3, 6)).toBe('...o w...');
  expect(ellipsis('', 3, 6)).toBe('');
  expect(ellipsis('Backstage is amazing', 4, 10)).toBe('...e is...');
});
```

## Non-React Classes

Testing a JavaScript object which is _not_ a React component follows a lot of
the same principles as testing objects in other languages.

### API Testing Principles

Testing an API involves verifying four things:

1. Invalid inputs are caught before being sent to the server.
2. Valid inputs translate into a valid browser request.
3. Server response is translated into an expected JavaScript object.
4. Server errors are handled gracefully.

### Mocking API Calls

[Mocking in Jest](https://facebook.github.io/jest/docs/en/mock-functions.html)
involves wrapping existing functions (like an API call function) with an
alternative.

For example:

**`./MyApi.js`**

```js
export {
  fetchSomethingFromServer: () => {
    // Live production call to a URI. Must be avoided during testing!
    return fetch('blah');
  }
};
```

**`./__mocks__/MyApi.js`**

```js
export {
  fetchSomethingFromServer: () => {
    // Simulate a production call, but avoid jest and just use a promise
    return Promise.resolve('some result object simulating server data here');
  }
}
```

**`./MyApi.test.js`**

```js
/* eslint-disable import/first */

jest.mock('./MyApi'); // Instruct Jest to swap all future imports of './MyApi.js' to './__mocks__/MyApi.js'

import MyApi from './MyApi'; // Will actually return the contents of the file in the __mocks__ folder now

it('loads data', done => {
  MyApi.fetchSomethingFromServer().then(result => {
    expect(result).toBe('some result object simulating server data here');
    done();
  });
});
```

Note: make sure you disable the eslint `'import/first'` rule at the top of the
file since technically you are not allowed by the default settings to have an
import after the `jest.mock` call.

## React Components

### Working with the React Lifecycle

The [React lifecycle](https://reactjs.org/docs/state-and-lifecycle.html) is
asynchronous.

When you call `setState` or update the `props` of a component, there are several
asynchronous stages that must occur before a rerender. Note the following
example:

```jsx
class MyComponent extends Component {
  load() {
    this.setState({loading: true});
  }

  render() {
    return this.state.loading ? <Loading /> : 'Finished!';
  }
}

...

// INCORRECT
it('Test loading', () => {
  const wrapper = mount(<MyComponent />);
  wrapper.load();
  expect(wrapper.find('Loading').length).toEqual(1); // Will fail
});

// CORRECT
it('Test loading', () => {
  const wrapper = mount(<MyComponent />);
  wrapper.load();
  wrapper.update(); // This tells the components to run through a render cycle
  expect(wrapper.find('Loading').length).toEqual(1);
});
```

For more information:

- [React lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)

### Accessing `store`, `theme`, routing, browser history, etc.

The Backstage application has several core providers at its root. To run your
test wrapped in a "dummy" Backstage application, you can use our utility
functions:

**`wrapInTestApp`**

    import { wrapInTestApp } from '../../test-utils';
    ...
    it('Definitely is not a coconut', () => {
      const mangoWrapper = mount(wrapInTestApp(<Mango />));

      expect(mangoWrapper.context().store).toBeDefined();
    });

Note: wrapping in the test application **requires** you to do a `find()` or
`dive()` since the wrapped component is now the application.

# Debugging Jest Tests

Currently, debugging Jest tests using IntelliJ or `node-debugger` is possible
but can be
[problematic to set up.](https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000634564-Debugging-Jest-unit-tests)

It is possible, but you might spend a decent amount of time configuring your
IDE.

In most cases, we have found that using `console.log` works well.

Note: if your console.logs are not being displayed, focus your specific unit
test from the command line by running them like so `yarn test MyTest`.
