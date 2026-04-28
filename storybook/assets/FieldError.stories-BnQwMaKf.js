import{j as r,p as d}from"./iframe-Tg-tOL7r.js";import{$ as m}from"./useFormValidation-k6uecrX0.js";import{$ as a}from"./Input-CMLuY8KX.js";import{$ as s}from"./TextField-CqNzMH1h.js";import{F as o}from"./FieldError-CUdFfKdT.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BF6W4cub.js";import"./useObjectRef-C0UJtPdT.js";import"./useGlobalListeners-kY5XWfJh.js";import"./openLink-D0gPIJFP.js";import"./useHover-CWLhQr9S.js";import"./Hidden-D5WrUlh8.js";import"./FieldError-CpaBCtW2.js";import"./Text-Cu9crGAR.js";import"./Autocomplete-BZrobcQU.js";import"./keyboard-Yjx4F_O7.js";import"./useEvent-DTez4NK5.js";import"./useLabels-Co5JooNE.js";import"./useLocalizedStringFormatter-Bmgx8Odd.js";import"./I18nProvider-D9-KlzuW.js";import"./useControlledState-DdnZMUzW.js";import"./Label-BcsY5LI4.js";import"./useTextField-DqXrvOAx.js";import"./useField-B40w601G.js";import"./useLabel-SnxCYsm1.js";import"./useFormReset-BokVD26T.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
