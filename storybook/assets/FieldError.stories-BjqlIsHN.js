import{j as r,p as d}from"./iframe-B3Qnvxa_.js";import{$ as m}from"./Form-CqKyLLrG.js";import{$ as a}from"./Input-BTZAGOQr.js";import{$ as s}from"./TextField-Dsh_S2IC.js";import{F as o}from"./FieldError-Dwf09bo1.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-If5ksnAe.js";import"./useObjectRef-BLUGjhTS.js";import"./useFormValidation-BKFLE_er.js";import"./useFocusRing-kY9ZCJul.js";import"./openLink-DUBrf5Vo.js";import"./useHover-CMuPDAG4.js";import"./Hidden-D0v5Fd-T.js";import"./FieldError-2zCs0NXy.js";import"./Text-BFgsjRxI.js";import"./Autocomplete-CqjB4B8R.js";import"./keyboard-DErvBxra.js";import"./getMetaValue-Bfb9dALM.js";import"./useEvent-DvzpAe6X.js";import"./useLabels-bYYWYrus.js";import"./useLocalizedStringFormatter-BYLeamaS.js";import"./I18nProvider-w0p5O94b.js";import"./useControlledState-Bz4IB1Ec.js";import"./Label-Z8qmlos3.js";import"./useTextField-4reRhcvW.js";import"./useField-DGm2TnJi.js";import"./useLabel-DtpxzJ5z.js";import"./useFormReset-B6lNLtFj.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
