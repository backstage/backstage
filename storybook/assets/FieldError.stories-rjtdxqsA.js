import{bR as r,c7 as d}from"./iframe-Bm5ba6Eo.js";import{a as m}from"./useFormValidation-BwB-mcjl.js";import{c as a}from"./Input-QC44x5uc.js";import{$ as s}from"./TextField-BiKXWiyN.js";import{F as o}from"./FieldError-D7YGnbGV.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-6JHcszxz.js";import"./useObjectRef--OGAdRX4.js";import"./useFocusRing-pVGFXoDo.js";import"./openLink-B3PKQziN.js";import"./useHover-BTqfxkN_.js";import"./Hidden-BsS8bYU7.js";import"./FieldError-BJ3zMt3J.js";import"./Text-B1aMhdj3.js";import"./Autocomplete-DLryka1G.js";import"./keyboard-CfEZ52uC.js";import"./useEvent-BsoZAZmF.js";import"./useLabels-BjdHlKX9.js";import"./useLocalizedStringFormatter-LuBD_Ap4.js";import"./I18nProvider-Bs_Dburj.js";import"./useControlledState-C1wfIORH.js";import"./Label-DY58aZxy.js";import"./useTextField-DBlobsLC.js";import"./useField-4sm3jRhu.js";import"./useLabel-CioGoMcV.js";import"./useFormReset-B0TSkwTz.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
