import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { wrapInTestApp } from 'testUtils';
import Sequence from 'shared/components/Sequence';

describe('Sequence', () => {
  let steps;
  beforeEach(() => {
    steps = [
      {
        title: 'Step 0',
        content: <div>step0</div>,
      },
      {
        title: 'Step 1',
        content: <div>step1</div>,
        actions: { nextStep: () => 3 },
      },
      {
        title: 'Step 2',
        content: <div>step2</div>,
      },
      {
        title: 'Step 3',
        content: <div>step3</div>,
      },
    ];
  });

  it('Handles nextStep property', () => {
    const rendered = render(wrapInTestApp(<Sequence orientation="horizontal" steps={steps} />));
    fireEvent.click(rendered.getByText('Next'));
    expect(rendered.getByText('step1')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Next'));
    expect(rendered.getByText('step3')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Back'));
    expect(rendered.getByText('step1')).toBeInTheDocument();
  });

  it('Shows controls and content when going back to first step', () => {
    const rendered = render(wrapInTestApp(<Sequence orientation="horizontal" steps={steps} />));
    fireEvent.click(rendered.getByText('Next'));
    expect(rendered.getByText('step1')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Next'));
    expect(rendered.getByText('step3')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Back'));
    expect(rendered.getByText('step1')).toBeInTheDocument();
    expect(rendered.getByText('Next')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Back'));
    expect(rendered.getByText('step0')).toBeInTheDocument();
    expect(rendered.getByText('Next')).toBeInTheDocument();
  });

  it('uses nextText if specified in all steps', () => {
    let nextTextSteps = [
      {
        title: 'Step 0',
        actions: {
          nextText: 'Step0Next',
        },
        content: <div>step0</div>,
      },
      {
        title: 'Final Step',
        actions: {
          nextText: 'FinalStepNext',
        },
        content: <div>final step</div>,
      },
    ];

    const rendered = render(wrapInTestApp(<Sequence orientation="horizontal" steps={nextTextSteps} />));
    expect(rendered.getByText('Step0Next')).toBeInTheDocument();
    fireEvent.click(rendered.getByText('Step0Next'));

    expect(rendered.getByText('FinalStepNext')).toBeInTheDocument();
  });
});
