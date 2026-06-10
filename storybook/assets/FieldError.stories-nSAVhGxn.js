import{bR as r,c7 as d}from"./iframe-BvJPDVBV.js";import{a as m}from"./useFormValidation-Be_xoFFA.js";import{c as a}from"./Input-BF3XMKmy.js";import{$ as s}from"./TextField-DnEv6vGM.js";import{F as o}from"./FieldError-CrH7yXFX.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Z2mfoDLi.js";import"./useObjectRef-tDMEiP8o.js";import"./useFocusRing-C44Kug38.js";import"./openLink-C9f1t9oF.js";import"./useHover-CdFjvGbq.js";import"./Hidden-DW6-0oV-.js";import"./FieldError-C5h39g8q.js";import"./Text-bpKwXApE.js";import"./Autocomplete-0zyo9vEk.js";import"./keyboard-BQxdBaVL.js";import"./useEvent-CXJCrTg1.js";import"./useLabels-DD4p0Oc1.js";import"./useLocalizedStringFormatter-DrqKOtjs.js";import"./I18nProvider-BN_UnnaB.js";import"./useControlledState-BKLtykmo.js";import"./Label-Dai2jtKU.js";import"./useTextField-BdWGVJZ4.js";import"./useField-Czz_v4cf.js";import"./useLabel-mJoiZaAP.js";import"./useFormReset-DnYrvC4X.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
