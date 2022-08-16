import React from 'react';

export class Typeform extends React.Component {
  componentDidMount() {
    console.log('ere');
  }
  render() {
    return (
      <div>
        <div id="hubspotForm"></div>
        
        <script src="https://js.hsforms.net/forms/v2.js" />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `function setupForm() {
            if (typeof window !== undefined) {
                window.hbspt.forms.create({
                portalId: '21894833',
                formId: '9a5aa2af-87f3-4a44-819f-88ee243bb61e',
                target: '#hubspotForm',
                pageId: '79735607665',
              })
            }}` }}>
        </script>
      </div>
    );
  }
}
