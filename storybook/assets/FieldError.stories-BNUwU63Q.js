import{j as r,p as d}from"./iframe-CsCfxPn_.js";import{$ as m}from"./useFormValidation-CbGwD0tJ.js";import{$ as a}from"./Input-CnzuwThE.js";import{$ as s}from"./TextField-CcoMbdD9.js";import{F as o}from"./FieldError-BKc5kgMW.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DvgauPIn.js";import"./useObjectRef-BxfOcqJ5.js";import"./useGlobalListeners-CpcV6s3I.js";import"./openLink-BrP_7GAS.js";import"./useHover-BQ1b8sFg.js";import"./Hidden-DJH4Ilgv.js";import"./FieldError-DJPjJZjM.js";import"./Text-BUxkZD4S.js";import"./Autocomplete-Cv1VwB81.js";import"./keyboard-BprMhHK9.js";import"./useEvent-CFqEXxMT.js";import"./useLabels-WrXMeIyK.js";import"./useLocalizedStringFormatter-CnHWyO0_.js";import"./I18nProvider-BENFC-9w.js";import"./useControlledState-DnnRo852.js";import"./Label-Hg0cB6oT.js";import"./useTextField-BtzsUAKL.js";import"./useField-D1Yteliv.js";import"./useLabel-BvfmTbEA.js";import"./useFormReset-CmlsYa4s.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const k=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,k as __namedExportsOrder};
