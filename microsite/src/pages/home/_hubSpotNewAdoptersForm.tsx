import clsx from 'clsx';
import { useEffect, useState } from 'react';

import hubSpotStyles from './hubSpotNewAdoptersForm.module.scss';

export const HubSpotNewAdoptersForm = () => {
  const [isClosed, setClosed] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          portalId: '21894833',
          formId: '9a5aa2af-87f3-4a44-819f-88ee243bb61e',
          target: `.${hubSpotStyles.hubSpotNewAdopterFormContent}`,
          pageId: '79735607665',
        });
      }
    });
  }, []);

  return (
    <div
      className={clsx(
        hubSpotStyles.hubSpotNewAdopterFormContainer,
        isClosed && 'adoptersFormHidden',
      )}
    >
      <button
        className="button button--primary"
        onClick={() => {
          setClosed(!isClosed);
        }}
      >
        New Adopters
      </button>

      <div
        className={clsx(
          'padding-left--lg padding-vert--lg thin-scrollbar',
          hubSpotStyles.hubSpotNewAdopterFormContent,
        )}
      ></div>
    </div>
  );
};
