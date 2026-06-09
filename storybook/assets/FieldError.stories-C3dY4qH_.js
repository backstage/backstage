import{bR as r,c7 as d}from"./iframe-Bfn8Z101.js";import{a as m}from"./useFormValidation-DuwkDbHw.js";import{c as a}from"./Input-io1PLb_b.js";import{$ as s}from"./TextField-CYtQQioH.js";import{F as o}from"./FieldError-Ctf794jo.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-XG4uf7Bo.js";import"./useObjectRef-l8MwrjaE.js";import"./useFocusRing-B1sGVZpz.js";import"./openLink-Wmfxce7-.js";import"./useHover-D3FDuVpQ.js";import"./Hidden-BEYOsoHc.js";import"./FieldError-B7Mg-tNJ.js";import"./Text-Do5cASgj.js";import"./Autocomplete-DycYkxwD.js";import"./keyboard-WoBMYIQ0.js";import"./useEvent-DnWnmpZ3.js";import"./useLabels-TALAP0nm.js";import"./useLocalizedStringFormatter-DCds1HRH.js";import"./I18nProvider-NTiiPa5B.js";import"./useControlledState-BGa_gSWX.js";import"./Label-DTda4tUe.js";import"./useTextField-JJgFDUPp.js";import"./useField-CavCtq1U.js";import"./useLabel-yazlQB3y.js";import"./useFormReset-xigvcDpm.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
