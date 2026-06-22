import{bR as r,c7 as d}from"./iframe-hQz1Bovf.js";import{a as m}from"./useFormValidation-gBSJNCGj.js";import{c as a}from"./Input-CW3dRuCG.js";import{$ as s}from"./TextField-CoaW_m2b.js";import{F as o}from"./FieldError-DffjU23W.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Pry2iZeD.js";import"./useObjectRef-BZ987qtB.js";import"./useFocusRing-C3OD7nib.js";import"./openLink-B-dyxHNl.js";import"./useHover-DMQGs42H.js";import"./Hidden-BqzmQXOc.js";import"./FieldError-BZqCFV-T.js";import"./Text-CECxUU9A.js";import"./Autocomplete-BGy9sauS.js";import"./keyboard-he29tEj5.js";import"./useEvent--KmV8xmg.js";import"./useLabels-ZBMKhu5T.js";import"./useLocalizedStringFormatter-DjKxePN-.js";import"./I18nProvider-a0qIHqSM.js";import"./useControlledState--W8dIr0F.js";import"./Label-B5koVi8k.js";import"./useTextField-C8_4ZoZz.js";import"./useField-DD1vcu_y.js";import"./useLabel-BRsF9iG_.js";import"./useFormReset-BEXxxxDO.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
