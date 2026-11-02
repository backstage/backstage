import{j as r,p as d}from"./iframe-DvObL_em.js";import{$ as m}from"./Form-uDPxvokJ.js";import{$ as a}from"./Input-CDWq18l5.js";import{$ as s}from"./TextField-l9fhUN5W.js";import{F as o}from"./FieldError-l6uEQuJ4.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BE29XZkF.js";import"./useObjectRef-DwzLjeGu.js";import"./useFormValidation-B7os7M_X.js";import"./useFocusRing-piHZ0Lw1.js";import"./openLink-Ba7f2eDn.js";import"./useHover-BBinV-uq.js";import"./Hidden-9nwWkQxZ.js";import"./FieldError-CKCHKSwJ.js";import"./Text-DMNz7_bC.js";import"./Autocomplete-BfbdjnJY.js";import"./keyboard-yu4clHGi.js";import"./getMetaValue-aV81Iu2D.js";import"./useEvent-PRo-pXvf.js";import"./useLabels-B4Qm2p4e.js";import"./useLocalizedStringFormatter-CTxy863n.js";import"./I18nProvider-D9Ed_WqX.js";import"./useControlledState-DTrBQisE.js";import"./Label-DVU8J7bE.js";import"./useTextField-B17J0BpL.js";import"./useField-XkonZFVV.js";import"./useLabel-Dnkr3wg9.js";import"./useFormReset-BXzPmcpf.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Form validationErrors={{
    demo: 'This is a server validation error.'
  }}>
      <TextField name="demo" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
        <Input />
        <FieldError />
      </TextField>
    </Form>
})`,...e.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <TextField isInvalid validationBehavior="aria" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>This is a custom error message.</FieldError>
    </TextField>
})`,...i.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <TextField isInvalid validationBehavior="aria" validate={() => 'This field is invalid'} style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <Input />
      <FieldError>
        {({
        validationErrors
      }) => validationErrors.length > 0 ? validationErrors[0] : 'Field is invalid'}
      </FieldError>
    </TextField>
})`,...t.input.parameters?.docs?.source}}};const O=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,O as __namedExportsOrder};
