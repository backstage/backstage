import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from 'testUtils';
import { Link } from './Link';

describe('<Link />', () => {
  it('Works with children', () => {
    const rendered = render(wrapInTestApp(<Link to="/">Hello</Link>));
    rendered.getByText('Hello');
  });

  it('Works with internal links (localhost)', () => {
    const rendered = render(wrapInTestApp(<Link to="/whatever">Hello</Link>));
    const link = rendered.getByText('Hello');
    expect(link.href).toMatch(/\/whatever$/);
    expect(link.target).toEqual('');
  });

  it('Works with external link', () => {
    const rendered = render(wrapInTestApp(<Link to="http://www.microsoft.com/">Hello</Link>));
    const link = rendered.getByText('Hello');
    expect(link.href).toEqual('http://www.microsoft.com/');
    expect(link.target).toEqual('_blank');
  });

  it('Works with slack channel', () => {
    const rendered = render(wrapInTestApp(<Link slackChannel="tools" />));
    const link = rendered.getByText('#tools');
    expect(link.href).toEqual('https://spotify.slack.com/app_redirect?channel=tools');
    expect(link.target).toEqual('_blank');
  });

  it('Works with slack user', () => {
    const rendered = render(wrapInTestApp(<Link slackUser="@frebenrocks" />));
    const link = rendered.getByText('@frebenrocks');
    expect(link.href).toEqual('https://spotify.slack.com/messages/frebenrocks');
    expect(link.target).toEqual('_blank');
  });

  it('Works with an email', () => {
    const rendered = render(wrapInTestApp(<Link email="bob@wherever.com" />));
    const link = rendered.getByText('bob@wherever.com');
    expect(link.href).toEqual('mailto:bob@wherever.com');
    expect(link.target).toEqual('');
  });

  it('Works with a mailto', () => {
    const rendered = render(wrapInTestApp(<Link to="mailto:bob@wherever.com" />));
    const link = rendered.getByText('bob@wherever.com');
    expect(link.href).toEqual('mailto:bob@wherever.com');
    expect(link.target).toEqual('');
  });

  describe('imitateClickOnSearchItem(searchItem, history)', () => {
    it('it errors when no searchItem provided', () => {
      expect(Link.imitateClickOnSearchItem).toThrow();
    });

    it('it errors when no history provided', () => {
      expect(Link.imitateClickOnSearchItem.bind(undefined, { url: '/some/place' })).toThrow();
    });

    it('properly calls window.open() on absolute url', () => {
      let called = false;

      window.open = () => (called = true);

      Link.imitateClickOnSearchItem({ url: 'http://www.montypython.com/' }, { push: () => {} });

      expect(called).toBe(true);
    });

    it('properly calls history.push() on relative url', () => {
      let called = false;

      Link.imitateClickOnSearchItem(
        { url: '/average-air-speed-velocity/of-a-swallow' },
        { push: () => (called = true) },
      );

      expect(called).toBe(true);
    });
  });
});
