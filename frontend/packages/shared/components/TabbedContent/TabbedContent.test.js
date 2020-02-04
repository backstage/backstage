import React from 'react';
import TabbedContent from './TabbedContent';
import { render, fireEvent } from '@testing-library/react';

describe('TabbedContent', () => {
  describe('A String Key', () => {
    let getByText;

    beforeEach(() => {
      getByText = render(
        <TabbedContent tabs={['tab1', 'tab2']}>
          <div>content1</div>
          <div>content2</div>
        </TabbedContent>,
      ).getByText;
    });

    it('renders the first content on mount', () => {
      expect(getByText('content1')).toBeInTheDocument();
    });

    it('renders all the provided tabs', () => {
      expect(getByText('tab1')).toBeInTheDocument();
      expect(getByText('tab2')).toBeInTheDocument();
    });

    it('handles tab change', () => {
      fireEvent.click(getByText('tab2'));
      expect(getByText('content2')).toBeInTheDocument();
    });

    it('renders the specified tab when specified', () => {
      getByText = render(
        <TabbedContent tabs={['tab1', 'tab2']} initialTab="tab2">
          <div>content1</div>
          <div>content2</div>
        </TabbedContent>,
      ).getByText;
      expect(getByText('content2')).toBeInTheDocument();
    });
  });

  describe('An Object Key', () => {
    let Tabs;
    let tabs = [
      { label: 'tab1', href: '#tab1' },
      { label: <span>tab2</span>, href: '#tab2' },
    ];
    let tabContent = [<div>content1</div>, <div>content2</div>];

    beforeEach(() => {
      Tabs = render(<TabbedContent tabs={tabs} children={tabContent} />);
    });

    it('renders the first content on mount', () => {
      expect(Tabs.getByText('content1')).toBeInTheDocument();
    });

    it('adds anchors to the tabs for deep linking', () => {
      expect(Tabs.container.querySelector('[href="#tab1"]')).toBeInTheDocument();
      expect(Tabs.container.querySelector('[href="#tab2"]')).toBeInTheDocument();
    });

    it('renders all the provided tabs', () => {
      expect(Tabs.getByText('tab1')).toBeInTheDocument();
      expect(Tabs.getByText('tab2')).toBeInTheDocument();
    });

    it('handles tab change', () => {
      fireEvent.click(Tabs.getByText('tab2'));
      expect(Tabs.getByText('content2')).toBeInTheDocument();
    });
  });
});
