import{bQ as r,c5 as d}from"./iframe-D3gHomOk.js";import{a as m}from"./useFormValidation-dBRW7xC2.js";import{c as a}from"./Input-DSlTO14n.js";import{$ as s}from"./TextField-DAE38Vdz.js";import{F as o}from"./FieldError-DQhdOycD.js";import"./preload-helper-PPVm8Dsz.js";import"./utils--jiZfpYa.js";import"./useObjectRef-hXxbhaat.js";import"./useFocusRing-DHt_dYoo.js";import"./openLink-BpYvnjEr.js";import"./useHover-ZdERZDwl.js";import"./Hidden-CXwBcFFN.js";import"./FieldError-DZcZSqlY.js";import"./Text-CQOWjHmq.js";import"./Autocomplete-kr6thEjl.js";import"./keyboard-XkEo6qi_.js";import"./useEvent-9StB23wA.js";import"./useLabels-DMTWiEER.js";import"./useLocalizedStringFormatter-zPjMhKe2.js";import"./I18nProvider-Bras-Ck8.js";import"./useControlledState-fmlyVL5h.js";import"./Label-CAWIGhje.js";import"./useTextField-DimOsl7G.js";import"./useField-B6xw7g85.js";import"./useLabel-W6Ub3U1-.js";import"./useFormReset-Dkm8T-fh.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
