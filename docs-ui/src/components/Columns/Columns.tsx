import { ReactNode, CSSProperties } from 'react';

export const Columns = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <div className="columns" style={style}>
      {children}
    </div>
  );
};
