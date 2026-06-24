import{bR as r,c7 as d}from"./iframe-DhttR-Z-.js";import{a as m}from"./useFormValidation-CWHGY4c7.js";import{c as a}from"./Input-BXU-L0c3.js";import{$ as s}from"./TextField-e3OJ_HSR.js";import{F as o}from"./FieldError-Dl6Hm0lH.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-LkJ3JQqS.js";import"./useObjectRef-BfSKs3Th.js";import"./useFocusRing-BMND1Xfk.js";import"./openLink-DDEWcvNy.js";import"./useHover-DWM3_5-p.js";import"./Hidden-BK8KEPOj.js";import"./FieldError-DMbGr69Y.js";import"./Text-OfXWTW-q.js";import"./Autocomplete-du-Wb1TU.js";import"./keyboard-BZWrF7pG.js";import"./useEvent-BqGsjR8x.js";import"./useLabels-DbXANuou.js";import"./useLocalizedStringFormatter-DPzPf3bZ.js";import"./I18nProvider-DS1fhYi3.js";import"./useControlledState-CmzpYLdm.js";import"./Label-uZej1Dod.js";import"./useTextField-D-rC3zog.js";import"./useField-CV1e6J1X.js";import"./useLabel-DSVSe0FP.js";import"./useFormReset-Buno64eF.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
