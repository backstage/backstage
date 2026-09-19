import{bQ as r,c5 as d}from"./iframe-CPZQIdXt.js";import{a as m}from"./useFormValidation-esOLhpCP.js";import{c as a}from"./Input-CulmNUpA.js";import{$ as s}from"./TextField-CBfZCInM.js";import{F as o}from"./FieldError-DmfO7x--.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DfS0MLG1.js";import"./useObjectRef-Bd12eOMu.js";import"./useFocusRing--8mLVlO1.js";import"./openLink-C87naxyd.js";import"./useHover-CNFNn4CS.js";import"./Hidden-DOapgqgb.js";import"./FieldError-Dygq4nAa.js";import"./Text-p0WAAzoH.js";import"./Autocomplete-BFWBSmC8.js";import"./keyboard-qwYU4mPS.js";import"./useEvent-D7WD1hZR.js";import"./useLabels-j_pZQhad.js";import"./useLocalizedStringFormatter-BLPR5mwD.js";import"./I18nProvider--qafPNbZ.js";import"./useControlledState-C1C-unW2.js";import"./Label-CBzuLVn0.js";import"./useTextField-B0m-e8cO.js";import"./useField-DbqECwXJ.js";import"./useLabel-NKDByoxa.js";import"./useFormReset-sDuCpydg.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
