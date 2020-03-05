import React from 'react';
import Keyboard from './Keyboard';
import { render } from '@testing-library/react';

describe('testUtils.Keyboard', () => {
  it('types into some inputs with focus and submits a form', async () => {
    const typed1 = [];
    const typed2 = [];
    const typed3 = [];

    let submitted = false;
    const handleSubmit = event => {
      event.preventDefault();
      submitted = true;
    };

    const rendered = render(
      <form onSubmit={handleSubmit}>
        <input onChange={({ target: { value } }) => typed1.push(value)} />
        <input onChange={({ target: { value } }) => typed2.push(value)} autoFocus />
        <input onChange={({ target: { value } }) => typed3.push(value)} />
      </form>,
    );

    const keyboard = new Keyboard(rendered);
    await keyboard.send('xy');
    await keyboard.tab();
    await keyboard.send('abc');
    await keyboard.enter();

    expect(typed1).toEqual([]);
    expect(typed2).toEqual(['x', 'xy']);
    expect(typed3).toEqual(['a', 'ab', 'abc']);
    expect(submitted).toBe(true);
  });

  it('can use Keyboard.type to send readable input', async () => {
    const typed1 = [];
    const typed2 = [];
    const typed3 = [];

    let submitted = false;
    const handleSubmit = event => {
      event.preventDefault();
      submitted = true;
    };

    const rendered = render(
      <form onSubmit={handleSubmit}>
        <input defaultValue="1" onChange={({ target: { value } }) => typed1.push(value)} />
        <input defaultValue="2" onChange={({ target: { value } }) => typed2.push(value)} />
        <input defaultValue="3" onChange={({ target: { value } }) => typed3.push(value)} />
      </form>,
    );

    await Keyboard.type(rendered, '<Tab> a <Tab> b <Tab> c <Enter>');

    expect(typed1).toEqual(['1a']);
    expect(typed2).toEqual(['2b']);
    expect(typed3).toEqual(['3c']);
    expect(submitted).toBe(true);
  });

  it('should be able to navigate a radio input with click', async () => {
    const selections = [];

    const rendered = render(
      <div onChange={({ target: { value } }) => selections.push(value)}>
        <input type="radio" name="group" value="a" />
        <input type="radio" name="group" value="b" />
        <input type="radio" name="group" value="c" />
      </div>,
    );

    await Keyboard.type(rendered, '<Tab> <Click> <Tab> <Tab> <Click>');

    expect(selections).toEqual(['a', 'c']);
  });
});
