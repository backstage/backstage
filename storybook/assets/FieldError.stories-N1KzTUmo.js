import{j as r,p as d}from"./iframe-Czj8FpnD.js";import{$ as m}from"./Form-CftNTrRl.js";import{$ as a}from"./Input-CYxhsLNI.js";import{$ as s}from"./TextField-CqZgjUF0.js";import{F as o}from"./FieldError-d4RsaUXq.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Cs3-rVue.js";import"./useObjectRef-CyY6Q9V8.js";import"./useFormValidation-D1qrE1xb.js";import"./useFocusRing-CwUtzNaZ.js";import"./useHover-DmfU1sNI.js";import"./Hidden-D92ts2Xi.js";import"./FieldError-602GnWts.js";import"./Text-BOev6yT9.js";import"./Autocomplete-BDXH7E14.js";import"./keyboard-c2N8M041.js";import"./getMetaValue-DkJYbvS7.js";import"./useEvent-CErUhJ3S.js";import"./useLabels-CAcUUNYA.js";import"./useLocalizedStringFormatter-C-EjHsV9.js";import"./I18nProvider-DcvSd-3L.js";import"./useControlledState-BUpBSTwT.js";import"./Label-Blh7v6VS.js";import"./useTextField-B2QbAykk.js";import"./useField-C3mbQURX.js";import"./useLabel-v9mJauUl.js";import"./useFormReset-DoJay8y7.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const w=["WithServerValidation","WithCustomMessage","WithRenderProp"];export{i as WithCustomMessage,t as WithRenderProp,e as WithServerValidation,w as __namedExportsOrder};
