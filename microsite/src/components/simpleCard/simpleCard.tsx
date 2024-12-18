import { ReactNode } from 'react';

export interface ICardData {
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
}

export const SimpleCard = ({ header, body, footer }: ICardData) => (
  <div className="card">
    <div className="card__header">{header}</div>

    <div className="card__body">{body}</div>

    <div className="card__footer">{footer}</div>
  </div>
);
