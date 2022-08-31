import React from 'react';

export class HubSpotForm extends React.Component {
  render() {
    return (
      <>
        <script src="https://js.hsforms.net/forms/v2.js" />
        <div
          className="Sidebar__Container"
          dangerouslySetInnerHTML={{
            __html: `
          <button class="Sidebar__Button" onclick="toggleFormVisibility()">New Adopters</button>
          <div id="Sidebar__HubSpotContainer"></div>
        `,
          }}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
          if (typeof window !== undefined) {
            window.hbspt.forms.create({
              portalId: '21894833',
              formId: '9a5aa2af-87f3-4a44-819f-88ee243bb61e',
              target: '#Sidebar__HubSpotContainer',
              pageId: '79735607665',
            })
          }

          function toggleFormVisibility() {
            var form = document.querySelector('.Sidebar__Container');
            form.classList.toggle('Sidebar__Container--open');
          }
          `,
          }}
        ></script>
      </>
    );
  }
}
