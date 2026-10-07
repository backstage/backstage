import{j as r,p as d}from"./iframe-WUTgIN9N.js";import{$ as m}from"./useFormValidation-D2qGqtVn.js";import{$ as a}from"./Input-BGT2LOKH.js";import{$ as s}from"./TextField-DamO2Z0X.js";import{F as o}from"./FieldError-BIz7vOwW.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-e_ANvV3R.js";import"./useObjectRef-CHIArbS8.js";import"./useFocusRing-BzNQUgBS.js";import"./openLink-C4ChH1Hb.js";import"./useHover-BXi1yiSF.js";import"./Hidden-cqxb7NEw.js";import"./FieldError-D-4pHLHL.js";import"./Text-C5GiuN3F.js";import"./Autocomplete-Dh0vErH3.js";import"./keyboard-JM-SeqEU.js";import"./useEvent-CKbgSJqF.js";import"./useLabels-DVXgHCjp.js";import"./useLocalizedStringFormatter-tjpZHflc.js";import"./I18nProvider-DmKJ1bjB.js";import"./useControlledState-CP3bPIEi.js";import"./Label-DYgvNgnu.js";import"./useTextField-CnER0ozT.js";import"./useField-CM7_SpaW.js";import"./useLabel-BntByxux.js";import"./useFormReset-BwnM2z0H.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
