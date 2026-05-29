import{j as r,p as d}from"./iframe-CY7lbe83.js";import{$ as m}from"./useFormValidation-BVSvJSo1.js";import{$ as a}from"./Input-Bg7y8yar.js";import{$ as s}from"./TextField-Bg1uELbo.js";import{F as o}from"./FieldError-Vjr3-H0Q.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-VYcEwieo.js";import"./useObjectRef-CgmSUdjG.js";import"./useFocusRing--SoVj0Ul.js";import"./openLink-BO2-TBpk.js";import"./useHover-Bn9Qukxg.js";import"./Hidden-tSGVjCBQ.js";import"./FieldError-DjdiVOe2.js";import"./Text-vRRZ87_O.js";import"./Autocomplete-Co0fhdty.js";import"./keyboard-DOb-I_Jw.js";import"./useEvent-CGzLQHsh.js";import"./useLabels-DZeRL03G.js";import"./useLocalizedStringFormatter-Dz6q2bPr.js";import"./I18nProvider-BwtzYg6c.js";import"./useControlledState-D-EZ3Xb3.js";import"./Label-c4yIVKxR.js";import"./useTextField-BSAijlMc.js";import"./useField-6bQfw_6T.js";import"./useLabel-D0Y-IO0Y.js";import"./useFormReset-C_7EFAQX.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
