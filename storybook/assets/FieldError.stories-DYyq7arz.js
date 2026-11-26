import{j as r,p as d}from"./iframe-7sCYbwMA.js";import{$ as m}from"./Form-DLTQ6Zj9.js";import{$ as a}from"./Input-BK9q61TK.js";import{$ as s}from"./TextField-A5Lb9ggn.js";import{F as o}from"./FieldError-CIpuouNF.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-9GxVsiDp.js";import"./useObjectRef-B-PPvPC_.js";import"./useFormValidation-DK3qTci6.js";import"./useFocusRing-DtQAi71R.js";import"./useHover-Bvne2y_8.js";import"./Hidden-CI0OECmE.js";import"./FieldError-D7hchg2Y.js";import"./Text-CuaSCD0n.js";import"./Autocomplete-M71SjeIb.js";import"./keyboard-kxvRVjZ1.js";import"./getMetaValue-BOiM-Q3U.js";import"./useEvent-DecXtKIc.js";import"./useLabels-BJlFaWLE.js";import"./useLocalizedStringFormatter-BejVMsWK.js";import"./I18nProvider-CNZdU0-i.js";import"./useControlledState-C8ScjM6r.js";import"./Label-LRQoVPax.js";import"./useTextField-VNmKoJ-w.js";import"./useField-BPHR2NpW.js";import"./useLabel-BFjYAAvj.js";import"./useFormReset-CeH0vvgE.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
