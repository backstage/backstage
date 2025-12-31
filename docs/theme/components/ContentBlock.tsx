import React from 'react';

interface ContentBlockProps {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  topImgSrc?: string;
  topImgAlt?: string;
  hasBulletLine?: boolean;
  actionButtons?: Array<{ link: string; label: string }>;
  className?: string;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  title,
  children,
  topImgSrc,
  topImgAlt,
  hasBulletLine,
  actionButtons,
  className = '',
}) => {
  return (
    <div className={`content-block ${hasBulletLine ? 'has-bullet' : ''} ${className}`}>
      {topImgSrc && <img src={topImgSrc} alt={topImgAlt || ''} className="content-block-image" />}
      {title && (
        <div className="content-block-title">
          {typeof title === 'string' ? <h2>{title}</h2> : title}
        </div>
      )}
      {children && <div className="content-block-content">{children}</div>}
      {actionButtons && (
        <div className="content-block-buttons">
          {actionButtons.map((button, idx) => (
            <a key={`${button.link}-${button.label}`} href={button.link} className="button button--primary">
              {button.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
