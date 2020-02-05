import React, { ComponentType, FC } from 'react';
import { App, AppComponentBuilder } from '../app/types';

type Props = {
  app: App;
  cards: ComponentType<any>[];
};

const WidgetViewComponent: FC<Props> = ({ cards }) => {
  return (
    <div>
      {cards.map(CardComponent => (
        <CardComponent />
      ))}
    </div>
  );
};

type WidgetViewRegistration = {
  type: 'component';
  component: ComponentType<any>;
};

export default class WidgetViewBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<WidgetViewRegistration>();
  private output?: ComponentType<any>;

  addComponent(component: ComponentType<any>): WidgetViewBuilder {
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
          throw new Error(`Unknown WidgetViewBuilder registration`);
      }
    });

    this.output = () => <WidgetViewComponent app={app} cards={cards} />;
    return this.output;
  }
}
