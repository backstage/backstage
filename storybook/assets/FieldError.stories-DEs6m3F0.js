import{j as r,p as d}from"./iframe-UdCk74ed.js";import{$ as m}from"./useFormValidation-6yachRsj.js";import{$ as a}from"./Input-CDmChuE5.js";import{$ as s}from"./TextField-DvuGJbRC.js";import{F as o}from"./FieldError-CpcfeIz8.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DBWR8goz.js";import"./useObjectRef-DhhSMZ5h.js";import"./useGlobalListeners-DZtXWnZU.js";import"./openLink-CyZ-ce7w.js";import"./useHover-bBIije97.js";import"./Hidden-z08nXuDR.js";import"./FieldError-DoY9AUNK.js";import"./Text-B6PxkOz7.js";import"./Autocomplete-BSrmdtTs.js";import"./keyboard-saoZBt-T.js";import"./useEvent-CfiC_kPm.js";import"./useLabels-BlyDr81M.js";import"./useLocalizedStringFormatter-u5T1Fk6c.js";import"./I18nProvider-Bkoj20Wt.js";import"./useControlledState-DZ-pWBU1.js";import"./Label-DKN-43JP.js";import"./useTextField-D9uATknk.js";import"./useField-Ct7yOJ9P.js";import"./useLabel-D5B70Cjo.js";import"./useFormReset-D_zt92C3.js";const l=d.meta({title:"Backstage UI/FieldError",component:o}),e=l.story({render:()=>r.jsx(m,{validationErrors:{demo:"This is a server validation error."},children:r.jsxs(s,{name:"demo",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{})]})})}),i=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:"This is a custom error message."})]})}),t=l.story({render:()=>r.jsxs(s,{isInvalid:!0,validationBehavior:"aria",validate:()=>"This field is invalid",style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},children:[r.jsx(a,{}),r.jsx(o,{children:({validationErrors:n})=>n.length>0?n[0]:"Field is invalid"})]})});e.input.parameters={...e.input.parameters,docs:{...e.input.parameters?.docs,source:{originalSource:`meta.story({
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
