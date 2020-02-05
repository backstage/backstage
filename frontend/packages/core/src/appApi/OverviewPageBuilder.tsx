import React, { ComponentType, FC } from 'react';
import { App, AppComponentBuilder } from './types';

type Props = {
  app: App;
  cards: ComponentType<any>[];
};

const OverviewPageComponent: FC<Props> = ({ cards }) => {
  return (
    <div>
      {cards.map(CardComponent => (
        <CardComponent />
      ))}
    </div>
  );
};

type OverviewPageRegistration = {
  type: 'component';
  component: ComponentType<any>;
};

export default class OverviewPageBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<OverviewPageRegistration>();
  private output?: ComponentType<any>;

  addComponent(component: ComponentType<any>): OverviewPageBuilder {
    this.registrations.push({ type: 'component', component });
    return this;
  }

  build(app: App): ComponentType<any> {
    if (this.output) {
      return this.output;
    }

    const cards = this.registrations.map(reg => {
      switch (reg.type) {
        case 'component':
          return reg.component;
        default:
          throw new Error(`Unknown OverviewPageBuilder registration`);
      }
    });

    this.output = () => <OverviewPageComponent app={app} cards={cards} />;
    return this.output;
  }
}
